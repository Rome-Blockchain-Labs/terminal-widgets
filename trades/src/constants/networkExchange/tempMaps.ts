/** Temp stuff to remove **/
import { ExchangeType, NetworkName } from './index';

export const mapThisNetworkNameToMultiChainNetwork = (network: NetworkName) => {
  switch (network) {
    case NetworkName.ETHEREUM:
      return 'ETHEREUM';
    case NetworkName.AVALANCHE:
      return 'AVALANCHE';
    case NetworkName.BINANCE:
      return 'BSC';
    case NetworkName.MOONBEAM:
      return 'MOONBEAM';
    case NetworkName.POLYGON:
      return 'POLYGON';
    case NetworkName.DFK:
      return 'DFK';
    default:
      return 'MOONRIVER';
  }
};

export const mapThisNetworkINIT_CODE_HASHNameToMultiChainNetwork = (
  network: NetworkName
) => {
  switch (network) {
    case NetworkName.ETHEREUM:
      return 'Ethereum';
    case NetworkName.AVALANCHE:
      return 'Avalanche';
    case NetworkName.BINANCE:
      return 'BSC';
    case NetworkName.MOONBEAM:
      return 'Moonbeam';
    case NetworkName.METIS:
      return 'Metis';
    case NetworkName.POLYGON:
      return 'Polygon';
    case NetworkName.DFK:
      return 'DFK';
    default:
      return 'MoonRiver';
  }
};

export const mapThisNetworkMULTICHAINSNETWORKSNameToMultiChainNetwork: {
  [key in NetworkName]: string;
} = {
  [NetworkName.ETHEREUM]: 'Ethereum',
  [NetworkName.AVALANCHE]: 'Avalanche',
  [NetworkName.BINANCE]: 'BSC',
  [NetworkName.MOONBEAM]: 'Moonbeam',
  [NetworkName.METIS]: 'Metis',
  [NetworkName.MOONRIVER]: 'MoonRiver',
  [NetworkName.OPTIMISM]: 'Optimism',
  [NetworkName.FUJI]: 'Fuji',
  [NetworkName.RINKEBY]: 'Rinkeby',
  [NetworkName.POLYGON]: 'Polygon',
  [NetworkName.DFK]: 'DFK',
};

/**
 * May 17, 2022
 * do not use this for anything. It is necessary as we have user state with an exchange,
 * but no network. When this was changed, each exchange belonged to only one network,
 * so this logic was valid then. It is no longer valid now.
 * ---
 * Without leaving this logic, we would have to clear data from the user's machines
 */
const deprecatedNetworkMap: { [key in ExchangeType]?: NetworkName } = {
  beamswap: NetworkName.MOONBEAM,
  pancakeswap: NetworkName.BINANCE,
  pangolin: NetworkName.AVALANCHE,
  safeswap: NetworkName.BINANCE,
  solarbeam: NetworkName.MOONRIVER,
  sushiswap: NetworkName.ETHEREUM,
  traderjoe: NetworkName.AVALANCHE,
  mdex: NetworkName.BINANCE,
};
export const deprecatedGetNetworkFromExchange = (exchange: ExchangeType) => {
  return deprecatedNetworkMap[exchange];
};
