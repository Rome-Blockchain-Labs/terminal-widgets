import { useWeb3React } from '@romeblockchain/wallet';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useDebounce, useIsWindowVisible } from '../../../../hooks';
import { updateBlockNumber } from './actions';

export default function Updater(): null {
  const { chainId, provider: library } = useWeb3React();
  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    blockNumber: null,
    chainId,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number')
            return { blockNumber, chainId };
          return {
            blockNumber: Math.max(blockNumber, state.blockNumber),
            chainId,
          };
        }
        return state;
      });
    },
    [chainId, setState]
  );

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined;

    setState({ blockNumber: null, chainId });

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error
        )
      );

    library.on('block', blockNumberCallback);
    return () => {
      library.removeListener('block', blockNumberCallback);
    };
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockNumber ||
      !windowVisible
    )
      return;
    dispatch(
      updateBlockNumber({
        blockNumber: debouncedState.blockNumber,
        chainId: debouncedState.chainId,
      })
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockNumber,
    debouncedState.chainId,
  ]);

  return null;
}
