import { createAction } from '@reduxjs/toolkit';

import { NetworkChainId } from '../../../../constants/networkExchange';

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

export const addTransaction = createAction<{
  chainId: NetworkChainId;
  hash: string;
  from: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
}>('transactions/addTransaction');
export const clearAllTransactions = createAction<{ chainId: NetworkChainId }>(
  'transactions/clearAllTransactions'
);
export const finalizeTransaction = createAction<{
  chainId: NetworkChainId;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('transactions/finalizeTransaction');
export const checkedTransaction = createAction<{
  chainId: NetworkChainId;
  hash: string;
  blockNumber: number;
}>('transactions/checkedTransaction');
