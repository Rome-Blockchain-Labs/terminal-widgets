import { ExchangeName, NetworkName } from '@rbl/velox-common/multiChains';

import PANGOLIN_DEFAULT_TOKEN_LIST_OF_LISTS from './avalanche/pangolin';
import SUSHISWAP_AVALANCHE_DEFAULT_TOKEN_LIST_OF_LISTS from './avalanche/sushiswap';
import TRADER_JOE_DEFAULT_TOKEN_LIST_OF_LISTS from './avalanche/traderjoe';
import YETISWAP_DEFAULT_TOKEN_LIST_OF_LISTS from './avalanche/yetiswap';
import MDEX_DEFAULT_TOKEN_LIST_OF_LISTS from './bsc/mdex';
import PANCAKE_DEFAULT_TOKEN_LIST_OF_LISTS from './bsc/pancake';
import CRYSTALVALE_DEFAULT_TOKEN_LIST_OF_LISTS from './dfk/crystalvale';
import PANCAKE_ETHEREUM_DEFAULT_TOKEN_LIST_OF_LISTS from './ethereum/pancake';
import SUSHISWAP_ETHEREUM_DEFAULT_TOKEN_LIST_OF_LISTS from './ethereum/sushiswap';
import UNISWAP_V2_DEFAULT_TOKEN_LIST_OF_LISTS from './ethereum/uniswapv2';
import NETSWAP_DEFAULT_TOKEN_LIST_OF_LISTS from './metis/netswap';
import BEAMSWAP_DEFAULT_TOKEN_LIST_OF_LISTS from './moonbeam/beamswap';
import SOLARBEAM_DEFAULT_TOKEN_LIST_OF_LISTS from './moonriver/solarbeam';

export type ExchangeTokenListUrlsMap = { [key in ExchangeName]?: string[] };
export type NetworkExchangeTokenListUrlsMap = {
  [key in NetworkName]?: ExchangeTokenListUrlsMap | {};
};

export const BSC_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  MDEX: MDEX_DEFAULT_TOKEN_LIST_OF_LISTS,
  PANCAKESWAP: PANCAKE_DEFAULT_TOKEN_LIST_OF_LISTS,
};

export const AVALANCHE_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  APESWAP: [],
  BABYSWAP: [],
  BAGUETTE: [],
  BEAMSWAP: [],
  BISWAP: [],
  CANARY: [],
  COMPLUSNETWORK: [],
  CRODEX: [],
  CRONASWAP: [],
  CYBORGSWAP: [],
  ELKFINANCE: [],
  'ELLIPSIS.FINANCE': [],
  'KNIGHTSWAP.FINANCE': [],
  KYBERDMM: [],
  LYDIAFINANCE: [],
  MDEX: [],
  'MM.FINANCE': [],
  OLIVESWAP: [],
  PANCAKESWAP: [],
  PANDASWAP: [],
  PANGOLIN: PANGOLIN_DEFAULT_TOKEN_LIST_OF_LISTS,
  QUICKSWAP: [],
  SAFESWAP: [],
  SHIBASWAP: [],
  SOLARBEAM: [],
  SOLARFLARE: [],
  SOLIDEX: [],
  SPIRITSWAP: [],
  SPOOKYSWAP: [],
  STELLASWAP: [],
  SUSHISWAP: SUSHISWAP_AVALANCHE_DEFAULT_TOKEN_LIST_OF_LISTS,
  SYNAPSE: [],
  TRADERJOE: TRADER_JOE_DEFAULT_TOKEN_LIST_OF_LISTS,
  UNISWAPV2: [],
  UNISWAPV3: [],
  'VVS.FINANCE': [],
  YETISWAP: YETISWAP_DEFAULT_TOKEN_LIST_OF_LISTS,
  ZENLINK: [],
  ZEROEXCHANGE: [],
};

export const MOONRIVER_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  SOLARBEAM: SOLARBEAM_DEFAULT_TOKEN_LIST_OF_LISTS,
};
export const MOONBEAM_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  BEAMSWAP: BEAMSWAP_DEFAULT_TOKEN_LIST_OF_LISTS,
};

export const METIS_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  NETSWAP: NETSWAP_DEFAULT_TOKEN_LIST_OF_LISTS,
};

const ETHEREUM_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  PANCAKESWAP: PANCAKE_ETHEREUM_DEFAULT_TOKEN_LIST_OF_LISTS,
  SUSHISWAP: SUSHISWAP_ETHEREUM_DEFAULT_TOKEN_LIST_OF_LISTS,
  UNISWAPV2: UNISWAP_V2_DEFAULT_TOKEN_LIST_OF_LISTS,
};

const DFK_TOKEN_LIST_URLS_MAP: ExchangeTokenListUrlsMap = {
  CRYSTALVALE: CRYSTALVALE_DEFAULT_TOKEN_LIST_OF_LISTS,
};

export const NETWORK_EXCHANGE_TOKEN_LIST_URLS_MAP: NetworkExchangeTokenListUrlsMap =
  {
    AVALANCHE: AVALANCHE_TOKEN_LIST_URLS_MAP,
    BSC: BSC_TOKEN_LIST_URLS_MAP,
    DFK: DFK_TOKEN_LIST_URLS_MAP,
    ETHEREUM: ETHEREUM_TOKEN_LIST_URLS_MAP,
    METIS: METIS_TOKEN_LIST_URLS_MAP,
    MOONBEAM: MOONBEAM_TOKEN_LIST_URLS_MAP,
    MOONRIVER: MOONRIVER_TOKEN_LIST_URLS_MAP,
  };

export const getTokenListUrlsByExchangeName = (
  exchange: ExchangeName,
  network?: NetworkName
): string[] => {
  const networkName = network || 'AVALANCHE';
  const exchangeTokenListMap: any =
    NETWORK_EXCHANGE_TOKEN_LIST_URLS_MAP[networkName] || {};

  return exchangeTokenListMap[exchange] || [];
};
