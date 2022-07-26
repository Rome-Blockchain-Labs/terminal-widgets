import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { getExchangeSubgraphClients } from '../../apollo/manager';
import useDebounce from '../../hooks/useDebounce';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import { setExchangeSubgraphClient, updateBlockNumber } from './actions';

export default function Updater(): null {
  const { chainId, provider } = useWallets();
  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    blockNumber: null,
    chainId,
  });

  useEffect(() => {
    const getBestSubgraph = async () => {
      const exchangeClients = await getExchangeSubgraphClients();
      dispatch(setExchangeSubgraphClient(exchangeClients));
    };

    getBestSubgraph();
  }, [dispatch]);

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
    if (!provider || !chainId || !windowVisible) return undefined;

    setState({ blockNumber: null, chainId });

    provider
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error
        )
      );

    provider.on('block', blockNumberCallback);
    return () => {
      provider.removeListener('block', blockNumberCallback);
    };
  }, [dispatch, chainId, blockNumberCallback, windowVisible, provider]);

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
