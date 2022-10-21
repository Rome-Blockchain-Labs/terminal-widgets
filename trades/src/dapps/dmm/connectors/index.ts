import { ChainId } from '@dynamic-amm/sdk';

import { KYBER_INFURA_KEY } from '../../../config';

export const NETWORK_CHAIN_ID = 43114;

export const NETWORK_CHAIN_NAME: string = 'mainnet';

export const NETWORK_URLS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: 'https://ethereum.kyberengineering.io',
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${KYBER_INFURA_KEY}`,
  [ChainId.ROPSTEN]: 'https://ethereum.kyberengineering.io',
  [ChainId.GÖRLI]: `https://goerli.infura.io/v3/${KYBER_INFURA_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${KYBER_INFURA_KEY}`,
  [ChainId.MUMBAI]: 'https://rpc-mumbai.matic.today',
  [ChainId.MATIC]:
    'https://polygon.dmm.exchange/v1/mainnet/geth?appId=prod-dmm',
  [ChainId.BSCTESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  [ChainId.BSCMAINNET]:
    'https://bsc.dmm.exchange/v1/mainnet/geth?appId=prod-dmm-interface',
  [ChainId.AVAXTESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.AVAXMAINNET]: 'https://avalanche.kyberengineering.io',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network ',
};
