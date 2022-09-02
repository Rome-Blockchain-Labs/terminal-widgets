import { ChainId } from '@dynamic-amm/sdk';
import { createAction } from '@reduxjs/toolkit';

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
  chainId: ChainId;
  hash: string;
  from: string;
  approval?: { tokenAddress: string; spender: string };
  claim?: { recipient: string };
  summary?: string;
  arbitrary?: any;
}>('dmm/transactions/addTransaction');
export const clearAllTransactions = createAction<{ chainId: ChainId }>(
  'dmm/transactions/clearAllTransactions'
);
export const finalizeTransaction = createAction<{
  chainId: ChainId;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('dmm/transactions/finalizeTransaction');
export const checkedTransaction = createAction<{
  chainId: ChainId;
  hash: string;
  blockNumber: number;
}>('dmm/transactions/checkedTransaction');
