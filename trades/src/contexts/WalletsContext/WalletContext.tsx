import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { AddEthereumChainParameter, Connector } from '@web3-react/types';
import { createContext, FC, useContext, useEffect, useState } from 'react';

import { coinbaseWallet } from '../../connectors/coinbaseWallet';
import { metaMask } from '../../connectors/metaMask';
import {
  getChainIdByNetworkName,
  getNetworkNameFromChainId,
  getNetworkParamByNetworkName,
  NetworkName,
  WalletName,
} from '../../constants/networkExchange';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getName } from '../../utils/getName';

type ProviderProps = {};

type WalletWatchAssetOptions = {
  decimals: number;
  symbol: string;
  address: string;
  image: string;
};

type WalletChangeOptions = {
  allowedWallets?: Array<WalletName>;
  allowedNetworks?: Array<NetworkName>;
};
type WalletsContextState = {
  account: string | null | undefined;
  chainId: number | undefined;
  isOnNetwork: (networkName: NetworkName | Array<NetworkName>) => boolean;
  switchNetwork: (networkName?: NetworkName | undefined) => void;
  promptWalletChange: (options?: WalletChangeOptions) => void;
  promptNetworkChange: (allowedNetworks?: Array<NetworkName>) => void;
  cancelWalletChangePrompt: () => void;
  promptingWalletChange: boolean | Array<WalletName>;
  promptingNetworkChange: boolean | Array<NetworkName>;
  active: boolean;
  connectToWallet: (walletName: WalletName) => void;
  disconnectFromWallet: () => void;
  walletName: WalletName | null;
  switchNetworkToAddTokenWithNetworkName: (
    networkName: NetworkName,
    tokenInfo: WalletWatchAssetOptions
  ) => void;
  switchNetworkToAddTokenWithChainId: (
    chainId: number,
    tokenInfo: WalletWatchAssetOptions
  ) => void;
  setEagerConnect: (value: boolean | ((val: boolean) => boolean)) => void;
  eagerConnect: boolean;
  error: any;
  provider: Web3Provider | undefined;
  connector: Connector | undefined;
  isActivating: boolean;
};

const defaultState: WalletsContextState = {
  account: null,
  active: false,
  cancelWalletChangePrompt: () => {},
  chainId: 43114,
  connectToWallet: () => {},
  connector: undefined,
  disconnectFromWallet: () => {},

  eagerConnect: false,
  error: undefined,
  isActivating: false,
  isOnNetwork: () => false,
  promptNetworkChange: () => {},
  promptWalletChange: () => {},
  promptingNetworkChange: false,
  promptingWalletChange: false,
  provider: undefined,
  setEagerConnect: () => {},
  switchNetwork: async () => {},
  switchNetworkToAddTokenWithChainId: () => {},
  switchNetworkToAddTokenWithNetworkName: () => {},
  walletName: null,
};

const WalletsContext = createContext<WalletsContextState>(defaultState);

export const WalletsContextProvider: FC<ProviderProps> = (props) => {
  const {
    account,
    chainId,
    connector,
    isActivating,
    isActive: active,
    provider,
  } = useWeb3React();
  const walletName = getName(connector);
  const [promptingWalletChange, setPromptingWalletChange] = useState<
    boolean | Array<WalletName>
  >(false);
  const [promptingNetworkChange, setPromptingNetworkChange] = useState<
    boolean | Array<NetworkName>
  >(false);
  const promptWalletChange = (options?: WalletChangeOptions) => {
    if (!options) {
      setPromptingWalletChange(true);
      setPromptingNetworkChange(true);
      return;
    }
    const { allowedNetworks, allowedWallets } = options;
    if (allowedWallets) {
      setPromptingWalletChange(allowedWallets);
    } else {
      setPromptingWalletChange(true);
    }
    if (allowedNetworks) {
      setPromptingNetworkChange(allowedNetworks);
    } else {
      setPromptingNetworkChange(true);
    }
  };
  const cancelWalletChangePrompt = () => {
    setPromptingWalletChange(false);
    setPromptingNetworkChange(false);
  };
  const [eagerConnect, setEagerConnect] = useLocalStorage(
    'eagerConnect',
    false
  );
  const [tried, setTried] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    if (eagerConnect && !tried) {
      if (connector && connector.connectEagerly) {
        connector.connectEagerly();
        setTried(true);
      }
    }
  }, [eagerConnect, connector, tried]);

  const isOnNetwork = (expectedNetwork: NetworkName | Array<NetworkName>) => {
    if (typeof expectedNetwork === 'string') {
      return getChainIdByNetworkName(expectedNetwork) === chainId;
    }
    return expectedNetwork.some(
      (network) => getChainIdByNetworkName(network) === chainId
    );
  };

  const promptNetworkChange = (allowedNetworks?: Array<NetworkName>) => {
    if (allowedNetworks) {
      return setPromptingNetworkChange(allowedNetworks);
    }
    setPromptingNetworkChange(true);
  };

  const switchNetwork = async (networkName: NetworkName | undefined) => {
    if (!active || !networkName) {
      promptWalletChange();
    } else {
      const networkParams = getNetworkParamByNetworkName(networkName);
      if (connector instanceof Network) {
        connector.activate(networkParams.chainId);
      } else {
        const addChainParams: AddEthereumChainParameter = {
          blockExplorerUrls: [networkParams.blockExplorerUrl],
          chainId: networkParams.chainId,
          chainName: networkParams.name,
          nativeCurrency: networkParams.nativeCurrency,
          rpcUrls: [networkParams.rpcUrl],
        };
        connector
          .activate(addChainParams)
          //@ts-ignore
          .then(() => setError(undefined))
          .catch(setError);
      }
      cancelWalletChangePrompt();
    }
  };

  const connectToWallet = async (wallet: WalletName) => {
    await disconnectFromWallet();
    if (wallet === 'coinbase') {
      await coinbaseWallet
        .activate()
        .then(() => {
          setError(undefined);
          window.localStorage.setItem('activeWallet', 'coinbase');
        })
        .catch(setError);
    }

    if (wallet === 'metamask') {
      await metaMask
        .activate()
        .then(() => {
          setError(undefined);
          window.localStorage.setItem('activeWallet', 'metamask');
        })
        .catch(setError);
    }
    setPromptingWalletChange(false);

    setEagerConnect(true);
  };

  const disconnectFromWallet = async () => {
    if (connector.deactivate) {
      //@ts-ignore
      await connector.deactivate();
    } else {
      //@ts-ignore
      await connector?.resetState();
    }
    window.localStorage.removeItem('activeWallet');
    setEagerConnect(false);
  };

  const switchNetworkToAddTokenWithNetworkName = (
    networkName: NetworkName,
    tokenInfo: WalletWatchAssetOptions
  ) => {
    if (!isOnNetwork(networkName)) {
      return switchNetwork(networkName);
    }
    if (connector.watchAsset) {
      connector.watchAsset(tokenInfo);
    }
  };

  const switchNetworkToAddTokenWithChainId = (
    chainId: number,
    tokenInfo: WalletWatchAssetOptions
  ) => {
    const networkName = getNetworkNameFromChainId(chainId);

    if (networkName) {
      switchNetworkToAddTokenWithNetworkName(networkName, tokenInfo);
    }
  };
  return (
    <WalletsContext.Provider
      value={{
        account,
        active,
        cancelWalletChangePrompt,
        chainId,
        connectToWallet,
        connector,
        disconnectFromWallet,
        eagerConnect,
        error,
        isActivating,
        isOnNetwork,
        promptNetworkChange,
        promptWalletChange,
        promptingNetworkChange,
        promptingWalletChange,
        provider,
        setEagerConnect,
        switchNetwork,
        switchNetworkToAddTokenWithChainId,
        switchNetworkToAddTokenWithNetworkName,
        walletName,
      }}
    >
      {props.children}
    </WalletsContext.Provider>
  );
};

export function useWallets() {
  const context = useContext(WalletsContext);
  if (context === undefined) {
    throw new Error('useWallets must be used within a useWalletsProvider');
  }
  return context;
}
