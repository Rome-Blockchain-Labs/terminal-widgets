import { ChainId } from '@dynamic-amm/sdk';

export type DexConfig = {
  value?: string;
  name: string;
  icon: string;
  chainIds?: ChainId[];
};

type DexList = { [key: string]: DexConfig };

export const dexListConfig: DexList = {
  apeswap: {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://apeswap.finance/favicon.ico',
    name: 'ApeSwap',
  },
  axial: {
    chainIds: [ChainId.AVAXMAINNET],
    icon: 'https://assets.website-files.com/6189dee5e79d6e8f7e214eba/618bf2f3e40e777d4210a84f_favicon.ico',
    name: 'Axial',
  },
  balancer: {
    chainIds: [ChainId.MAINNET, ChainId.MATIC],
    icon: 'https://app.balancer.fi/favicon.ico',
    name: 'Balancer',
  },
  biswap: {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://biswap.org/logo.png',
    name: 'Biswap',
  },
  curve: {
    chainIds: [ChainId.MAINNET, ChainId.MATIC, ChainId.FANTOM],
    icon: 'https://curve.fi/favicon-32x32.svg',
    name: 'Curve',
  },
  dfyn: {
    chainIds: [ChainId.MATIC],
    icon: 'https://dfyn.network/assets/logos/dfyn-favicon.png',
    name: 'Dfyn',
  },
  dmm: {
    chainIds: [
      ChainId.MAINNET,
      ChainId.MATIC,
      ChainId.BSCMAINNET,
      ChainId.AVAXMAINNET,
      ChainId.FANTOM,
    ],
    icon: 'https://kyberswap.com/favicon.ico',
    name: 'KyberSwap',
  },
  ellipsis: {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://ellipsis.finance/ellipsis-light.png',
    name: 'Ellipsis',
  },
  firebird: {
    chainIds: [ChainId.MATIC, ChainId.BSCMAINNET],
    icon: 'https://app.firebird.finance/favicon.png',
    name: 'Firebird',
  },
  'iron-stable': {
    chainIds: [ChainId.MATIC, ChainId.AVAXMAINNET],
    icon: 'https://iron.finance/icons/icon-72x72.png',
    name: 'IronSwap',
  },
  jetswap: {
    chainIds: [ChainId.MATIC, ChainId.BSCMAINNET, ChainId.FANTOM],
    icon: 'https://jetswap.finance/favicon_io/favicon.ico',
    name: 'JetSwap',
  },
  mdex: {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://cdn.jsdelivr.net/gh/mdexSwap/hswap@main/favicon.png',
    name: 'Mdex',
  },
  nerve: {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8755.png',
    name: 'Nerve',
  },
  oneswap: {
    chainIds: [ChainId.MATIC, ChainId.BSCMAINNET],
    icon: 'https://app.firebird.finance/favicon.png',
    name: 'OneSwap',
  },
  paintswap: {
    chainIds: [ChainId.FANTOM],
    icon: 'https://paintswap.finance/favicon.png',
    name: 'PaintSwap',
  },
  pancake: {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://pancakeswap.finance/favicon.ico',
    name: 'PancakeSwap',
  },
  'pancake-legacy': {
    chainIds: [ChainId.BSCMAINNET],
    icon: 'https://pancakeswap.finance/favicon.ico',
    name: 'PancakeSwap Legacy',
  },
  pangolin: {
    chainIds: [ChainId.AVAXMAINNET],
    icon: 'https://pangolin.exchange/icon.svg',
    name: 'Pangolin',
  },
  polycat: {
    chainIds: [ChainId.MATIC],
    icon: 'https://polycat.finance/favicon-32x32.png',
    name: 'Polycat',
  },
  polydex: {
    chainIds: [ChainId.MATIC],
    icon: 'https://www.polydex.fi/favicon.ico',
    name: 'PolyDex',
  },
  quickswap: {
    chainIds: [ChainId.MATIC],
    icon: 'https://quickswap.exchange/logo_circle.png',
    name: 'QuickSwap',
  },
  spiritswap: {
    chainIds: [ChainId.FANTOM],
    icon: 'https://app.spiritswap.finance/favicon-32x32.png',
    name: 'SpiritSwap',
  },
  spookyswap: {
    chainIds: [ChainId.FANTOM],
    icon: 'https://spookyswap.finance/favicon.ico',
    name: 'SpookySwap',
  },
  sushiswap: {
    chainIds: [ChainId.MAINNET, ChainId.MATIC, ChainId.FANTOM],
    icon: 'https://sushi.com/favicon.ico',
    name: 'SushiSwap',
  },
  synapse: {
    chainIds: [
      ChainId.MAINNET,
      ChainId.BSCMAINNET,
      ChainId.MATIC,
      ChainId.AVAXMAINNET,
      ChainId.FANTOM,
    ],
    icon: 'https://synapseprotocol.com/favicon.ico',
    name: 'Synapse',
  },
  traderjoe: {
    chainIds: [ChainId.AVAXMAINNET],
    icon: 'https://www.traderjoexyz.com/favicon.png',
    name: 'TraderJoe',
  },
  uniswap: {
    chainIds: [ChainId.MAINNET],
    icon: 'https://www.logowik.com/content/uploads/images/uniswap-uni7403.jpg',
    name: 'UniSwap_V2',
  },
  wault: {
    chainIds: [ChainId.MATIC, ChainId.BSCMAINNET],
    icon: 'https://wault.finance/wp-content/uploads/2021/04/cropped-wault-new-favicon-32x32.png',
    name: 'Wault',
  },
};

type DexTypes = {
  [chainId in ChainId | 'all']?: {
    [dex: string]: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  };
};
/*
// dex id - swap fee
1 - 30 (default) = 0.3%
2 - 25
3 - 20
4 - 15
5 - 10
6 - 5
*/
export const dexIds: DexTypes = {
  all: {
    apeswap: 3,
    axial: 3,
    biswap: 5,
    firebird: 1,
    jetswap: 5,
    pancake: 2,
    'pancake-legacy': 2,
    polycat: 2,
    polydex: 5,
    spookyswap: 3,
    wault: 3,
  },
  [ChainId.BSCMAINNET]: {
    jetswap: 1,
  },
  [ChainId.MATIC]: {},
};

export const dexTypes: DexTypes = {
  all: {
    axial: 4,
    balancer: 6,
    curve: 2,
    dmm: 3,
    ellipsis: 2,
    'iron-stable': 4,
    nerve: 1,
    oneswap: 1,
    synapse: 4,
  },
  [ChainId.MAINNET]: {},
  [ChainId.BSCMAINNET]: {},
  [ChainId.MATIC]: {},
  [ChainId.AVAXMAINNET]: {},
  [ChainId.FANTOM]: {},
};

function findDex(exchange: string): DexConfig | undefined {
  const dex = dexListConfig[exchange];
  return dex ? { ...dex, value: exchange } : undefined;
}

export const DEX_TO_COMPARE: { [chainId in ChainId]?: DexConfig } = {
  [ChainId.BSCMAINNET]: findDex('pancake'),
  [ChainId.MATIC]: findDex('quickswap'),
  [ChainId.AVAXMAINNET]: findDex('traderjoe'),
  [ChainId.MAINNET]: findDex('uniswap'),
  [ChainId.FANTOM]: findDex('spookyswap'),
};
