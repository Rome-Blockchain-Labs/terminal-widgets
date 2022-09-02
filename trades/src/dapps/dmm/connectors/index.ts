import { ChainId } from '@dynamic-amm/sdk';

import { KYBER_INFURA_KEY } from '../../../config';

export const NETWORK_CHAIN_ID = 43114;

export const NETWORK_CHAIN_NAME: string = 'mainnet';

export const NETWORK_URLS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]:
    'https://ethereum.kyber.network/v1/mainnet/geth?appId=prod-dmm-interface',
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${KYBER_INFURA_KEY}`,
  [ChainId.ROPSTEN]:
    'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  [ChainId.GÖRLI]: `https://goerli.infura.io/v3/${KYBER_INFURA_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${KYBER_INFURA_KEY}`,
  [ChainId.MUMBAI]: 'https://rpc-mumbai.matic.today',
  [ChainId.MATIC]:
    'https://polygon.dmm.exchange/v1/mainnet/geth?appId=prod-dmm',
  [ChainId.BSCTESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  [ChainId.BSCMAINNET]:
    'https://bsc.dmm.exchange/v1/mainnet/geth?appId=prod-dmm-interface',
  [ChainId.AVAXTESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.AVAXMAINNET]:
    'https://avalanche.dmm.exchange/v1/mainnet/geth?appId=prod-dmm',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network ',
};
