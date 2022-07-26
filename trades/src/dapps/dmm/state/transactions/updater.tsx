import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { AppDispatch, AppState } from '../../../../store';
import { AGGREGATOR_ROUTER_SWAPPED_EVENT_TOPIC } from '../../constants/index';
import { getFullDisplayBalance } from '../../utils/formatBalance';
import { useAddPopup, useBlockNumber } from '../application/hooks';
import { checkedTransaction, finalizeTransaction } from './actions';

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: {}; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

export default function Updater(): null {
  const { chainId, provider } = useWallets();

  const lastBlockNumber = useBlockNumber();

  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector<AppState, AppState['dapps']['dmm']['transactions']>(
    (state) => state.dapps.dmm.transactions
  );

  const transactions = useMemo(
    () => (chainId ? state[chainId] ?? {} : {}),
    [chainId, state]
  );

  // show popup on confirm
  const addPopup = useAddPopup();

  const parseTransactionSummary = useCallback(
    (receipt: TransactionReceipt): string | undefined => {
      let log = undefined;

      for (let i = 0; i < receipt.logs.length; i++) {
        if (
          receipt.logs[i].topics.includes(AGGREGATOR_ROUTER_SWAPPED_EVENT_TOPIC)
        ) {
          log = receipt.logs[i];
          break;
        }
      }

      // No event log includes Swapped event topic
      if (!log) {
        return transactions[receipt.transactionHash]?.summary;
      }

      // Parse summary message for Swapped event
      if (
        !transactions[receipt.transactionHash] ||
        !transactions[receipt.transactionHash]?.arbitrary
      ) {
        return transactions[receipt.transactionHash]?.summary;
      }

      const inputSymbol =
        transactions[receipt.transactionHash]?.arbitrary?.inputSymbol;
      const outputSymbol =
        transactions[receipt.transactionHash]?.arbitrary?.outputSymbol;
      const inputDecimals =
        transactions[receipt.transactionHash]?.arbitrary?.inputDecimals;
      const outputDecimals =
        transactions[receipt.transactionHash]?.arbitrary?.outputDecimals;
      const withRecipient =
        transactions[receipt.transactionHash]?.arbitrary?.withRecipient;

      if (!inputSymbol || !outputSymbol || !inputDecimals || !outputDecimals) {
        return transactions[receipt.transactionHash]?.summary;
      }

      const decodedValues = ethers.utils.defaultAbiCoder.decode(
        ['address', 'address', 'address', 'address', 'uint256', 'uint256'],
        log.data
      );

      const inputAmount = getFullDisplayBalance(
        BigNumber.from(decodedValues[4].toString()),
        inputDecimals,
        3
      );
      const outputAmount = getFullDisplayBalance(
        BigNumber.from(decodedValues[5].toString()),
        outputDecimals,
        3
      );

      const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;

      return `${base} ${withRecipient ?? ''}`;
    },
    [transactions]
  );

  useEffect(() => {
    if (!chainId || !provider || !lastBlockNumber) return;

    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        provider
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                })
              );

              addPopup(
                {
                  txn: {
                    hash,
                    success: receipt.status === 1,
                    summary: parseTransactionSummary(receipt),
                  },
                },
                hash
              );
            } else {
              dispatch(
                checkedTransaction({
                  blockNumber: lastBlockNumber,
                  chainId,
                  hash,
                })
              );
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error);
          });
      });
  }, [
    chainId,
    transactions,
    lastBlockNumber,
    dispatch,
    addPopup,
    parseTransactionSummary,
    provider,
  ]);

  return null;
}
