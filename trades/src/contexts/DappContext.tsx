import {
  ExchangeName,
  getMulticallContractAddress,
} from '@rbl/velox-common/multiChains';
import ABIs from '@rbl/velox-common/uniV2ClonesSDK/abis';
import { createContext, FC, useMemo, useState } from 'react';

import { getRouterContractAddress, NETWORKS } from '../constants/multichain';
import { NetworkChainId, NetworkName } from '../constants/networkExchange';
import { mapThisNetworkNameToMultiChainNetwork } from '../constants/networkExchange/tempMaps';

type Contract = {
  address: string;
  ABI: any;
};

type ProviderProps = {
  network: NetworkName;
  exchange?: ExchangeName;
  widgetId: string;
};

type DappContextState = ProviderProps & {
  chainId?: NetworkChainId;
  router: Contract;
  multicall: Contract;
  network: NetworkName;
  exchange: ExchangeName | undefined;
  setConfig: (config: Pick<DappContextState, 'network' | 'exchange'>) => void;
};

const defaultContract: Contract = {
  ABI: {},
  address: '',
};

const defaultState: DappContextState = {
  chainId: NetworkChainId.AVALANCHE,
  exchange: 'PANGOLIN',
  multicall: defaultContract,
  network: NetworkName.AVALANCHE,
  router: defaultContract,
  setConfig: () => {},
  widgetId: '',
};

export const DappContext = createContext<DappContextState>(defaultState);

export const DappContextProvider: FC<ProviderProps> = ({
  children,
  exchange: defaultExchange,
  network: defaultNetwork,
  widgetId,
}) => {
  const [config, setConfig] = useState<
    Pick<DappContextState, 'network' | 'exchange'>
  >({
    exchange: defaultExchange,
    network: defaultNetwork || NetworkName.AVALANCHE,
  });

  const { chainId, multicallABI, multicallAddress, routerABI, routerAddress } =
    useMemo(() => {
      if (config.network && config.exchange) {
        const mainnet = NETWORKS[config.network].MAINNET as any;
        const routerAddress = getRouterContractAddress(
          NETWORKS[config.network].NAME,
          NETWORKS[config.network].MAINNET.CHAIN_ID,
          mainnet[config.exchange].NAME
        );

        //note, we might run into problems if the router address is different
        //for the same exchange copied to different networks
        const routerABI = (ABIs as any)[config.exchange]?.ROUTER;
        if (!Object.keys(routerABI || {}).length) {
          throw new Error(
            `unknown router address, exchange:${config.exchange}`
          );
        }
        const multicallAddress = getMulticallContractAddress(
          mapThisNetworkNameToMultiChainNetwork(config.network),
          config.exchange
        );

        const multicallABI = ABIs[config.exchange].MULTICALL;
        const chainId = parseInt(NETWORKS[config.network].MAINNET.CHAIN_ID);

        return {
          chainId,
          multicallABI,
          multicallAddress,
          routerABI,
          routerAddress,
        };
      }
      return {};
    }, [config.exchange, config.network]);

  return (
    <DappContext.Provider
      value={{
        chainId,
        multicall: {
          ABI: multicallABI,
          address: multicallAddress ?? '',
        },
        router: {
          ABI: routerABI,
          address: routerAddress ?? '',
        },
        setConfig,
        widgetId,
        ...config,
      }}
    >
      {children}
    </DappContext.Provider>
  );
};
