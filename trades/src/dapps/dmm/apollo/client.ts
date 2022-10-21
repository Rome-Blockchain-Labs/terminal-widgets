import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { ChainId } from '@dynamic-amm/sdk';

import { KYBER_AGGREGATOR_API, KYBER_MAINNET_ENV } from '../../../config';

export const defaultExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri:
      KYBER_MAINNET_ENV === 'staging'
        ? 'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-staging'
        : 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-ethereum',
  });

const ropstenExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://api.thegraph.com/subgraphs/name/viet-nv/kyberswap-classic-ropsten',
  });

const mainnetExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri:
      KYBER_MAINNET_ENV === 'staging'
        ? 'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-staging'
        : 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-ethereum',
  });

const maticExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri:
      KYBER_MAINNET_ENV === 'staging'
        ? 'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-matic-staging'
        : 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-polygon',
  });

const mumbaiExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-mumbai',
  });
const bscTestnetExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-bsc',
  });
const bscMainnetExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri:
      KYBER_MAINNET_ENV === 'staging'
        ? 'https://api.thegraph.com/subgraphs/name/ducquangkstn/dynamic-amm-bsc-staging'
        : 'https://api.thegraph.com/subgraphs/name/ducquangkstn/dynamic-amm-ropsten',
  });

const avaxTestnetExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/dmm-exchange-fuij',
  });
const avaxMainnetExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri:
      KYBER_MAINNET_ENV === 'staging'
        ? ''
        : 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-avalanche',
  });

const fantomExchangeClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache: new InMemoryCache(),
    uri:
      KYBER_MAINNET_ENV === 'staging'
        ? 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-fantom'
        : '',
  });

export const exchangeClients: {
  [chainId in ChainId]: ApolloClient<NormalizedCacheObject>;
} = {
  [ChainId.MAINNET]: mainnetExchangeClient,
  [ChainId.ROPSTEN]: ropstenExchangeClient,
  [ChainId.RINKEBY]: ropstenExchangeClient,
  [ChainId.GÖRLI]: ropstenExchangeClient,
  [ChainId.KOVAN]: ropstenExchangeClient,
  [ChainId.MATIC]: maticExchangeClient,
  [ChainId.MUMBAI]: mumbaiExchangeClient,
  [ChainId.BSCTESTNET]: bscTestnetExchangeClient,
  [ChainId.BSCMAINNET]: bscMainnetExchangeClient,
  [ChainId.AVAXTESTNET]: avaxTestnetExchangeClient,
  [ChainId.AVAXMAINNET]: avaxMainnetExchangeClient,
  [ChainId.FANTOM]: fantomExchangeClient,
};

const ropstenBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/edwardevans094/ropsten-blocks',
});

const mainnetBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-ethereum',
});

const maticBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-polygon',
});

const mumbaiBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/piavgh/mumbai-blocks',
});
const bscTestnetBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/ethereum-blocks-bsctestnet',
});
const bscMainnetBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-bsc',
});

const avaxTestnetBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/ethereum-block-fuji',
});

const avaxMainnetBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/avalache-blocks',
});

const fantomBlockClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/fantom-blocks',
});

export const blockClient: {
  [chainId in ChainId]: ApolloClient<NormalizedCacheObject>;
} = {
  [ChainId.MAINNET]: mainnetBlockClient,
  [ChainId.ROPSTEN]: ropstenBlockClient,
  [ChainId.RINKEBY]: ropstenBlockClient,
  [ChainId.GÖRLI]: ropstenBlockClient,
  [ChainId.KOVAN]: ropstenBlockClient,
  [ChainId.MATIC]: maticBlockClient,
  [ChainId.MUMBAI]: mumbaiBlockClient,
  [ChainId.BSCTESTNET]: bscTestnetBlockClient,
  [ChainId.BSCMAINNET]: bscMainnetBlockClient,
  [ChainId.AVAXTESTNET]: avaxTestnetBlockClient,
  [ChainId.AVAXMAINNET]: avaxMainnetBlockClient,
  [ChainId.FANTOM]: fantomBlockClient,
};

//https://router.firebird.finance/bsc/route
export const routerUri: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: `${KYBER_AGGREGATOR_API}/ethereum/route`,
  [ChainId.BSCMAINNET]: `${KYBER_AGGREGATOR_API}/bsc/route`,
  [ChainId.MATIC]: `${KYBER_AGGREGATOR_API}/polygon/route`,
  [ChainId.AVAXMAINNET]: `${KYBER_AGGREGATOR_API}/avalanche/route`,
  [ChainId.FANTOM]: `${KYBER_AGGREGATOR_API}/fantom/route`,
};

// TODO-swapv2: change price uri
export const priceUri: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSCMAINNET]: 'https://price-api.firebird.finance',
  [ChainId.MATIC]: 'https://price-api-polygon.firebird.finance',
  [ChainId.AVAXMAINNET]: '',
};
