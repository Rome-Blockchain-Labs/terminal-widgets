import { useWeb3React } from '@romeblockchain/wallet';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useDebounce } from '../../../../hooks';
import { CancelledError, chunkArray, retry } from '../../../../utils';
import { AppDispatch, AppState } from '..';
import { useBlockNumber } from '../application/hooks';
import {
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  parseCallKey,
  updateMulticallResults,
} from './actions';

// chunk calls so we do not exceed the gas limit
const CALL_CHUNK_SIZE = 500;

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(
  allListeners: AppState['multicall']['callListeners'],
  chainId?: number
): { [callKey: string]: number } {
  if (!allListeners || !chainId) return {};
  const listeners = allListeners[chainId];
  if (!listeners) return {};

  return Object.keys(listeners).reduce<{ [callKey: string]: number }>(
    (memo, callKey) => {
      const keyListeners = listeners[callKey];

      memo[callKey] = Object.keys(keyListeners)
        .filter((key) => {
          const blocksPerFetch = parseInt(key);
          if (blocksPerFetch <= 0) return false;
          return keyListeners[blocksPerFetch] > 0;
        })
        .reduce((previousMin, current) => {
          return Math.min(previousMin, parseInt(current));
        }, Infinity);
      return memo;
    },
    {}
  );
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export function outdatedListeningKeys(
  callResults: AppState['multicall']['callResults'],
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  latestBlockNumber: number | undefined
): string[] {
  if (!chainId || !latestBlockNumber) return [];
  const results = callResults[chainId];
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys);

  return Object.keys(listeningKeys).filter((callKey) => {
    const blocksPerFetch = listeningKeys[callKey];

    const data = callResults[chainId][callKey];
    // no data, must fetch
    if (!data) return true;

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1);

    // already fetching it for a recent enough block, don't refetch it
    if (
      data.fetchingBlockNumber &&
      data.fetchingBlockNumber >= minDataBlockNumber
    )
      return false;

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber;
  });
}

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>();
  const { connector } = useWeb3React();
  const state = useSelector<AppState, AppState['multicall']>(
    (state) => state.multicall
  );
  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100);
  const latestBlockNumber = useBlockNumber();
  const { chainId } = useWeb3React();
  const cancellations = useRef<{
    blockNumber: number;
    cancellations: (() => void)[];
  }>();

  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chainId);
  }, [debouncedListeners, chainId]);

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(
      state.callResults,
      listeningKeys,
      chainId,
      latestBlockNumber
    );
  }, [chainId, state.callResults, listeningKeys, latestBlockNumber]);

  const serializedOutdatedCallKeys = useMemo(
    () => JSON.stringify(unserializedOutdatedCallKeys.sort()),
    [unserializedOutdatedCallKeys]
  );

  useEffect(() => {
    if (!latestBlockNumber || !chainId) return;

    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys);
    if (outdatedCallKeys.length === 0) return;
    const calls = outdatedCallKeys.map((key) => parseCallKey(key));

    const chunkedCalls = chunkArray(calls, CALL_CHUNK_SIZE);

    if (cancellations.current?.blockNumber !== latestBlockNumber) {
      cancellations.current?.cancellations?.forEach((c) => c());
    }

    dispatch(
      fetchingMulticallResults({
        calls,
        chainId,
        fetchingBlockNumber: latestBlockNumber,
      })
    );

    cancellations.current = {
      blockNumber: latestBlockNumber,
      cancellations: chunkedCalls.map((chunk, index) => {
        /** non-multicall implementation **/
        const chunkRequests = chunk.map(({ address, callData }) => {
          if (!connector || !connector.provider?.request) {
            return undefined;
          }
          return connector.provider?.request({
            method: 'eth_call',
            params: [{ data: callData, to: address }, 'latest'],
          });
        });
        const { cancel, promise: chunkPromise } = retry(
          () => Promise.all(chunkRequests),
          {
            maxWait: 3500,
            minWait: 2500,
            n: Infinity,
          }
        );
        const promise = (async () => ({
          blockNumber: latestBlockNumber,
          results: await chunkPromise,
        }))();
        promise
          .then(({ blockNumber: fetchBlockNumber, results: returnData }) => {
            cancellations.current = {
              blockNumber: latestBlockNumber,
              cancellations: [],
            };

            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls
              .slice(0, index)
              .reduce<number>((memo, curr) => memo + curr.length, 0);
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length;

            dispatch(
              updateMulticallResults({
                blockNumber: fetchBlockNumber,
                chainId,
                results: outdatedCallKeys
                  .slice(firstCallKeyIndex, lastCallKeyIndex)
                  .reduce<{ [callKey: string]: string | null }>(
                    (memo, callKey, i) => {
                      memo[callKey] = (returnData[i] as any) ?? null;
                      return memo;
                    },
                    {}
                  ),
              })
            );
          })
          .catch((error: any) => {
            if (error instanceof CancelledError) {
              console.debug(
                'Cancelled fetch for blockNumber',
                latestBlockNumber
              );
              return;
            }
            console.error(
              'Failed to fetch multicall chunk',
              chunk,
              chainId,
              error
            );
            dispatch(
              errorFetchingMulticallResults({
                calls: chunk,
                chainId,
                fetchingBlockNumber: latestBlockNumber,
              })
            );
          });
        return cancel;
      }),
    };
  }, [
    chainId,
    dispatch,
    serializedOutdatedCallKeys,
    latestBlockNumber,
    connector,
  ]);

  return null;
}
