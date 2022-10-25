/** Enums **/
import { NetworkName } from './networkExchange';

export type EthereumChainName = 'MAINNET' | 'ROPSTEN' | 'RINKEBY';
export type AvalancheChainName = 'MAINNET' | 'FUJI';
export type BscChainName = 'MAINNET' | 'TESTNET';
export type ChainName = EthereumChainName | AvalancheChainName | BscChainName;
export type ExchangeName =
  | 'UNISWAPV2'
  | 'SUSHISWAP'
  | 'PANGOLIN'
  | 'TRADERJOE'
  | 'PANCAKESWAP'
  | 'BEAMSWAP'
  | 'SOLARBEAM'
  | 'NETSWAP'
  | 'CRYSTALVALE'
  | 'MDEX';

export const NETWORKS = {
  [NetworkName.AVALANCHE]: {
    FUJI: {
      CHAIN_ID: '43113',
      PANGOLIN: { NAME: 'Pangolin' },
    },
    MAINNET: {
      CHAIN_ID: '43114',
      PANGOLIN: { NAME: 'Pangolin' },
      TRADERJOE: { NAME: 'TraderJoe' },
    },
    NAME: 'Avalanche',
    NATIVE_TOKEN_NAME: 'AVAX',
  },
  [NetworkName.BINANCE]: {
    MAINNET: {
      CHAIN_ID: '56',
      PANCAKESWAP: { NAME: 'PancakeSwap' },
      MDEX: { NAME: 'MDex' },
    },
    NAME: 'BSC',
    NATIVE_TOKEN_NAME: 'BNB',
    TESTNET: {
      CHAIN_ID: '97',
      PANCAKESWAP: { NAME: 'PancakeSwap' },
    },
  },
  [NetworkName.ETHEREUM]: {
    MAINNET: {
      CHAIN_ID: '1',
      SUSHISWAP: { NAME: 'SushiSwap' },
      UNISWAPV2: { NAME: 'UniswapV2' },
    },
    NAME: 'Ethereum',
    NATIVE_TOKEN_NAME: 'ETH',
    RINKEBY: {
      CHAIN_ID: '4',
      SUSHISWAP: { NAME: 'SushiSwap' },
      UNISWAPV2: { NAME: 'UniswapV2' },
    },
    ROPSTEN: {
      CHAIN_ID: '3',
      SUSHISWAP: { NAME: 'SushiSwap' },
      UNISWAPV2: { NAME: 'UniswapV2' },
    },
  },
  [NetworkName.MOONBEAM]: {
    MAINNET: {
      BEAMSWAP: { NAME: 'BeamSwap' },
      CHAIN_ID: '1284',
    },
    NAME: 'Moonbeam',
    NATIVE_TOKEN_NAME: 'GLMR',
  },
  [NetworkName.MOONRIVER]: {
    MAINNET: {
      CHAIN_ID: '1285',
      SOLARBEAM: { NAME: 'SolarBeam' },
      SUSHISWAP: { NAME: 'SushiSwap' },
    },
    NAME: 'MoonRiver',
    NATIVE_TOKEN_NAME: 'MOVR',
  },
  [NetworkName.FUJI]: {
    MAINNET: {
      CHAIN_ID: '43113',
    },
    NAME: 'Avalanche',
    NATIVE_TOKEN_NAME: 'AVAX',
  },
  [NetworkName.METIS]: {
    MAINNET: {
      CHAIN_ID: '1088',
      NETSWAP: { NAME: 'Netswap' },
    },
    NAME: 'Metis',
    NATIVE_TOKEN_NAME: 'METIS',
  },
  [NetworkName.RINKEBY]: {
    MAINNET: {
      CHAIN_ID: '43113',
    },
    NAME: 'Rinkeby',
  },
  [NetworkName.OPTIMISM]: {
    MAINNET: {
      CHAIN_ID: '10',
      NETSWAP: { NAME: 'Netswap' },
    },
    NAME: 'Optimistic Ethereum',
    NATIVE_TOKEN_NAME: 'ETH',
  },
  [NetworkName.POLYGON]: {
    MAINNET: {
      CHAIN_ID: '137',
      SUSHISWAP: { NAME: 'SushiSwap' },
    },
    NAME: 'Polygon',
    NATIVE_TOKEN_NAME: 'MATIC',
  },
  [NetworkName.DFK]: {
    MAINNET: {
      CHAIN_ID: '53935',
      CRYSTALVALE: { NAME: 'Crystalvale' },
    },
    NAME: 'DFK',
    NATIVE_TOKEN_NAME: 'JEWEL',
  },
};

const networks = [
  {
    id: 'Ethereum',
    key: 'ETHEREUM',
    subChains: [
      {
        USDTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        exchanges: [
          {
            MULTICALL_ADDRESS: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
            ROUTER_ADDRESS: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            id: 'UniswapV2',
            key: 'UNISWAPV2',
          },
          {
            MULTICALL_ADDRESS: '0x1F98415757620B543A52E61c46B32eB19261F984',
            ROUTER_ADDRESS: '0xe592427a0aece92de3edee1f18e0157c05861564',
            id: 'UniswapV3',
            key: 'UNISWAPV3',
          },
          {
            ROUTER_ADDRESS: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
            id: 'SushiSwap',
            key: 'SUSHISWAP',
          },
        ],
        id: '1',
        key: 'MAINNET',
        nativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '0x58b4f284fc53bbf349c5168d3f82323189b9a1c9',
      },
      {
        USDTokenAddress: '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            id: 'UniswapV2',
            key: 'UNISWAPV2',
          },
          {
            ROUTER_ADDRESS: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
            id: 'SushiSwap',
            key: 'SUSHISWAP',
          },
        ],
        id: '3',
        key: 'ROPSTEN',
        nativeTokenAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '',
      },
      {
        USDTokenAddress: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            id: 'UniswapV2',
            key: 'UNISWAPV2',
          },
          {
            ROUTER_ADDRESS: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
            id: 'SushiSwap',
            key: 'SUSHISWAP',
          },
        ],
        id: '4',
        key: 'RINKEBY',
        nativeTokenAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '0x8334cb816624897ea69219b857bddaab81de0709',
      },
    ],
  },
  {
    id: 'Avalanche',
    key: 'AVALANCHE',
    subChains: [
      {
        USDTokenAddress: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
        exchanges: [
          {
            MULTICALL_ADDRESS: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
            ROUTER_ADDRESS: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106',
            id: 'Pangolin',
            key: 'PANGOLIN',
          },
          {
            MULTICALL_ADDRESS: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
            ROUTER_ADDRESS: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
            id: 'TraderJoe',
            key: 'TRADERJOE',
          },
          {
            MULTICALL_ADDRESS: '0x878dFE971d44e9122048308301F540910Bbd934c',
            ROUTER_ADDRESS: '0x8Efa5A9AD6D594Cf76830267077B78cE0Bc5A5F8',
            id: 'KyberDmm',
            key: 'KYBERDMM',
          },
          {
            MULTICALL_ADDRESS: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
            ROUTER_ADDRESS: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            id: 'SushiSwap',
            key: 'SUSHISWAP',
          },
          {
            ROUTER_ADDRESS: '0x262DcFB36766C88E6A7a2953c16F8defc40c378A',
            id: 'YetiSwap',
            key: 'YETISWAP',
          },
        ],
        id: '43114',
        key: 'MAINNET',
        nativeTokenAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        nativeTokenDecimals: 18,
        //USDT
        veloxProxyAddress: '0x92cf2d93214aB6Bbb30665e6c39ADFDB5a50d8B2',
      },
      {
        USDTokenAddress: '0x2058ec2791dD28b6f67DB836ddf87534F4Bbdf22',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
            id: 'Pangolin',
            key: 'PANGOLIN',
          },
        ],
        id: '43113',
        key: 'FUJI',
        nativeTokenAddress: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
        nativeTokenDecimals: 18,
        //FUJISTABLE
        veloxProxyAddress: '0x49dF6262e4DF834222cA8bcFfBBf787d4e108F80',
      },
    ],
  },
  {
    id: 'BSC',
    key: 'BSC',
    subChains: [
      {
        USDTokenAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
            id: 'PancakeSwap',
            key: 'PANCAKESWAP',
          },
          {
            ROUTER_ADDRESS: '0xe804f3c3e6dda8159055428848fe6f2a91c2b9af',
            id: 'SafeSwap',
            key: 'SAFESWAP',
          },
          {
            MULTICALL_ADDRESS: '0xcf591ce5574258ac4550d96c545e4f3fd49a74ec',
            ROUTER_ADDRESS: '0xDF1A1b60f2D438842916C0aDc43748768353EC25',
            id: 'KyberDmm',
            key: 'KYBERDMM',
          },
          {
            MULTICALL_ADDRESS: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
            ROUTER_ADDRESS: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            id: 'SushiSwap',
            key: 'SUSHISWAP',
          },
          {
            MULTICALL_ADDRESS: '',
            ROUTER_ADDRESS: '0x0384E9ad329396C3A6A401243Ca71633B2bC4333',
            id: 'MDex',
            key: 'MDEX',
          },
          {
            MULTICALL_ADDRESS: '',
            ROUTER_ADDRESS: '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8',
            id: 'BiSwap',
            key: 'BISWAP',
          },
        ],
        id: '56',
        key: 'MAINNET',
        nativeTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        nativeTokenDecimals: 18,
        //BUSD
        veloxProxyAddress: '0x92cf2d93214aB6Bbb30665e6c39ADFDB5a50d8B2',
      },
      {
        USDTokenAddress: '0x8301f2213c0eed49a7e28ae4c3e91722919b8b47',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
            id: 'PancakeSwap',
            key: 'PANCAKESWAP',
          },
        ],
        id: '97',
        key: 'TESTNET',
        nativeTokenAddress: '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f',
        nativeTokenDecimals: 18,
        //BUSD
        veloxProxyAddress: '',
      },
    ],
  },
  {
    id: 'Moonbeam',
    key: 'MOONBEAM',
    subChains: [
      {
        USDTokenAddress: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7',
            id: 'BeamSwap',
            key: 'BEAMSWAP',
          },
        ],
        id: '1284',
        key: 'MAINNET',
        nativeTokenAddress: '0xacc15dc74880c9944775448304b263d191c6077f',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '',
      },
    ],
  },
  {
    id: 'Metis',
    key: 'METIS',
    subChains: [
      {
        USDTokenAddress: '0xea32a96608495e54156ae48931a7c20f0dcc1a21',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56',
            id: 'Netswap',
            key: 'NETSWAP',
          },
        ],
        id: '1088',
        key: 'MAINNET',
        nativeTokenAddress: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '',
      },
    ],
  },
  {
    id: 'MoonRiver',
    key: 'MOONRIVER',
    subChains: [
      {
        USDTokenAddress: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
        exchanges: [
          {
            ROUTER_ADDRESS: '0xAA30eF758139ae4a7f798112902Bf6d65612045f',
            id: 'SolarBeam',
            key: 'SOLARBEAM',
          },
        ],
        id: '1285',
        key: 'MAINNET',
        nativeTokenAddress: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '',
      },
    ],
  },
  {
    id: 'Polygon',
    key: 'POLYGON',
    subChains: [
      {
        USDTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        exchanges: [
          {
            MULTICALL_ADDRESS: '0x1F98415757620B543A52E61c46B32eB19261F984',
            ROUTER_ADDRESS: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
            id: 'UniswapV3',
            key: 'UNISWAPV3',
          },
          {
            ROUTER_ADDRESS: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            id: 'SushiSwap',
            key: 'SUSHISWAP',
          },
        ],
        id: '137',
        key: 'MAINNET',
        nativeTokenAddress: '0x0000000000000000000000000000000000001010',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '',
      },
    ],
  },
  {
    id: 'DFK',
    key: 'DFK',
    subChains: [
      {
        USDTokenAddress: '0x3AD9DFE640E1A9Cc1D9B0948620820D975c3803a',
        exchanges: [
          {
            ROUTER_ADDRESS: '0x3C351E1afdd1b1BC44e931E12D4E05D6125eaeCa',
            id: 'Crystalvale',
            key: 'CRYSTALVALE',
          },
        ],
        id: '53935',
        key: 'MAINNET',
        nativeTokenAddress: '0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260',
        nativeTokenDecimals: 18,
        veloxProxyAddress: '',
      },
    ],
  },
];

/** Inefficient helpers. This could be optimized by mapping data once and reading from a map
 * Running this 100,000 times takes about a millisecond so no rush to fix
 * **/
const getChainData = (
  blockchainName: string,
  chainId: string
):
  | {
      nativeTokenAddress: string;
      nativeTokenDecimals: number;
      USDTokenAddress: string;
      veloxProxyAddress: string;
    }
  | undefined => {
  const blockchain = networks.find(
    (bc) => bc.id.toLowerCase() === blockchainName.toLowerCase()
  );
  return blockchain?.subChains.find((chain) => chain.id === chainId);
};

/** functions to get/check token addresses **/
export const getWrappedNativeToken = (
  blockchainName: string,
  chainId: string
): string => {
  const wrappedNativeTokenAddress = getChainData(
    blockchainName,
    chainId
  )?.nativeTokenAddress;
  if (!wrappedNativeTokenAddress) {
    throw new Error(
      `Could not find native token address for blockchain:${blockchainName}, chainId:${chainId}`
    );
  }
  return wrappedNativeTokenAddress;
};

export const getWrappedNativeTokenData = (
  blockchainName: string,
  chainId: string
): { address: string; decimals: number } => {
  const chainData = getChainData(blockchainName, chainId);
  if (!chainData) {
    throw new Error(
      `Could not find native token address for blockchain:${blockchainName}, chainId:${chainId}`
    );
  }
  return {
    address: chainData.nativeTokenAddress,
    decimals: chainData.nativeTokenDecimals,
  };
};

export const isWrappedNativeToken = (
  blockchainName: string,
  chainId: string,
  address: string
): boolean => {
  return (
    getWrappedNativeToken(blockchainName, chainId).toLowerCase() ===
    address.toLowerCase()
  );
  //Note if the blockchainName and chainId are not found, the exception is not caught here
};

export const getUSDTokenAddress = (
  blockchainName: string,
  chainId: string
): string => {
  const wrappedUSDTokenAddress = getChainData(
    blockchainName,
    chainId
  )?.USDTokenAddress;
  if (!wrappedUSDTokenAddress) {
    throw new Error(
      `Could not find USD token address for blockchain:${blockchainName}, chainId:${chainId}`
    );
  }
  return wrappedUSDTokenAddress;
};

export const getVeloxProxyAddress = (
  blockchainName: string,
  chainId: string
): string => {
  const veloxProxyAddress = getChainData(
    blockchainName,
    chainId
  )?.veloxProxyAddress;
  if (!veloxProxyAddress) {
    throw new Error(
      `Could not find Velox Proxy address for blockchain:${blockchainName}, chainId:${chainId}`
    );
  }
  return veloxProxyAddress;
};

/** Get the router address from the blockchain, chainId and exchange **/
export const getRouterContractAddress = (
  blockchainName: string,
  chainId: string,
  exchangeName: string
): string => {
  const blockchain = networks.find((bc) => bc.id === blockchainName);
  const chain = blockchain?.subChains.find((chain) => chain.id === chainId);
  const exchange = chain?.exchanges.find(
    (exchange) => exchange.id === exchangeName
  );
  const routerAddress = exchange?.ROUTER_ADDRESS;
  if (!routerAddress) {
    throw new Error(
      `Could not find router contract for blockchain:${blockchainName}, chainId:${chainId}, exchangeName${exchangeName}`
    );
  }
  return routerAddress;
};

export const getMulticallContractAddress = (
  networkName: NetworkName,
  exchangeName: ExchangeName
) => {
  const network = networks.find((network) => network.key === networkName);
  let multicallAddress: string | undefined;
  for (const subchain of network?.subChains || []) {
    const exchange = subchain.exchanges.find(
      (exchange) => exchange.key === exchangeName
    );
    if (exchange) {
      multicallAddress = exchange.MULTICALL_ADDRESS;
      break;
    }
  }
  return multicallAddress || '';
};

export type EthereumChainId = 1 | 3 | 4 | 5 | 42;

export type AvalancheChainId = 43113 | 43114;

export type BSCChainId = 56 | 97;

export type MoonRiverChainId = 1285;

export type MoonBeamChainId = 1284;

export type ChainId =
  | EthereumChainId
  | AvalancheChainId
  | BSCChainId
  | MoonRiverChainId
  | MoonBeamChainId;
