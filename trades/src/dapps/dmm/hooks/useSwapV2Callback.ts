import {
  ChainId,
  CurrencyAmount,
  ETHER,
  JSBI,
  Percent,
  TokenAmount,
  TradeOptions,
  TradeOptionsDeadline,
  validateAndParseAddress,
} from '@dynamic-amm/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider } from '@ethersproject/providers';
import getSwapParameters, { SwapV2Parameters } from '@kyberswap/aggregator-sdk';
import { Contract } from 'ethers';
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';

import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import {
  BIPS_BASE,
  ETHER_ADDRESS,
  INITIAL_ALLOWED_SLIPPAGE,
} from '../constants';
import { ROUTER_ADDRESSES_V2 } from '../constants';
import { useTransactionAdder } from '../state/transactions/hooks';
import {
  calculateGasMargin,
  getRouterV2Contract,
  isAddress,
  shortenAddress,
} from '../utils';
import { Aggregator } from '../utils/aggregator';
import { convertToNativeTokenFromETH } from '../utils/dmm';
import { formatCurrencyAmount } from '../utils/formatBalance';
import isZero from '../utils/isZero';
import useENS from './useENS';
import useTransactionDeadline from './useTransactionDeadline';

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract;
  parameters: {
    args: (string | (string | string[])[])[];
    methodName: string;
    value: string;
  };
}

interface SuccessfulCall {
  call: SwapCall;
  gasEstimate: BigNumber;
}

interface FailedCall {
  call: SwapCall;
  error: Error;
}

type EstimatedSwapCall = SuccessfulCall | FailedCall;

function toHex(currencyAmount: CurrencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`;
}

function toSwapAddress(currencyAmount: CurrencyAmount) {
  if (currencyAmount.currency === ETHER) {
    return ETHER_ADDRESS;
  }
  return currencyAmount instanceof TokenAmount
    ? currencyAmount.token.address
    : '';
}

async function getSwapCallParameters(
  trade: Aggregator,
  options: TradeOptions | TradeOptionsDeadline,
  chainId: ChainId,
  library: Web3Provider
): Promise<SwapV2Parameters | undefined> {
  const etherIn = trade.inputAmount.currency === ETHER;
  const etherOut = trade.outputAmount.currency === ETHER;
  // the router does not support both ether in and out
  invariant(!(etherIn && etherOut), 'ETHER_IN_OUT');
  invariant(!('ttl' in options) || options.ttl > 0, 'TTL');

  const to: string = validateAndParseAddress(options.recipient);
  const tokenIn: string = toSwapAddress(trade.inputAmount);
  const tokenOut: string = toSwapAddress(trade.outputAmount);
  const amountIn: string = toHex(
    trade.maximumAmountIn(options.allowedSlippage)
  );
  const amountOut: string = toHex(
    trade.minimumAmountOut(options.allowedSlippage)
  );
  const deadline =
    'ttl' in options
      ? Math.floor(new Date().getTime() / 1000) + options.ttl
      : options.deadline;
  // const useFeeOnTransfer = Boolean(options.feeOnTransfer)
  return getSwapParameters({
    amountIn,
    chainId,
    currencyInAddress: tokenIn,
    currencyInDecimals: trade.inputAmount.currency.decimals,
    currencyOutAddress: tokenOut,
    currencyOutDecimals: trade.outputAmount.currency.decimals,
    customTradeRoute: JSON.stringify(trade.swaps),
    feeConfig: undefined,
    tradeConfig: {
      deadline,
      minAmountOut: amountOut,
      recipient: to,
    },
  });
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapV2CallArguments(
  trade: Aggregator | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] | undefined {
  const { account, chainId, provider } = useWallets();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;
  const deadline = useTransactionDeadline();
  const [swapCalls, setSwapCalls] = useState<SwapCall[]>();
  // const tradeBestExacInAnyway = useTradeExactIn(trade?.inputAmount, trade?.outputAmount.currency || undefined)

  useEffect(() => {
    const generateSwapCalls = async () => {
      if (
        !trade ||
        !recipient ||
        !provider ||
        !account ||
        !chainId ||
        !deadline ||
        !(
          ROUTER_ADDRESSES_V2[chainId as keyof typeof ROUTER_ADDRESSES_V2] || ''
        )
      )
        return [];

      const contract: Contract | null = getRouterV2Contract(
        chainId,
        provider,
        account
      );
      if (!contract) {
        return [];
      }

      const swapParams = await getSwapCallParameters(
        trade,
        {
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          deadline: deadline.toNumber(),
          recipient,
        },
        chainId,
        provider
      );
      if (!swapParams) return [];

      const { args, methodNames, value } = swapParams;

      const swapMethods = methodNames.map((methodName) => ({
        args,
        methodName,
        value,
      }));

      return swapMethods.map((parameters) => ({ contract, parameters }));
    };
    generateSwapCalls().then((res) => setSwapCalls(res));
  }, [account, allowedSlippage, chainId, deadline, provider, recipient, trade]);

  return swapCalls;
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapV2Callback(
  trade: Aggregator | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): {
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: string | null;
} {
  const { account, chainId, provider } = useWallets();

  const swapCalls = useSwapV2CallArguments(
    trade,
    allowedSlippage,
    recipientAddressOrName
  );

  const addTransaction = useTransactionAdder();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !provider || !account || !chainId) {
      return {
        callback: null,
        error: 'Missing dependencies',
        state: SwapCallbackState.INVALID,
      };
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return {
          callback: null,
          error: 'Invalid recipient',
          state: SwapCallbackState.INVALID,
        };
      } else {
        return {
          callback: null,
          error: null,
          state: SwapCallbackState.LOADING,
        };
      }
    }

    return {
      callback: async function onSwap(): Promise<string> {
        if (!swapCalls) return '';
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              contract,
              parameters: { args, methodName, value },
            } = call;
            const options = !value || isZero(value) ? {} : { value };
            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                };
              })
              .catch((gasError) => {
                console.debug(
                  'Gas estimate failed, trying eth_call to extract error',
                  call
                );
                console.debug(
                  '%c ...',
                  'background: #009900; color: #fff',
                  methodName,
                  args,
                  options
                );

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.debug(
                      'Unexpected successful call after failed estimate gas',
                      call,
                      gasError,
                      result
                    );
                    return {
                      call,
                      error: new Error(
                        'estimatedCalls exception: Unexpected issue with estimating the gas. Please try again.'
                      ),
                    };
                  })
                  .catch(
                    (callError: {
                      reason: any;
                      data: { message: any };
                      message: any;
                    }) => {
                      console.debug('Call threw error', call, callError);
                      const reason =
                        callError.reason ||
                        callError.data?.message ||
                        callError.message;
                      // switch (reason) {
                      //   case 'execution reverted: DmmExchangeRouter: INSUFFICIENT_OUTPUT_AMOUNT':
                      //   case 'execution reverted: DmmExchangeRouter: EXCESSIVE_INPUT_AMOUNT':
                      //     errorMessage =
                      //       'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                      //     break
                      //   default:
                      //     errorMessage = `The transaction cannot succeed due to error: ${reason}. This is probably an issue with one of the tokens you are swapping.`
                      // }
                      return {
                        call,
                        error: new Error('estimatedCalls exception: ' + reason),
                      };
                    }
                  );
              });
          })
        );

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el &&
            (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        );
        // return new Promise((resolve, reject) => resolve(""))
        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter(
            (call): call is FailedCall => 'error' in call
          );
          if (errorCalls.length > 0)
            throw errorCalls[errorCalls.length - 1].error;
          throw new Error(
            'gasEstimate not found: Unexpected error. Please contact support: none of the calls threw an error'
          );
        }

        const {
          call: {
            contract,
            parameters: { args, methodName, value },
          },
          gasEstimate,
        } = successfulEstimation;

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value)
            ? { from: account, value }
            : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = convertToNativeTokenFromETH(
              trade.inputAmount.currency,
              chainId
            ).symbol;
            const outputSymbol = convertToNativeTokenFromETH(
              trade.outputAmount.currency,
              chainId
            ).symbol;
            const inputAmount = formatCurrencyAmount(trade.inputAmount);
            const outputAmount = formatCurrencyAmount(trade.outputAmount);

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
            const withRecipient =
              recipient === account
                ? undefined
                : `to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`;

            addTransaction(response, {
              arbitrary: {
                inputDecimals: trade.inputAmount.currency.decimals,
                inputSymbol,
                outputDecimals: trade.outputAmount.currency.decimals,
                outputSymbol,
                withRecipient,
              },
              summary: `${base} ${withRecipient ?? ''}`,
            });

            return response.hash;
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.');
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error('Swap failed', error, methodName, args, value);
              throw new Error(`Swap failed: ${error.message}`);
            }
          });
      },
      error: null,
      state: SwapCallbackState.VALID,
    };
  }, [
    trade,
    provider,
    account,
    chainId,
    recipient,
    recipientAddressOrName,
    swapCalls,
    addTransaction,
  ]);
}
