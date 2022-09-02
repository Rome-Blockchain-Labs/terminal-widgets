import {
  CurrencyAmount,
  ETHER,
  TokenAmount,
  Trade,
  ZERO,
} from '@dynamic-amm/sdk';
import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@romeblockchain/wallet';
import { useCallback, useMemo } from 'react';

import { ROUTER_ADDRESSES, ROUTER_ADDRESSES_V2 } from '../constants';
import { useTokenAllowance } from '../data/Allowances';
import { Field } from '../state/swap/actions';
import {
  useHasPendingApproval,
  useTransactionAdder,
} from '../state/transactions/hooks';
import { calculateGasMargin } from '../utils';
import { Aggregator } from '../utils/aggregator';
import { convertToNativeTokenFromETH } from '../utils/dmm';
import { computeSlippageAdjustedAmounts } from '../utils/prices';
import { useTokenContract } from './useContract';

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useWeb3React();
  const token =
    amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const currentAllowance = useTokenAllowance(
    token,
    account ?? undefined,
    spender
  );
  const pendingApproval = useHasPendingApproval(token?.address, spender);
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is

    return currentAllowance.equalTo(ZERO)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!token) {
      console.error('no token');
      return;
    }

    if (!tokenContract) {
      console.error('tokenContract is null');
      return;
    }

    if (!amountToApprove) {
      console.error('missing amount to approve');
      return;
    }

    if (!spender) {
      console.error('no spender');
      return;
    }

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, MaxUint256)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.estimateGas.approve(
          spender,
          amountToApprove.raw.toString()
        );
      });

    return tokenContract
      .approve(
        spender,
        useExact ? amountToApprove.raw.toString() : MaxUint256,
        {
          gasLimit: calculateGasMargin(estimatedGas),
        }
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          approval: { spender: spender, tokenAddress: token.address },
          summary:
            'Approve ' +
            convertToNativeTokenFromETH(amountToApprove.currency, chainId)
              .symbol,
        });
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error);
        throw error;
      });
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    addTransaction,
    chainId,
  ]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade?: Trade,
  allowedSlippage = 0
) {
  const { chainId } = useWeb3React();
  const amountToApprove = useMemo(
    () =>
      trade
        ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT]
        : undefined,
    [trade, allowedSlippage]
  );
  return useApproveCallback(
    amountToApprove,
    !!chainId
      ? ROUTER_ADDRESSES[chainId as keyof typeof ROUTER_ADDRESSES]
      : undefined
  );
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTradeV2(
  trade?: Aggregator,
  allowedSlippage = 0
) {
  const { chainId } = useWeb3React();
  const amountToApprove = useMemo(
    () =>
      trade
        ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT]
        : undefined,
    [trade, allowedSlippage]
  );
  return useApproveCallback(
    amountToApprove,
    !!chainId
      ? ROUTER_ADDRESSES_V2[chainId as keyof typeof ROUTER_ADDRESSES_V2]
      : undefined
  );
}