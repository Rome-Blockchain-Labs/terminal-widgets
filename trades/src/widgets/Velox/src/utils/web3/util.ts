import { NETWORKS } from '@rbl/velox-common/multiChains';

import { NetworkName } from '../../../../../constants/networkExchange';

const DEFAULT_NETWORK_NAME_KEY = 'selected_network_name';

export const getDefaultNetworkName = () => {
  return localStorage.getItem(DEFAULT_NETWORK_NAME_KEY) || NetworkName.ETHEREUM;
};

export const setDefaultNetworkName = (name: string) => {
  localStorage.setItem(DEFAULT_NETWORK_NAME_KEY, name.toLowerCase());
};

export const getNativeTokenSymbol = () => {
  const network =
    getDefaultNetworkName().toUpperCase() as keyof typeof NETWORKS;

  return NETWORKS[network].NATIVE_TOKEN_NAME;
};

export const getWrappedNativeTokenSymbol = () => {
  return `W${getNativeTokenSymbol()}`;
};

export const getWrappedNativeTokenName = () => {
  return `Wrapped ${getNativeTokenSymbol()}`;
};
