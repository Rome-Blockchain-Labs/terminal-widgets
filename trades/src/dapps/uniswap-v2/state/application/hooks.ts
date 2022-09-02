import { useWeb3React } from '@romeblockchain/wallet';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '..';
import {
  addPopup,
  PopupContent,
  removePopup,
  toggleSettingsMenu,
  toggleWalletModal,
} from './actions';

export function useBlockNumber(): number | undefined {
  const { chainId } = useWeb3React();

  return useSelector(
    (state: AppState) => state.application.blockNumber[chainId ?? -1]
  );
}

export function useWalletModalOpen(): boolean {
  return useSelector((state: AppState) => state.application.walletModalOpen);
}

export function useWalletModalToggle(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(toggleWalletModal()), [dispatch]);
}

export function useSettingsModalOpen(): boolean {
  return useSelector((state: AppState) => state.application.settingsMenuOpen);
}

export function useSettingsModalToggle(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(toggleSettingsMenu()), [dispatch]);
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch();

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }));
    },
    [dispatch]
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
}

// get the list of networkLogos popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}