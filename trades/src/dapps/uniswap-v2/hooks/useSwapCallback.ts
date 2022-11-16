import { BigNumber } from '@ethersproject/bignumber';
import {
  JSBI,
  Percent,
  SwapParameters,
  Trade,
  TradeType,
} from '@rbl/velox-common/uniV2ClonesSDK';
import NetswapRouter from '@rbl/velox-common/uniV2ClonesSDK/routers/netswap';
import PangolinRouter from '@rbl/velox-common/uniV2ClonesSDK/routers/pangolin';
import UniswapRouter from '@rbl/velox-common/uniV2ClonesSDK/routers/uniswap';
import {widgetBridge} from '@romeblockchain/bridge';
import { useWeb3React } from '@romeblockchain/wallet';
import { Contract } from 'ethers';
import { useContext, useMemo } from 'react';

import {
  BIPS_BASE,
  DEFAULT_DEADLINE_FROM_NOW,
  INITIAL_ALLOWED_SLIPPAGE,
} from '../../../constants';
import { NetworkChainId } from '../../../constants/networkExchange';
import { DappContext } from '../../../contexts';
import {
  calculateGasMargin,
  getDefaultCurrencySymbol,
  getRouterContract,
  isAddress,
  isZero,
  shortenAddress,
} from '../../../utils';
import { useTransactionAdder } from '../state/transactions/hooks';
import useENS from './useENS';

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract;
  parameters: SwapParameters;
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

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, provider: library } = useWeb3React();
  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const {
    router: { ABI: routerABI, address: routerAddress },
  } = useContext(DappContext);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId) return [];

    const contract: Contract | null = getRouterContract(
      routerAddress,
      routerABI,
      library,
      account
    );
    if (!contract) {
      return [];
    }

    const swapMethods = [];

    /** While the functionality between uniswapv2 clone smart contract is the same,
     * Some exchanges have renamed the function named. For example:
     * swapExactAVAXForTokens is renamed to swapExactAVAXForTokens on pangolin
     * but it is not renamed on pancakeswap (it still says ETH not BSC)
     * -----
     * Controlling this needs to be done on a case by case basis per exchange
     * **/
    //deciding based on chainId isn't perfect as we should manage on a per exchange level
    let Router;
    switch (chainId) {
      case NetworkChainId.AVALANCHE: //works for trader joe and pangolin
        Router = PangolinRouter;
        break;
      case NetworkChainId.METIS:
        Router = NetswapRouter;
        break;
      default:
        Router = UniswapRouter;
    }

    swapMethods.push(
      Router.swapCallParameters(trade, {
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        feeOnTransfer: false,
        recipient,
        ttl: deadline,
      })
    );

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          feeOnTransfer: true,
          recipient,
          ttl: deadline,
        })
      );
    }

    return swapMethods.map((parameters) => ({ contract, parameters }));
  }, [
    account,
    allowedSlippage,
    chainId,
    deadline,
    library,
    recipient,
    routerABI,
    routerAddress,
    trade,
  ]);
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): {
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: string | null;
} {
  const { account, chainId, provider: library } = useWeb3React();

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    deadline,
    recipientAddressOrName
  );

  const addTransaction = useTransactionAdder();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
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
                        'Unexpected issue with estimating the gas. Please try again.'
                      ),
                    };
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError);
                    const isSlippageError = [
                      'INSUFFICIENT_OUTPUT_AMOUNT',
                      'EXCESSIVE_INPUT_AMOUNT',
                    ].some((s) => callError?.data?.message?.includes(s));
                    if (isSlippageError) {
                      return {
                        call,
                        error: new Error(
                          'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                        ),
                      };
                    }
                    return {
                      call,
                      error: new Error(
                        `The transaction cannot succeed due to error: ${callError.data.message}. This is probably an issue with one of the tokens you are swapping.`
                      ),
                    };
                  });
              });
          })
        );

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el &&
            (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        );

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter(
            (call): call is FailedCall => 'error' in call
          );
          if (errorCalls.length > 0)
            throw errorCalls[errorCalls.length - 1].error;
          throw new Error(
            'Unexpected error. Please contact support: none of the calls threw an error'
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
            widgetBridge.sendAnalyticsEvent('uniswap_v2_swap', {
              chain_id:(trade.inputAmount.currency as any)?.chainId,
              exchange_router_address: contract.address,
              input_address:(trade.inputAmount.currency as any)?.address,
              input_amount:trade.inputAmount.toExact(),
              output_address:(trade.outputAmount.currency as any)?.address,
              output_amount:trade.outputAmount.toExact(),
            })
            const inputSymbol = getDefaultCurrencySymbol(
              trade.inputAmount.currency
            );
            const outputSymbol = getDefaultCurrencySymbol(
              trade.outputAmount.currency
            );
            const inputAmount = trade.inputAmount.toSignificant(3);
            const outputAmount = trade.outputAmount.toSignificant(3);

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`;

            addTransaction(response, {
              summary: withRecipient,
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
    library,
    account,
    chainId,
    recipient,
    recipientAddressOrName,
    swapCalls,
    addTransaction,
  ]);
}
