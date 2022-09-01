import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { ChainId } from '@dynamic-amm/sdk';

import { KYBER_MAINNET_ENV } from '../../../config';
import { SUBGRAPH_BLOCK_NUMBER } from './queries';

const EXCHANGE_SUBGRAPH_URLS = {
  avalanche: [
    'https://avax-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-avax',
    'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-avax',
  ],
  avalancheTestnet: [
    'https://api.thegraph.com/subgraphs/name/ducquangkstn/dmm-exchange-fuij',
  ],
  bsc: [
    'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-bsc',
    // 'https://bsc-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-bsc'
  ],
  bscStaging: [
    'https://api.thegraph.com/subgraphs/name/ducquangkstn/dynamic-amm-bsc-staging',
  ],
  bscTestnet: [
    'https://api.thegraph.com/subgraphs/name/ducquangkstn/dynamic-amm-ropsten',
  ],
  fantom: [
    'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-ftm',
    // 'https://fantom-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-ftm'
  ],
  mainnet: ['https://api.thegraph.com/subgraphs/name/dynamic-amm/dynamic-amm'],
  mainnetStaging: [
    'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-staging',
  ],
  mumbai: [
    'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-mumbai',
  ],
  polygon: [
    'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-matic',
    'https://polygon-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-matic',
  ],
  polygonStaging: [
    'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-matic-staging',
  ],
  ropsten: [
    'https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-ropsten',
  ],
};

export function getExchangeSubgraphUrls(networkId: ChainId): string[] {
  switch (networkId) {
    case ChainId.MAINNET:
      if (KYBER_MAINNET_ENV === 'staging') {
        return EXCHANGE_SUBGRAPH_URLS.mainnetStaging;
      } else {
        return EXCHANGE_SUBGRAPH_URLS.mainnet;
      }
    case ChainId.ROPSTEN:
      return EXCHANGE_SUBGRAPH_URLS.ropsten;
    // case ChainId.RINKEBY:
    //   return EXCHANGE_SUBGRAPH_URLS.ropsten
    // case ChainId.GÖRLI:
    //   return EXCHANGE_SUBGRAPH_URLS.ropsten
    // case ChainId.KOVAN:
    //   return EXCHANGE_SUBGRAPH_URLS.ropsten

    case ChainId.MATIC:
      if (KYBER_MAINNET_ENV === 'staging') {
        return EXCHANGE_SUBGRAPH_URLS.polygonStaging;
      } else {
        return EXCHANGE_SUBGRAPH_URLS.polygon;
      }
    case ChainId.MUMBAI:
      return EXCHANGE_SUBGRAPH_URLS.mumbai;
    case ChainId.BSCMAINNET:
      if (KYBER_MAINNET_ENV === 'staging') {
        return EXCHANGE_SUBGRAPH_URLS.bscStaging;
      } else {
        return EXCHANGE_SUBGRAPH_URLS.bsc;
      }
    case ChainId.BSCTESTNET:
      return EXCHANGE_SUBGRAPH_URLS.bscTestnet;
    case ChainId.AVAXMAINNET:
      return EXCHANGE_SUBGRAPH_URLS.avalanche;
    case ChainId.AVAXTESTNET:
      return EXCHANGE_SUBGRAPH_URLS.avalancheTestnet;
    case ChainId.FANTOM:
      return EXCHANGE_SUBGRAPH_URLS.fantom;
    default:
      return EXCHANGE_SUBGRAPH_URLS.mainnet;
  }
}

export async function getExchangeSubgraphClient(
  chainId: ChainId
): Promise<ApolloClient<NormalizedCacheObject>> {
  const subgraphUrls = getExchangeSubgraphUrls(chainId);

  if (subgraphUrls.length === 1) {
    return new ApolloClient({
      cache: new InMemoryCache(),
      uri: subgraphUrls[0],
    });
  }

  const subgraphClients = subgraphUrls.map(
    (uri) =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri,
      })
  );

  const subgraphPromises = subgraphClients.map((client) =>
    client
      .query({
        fetchPolicy: 'network-only',
        query: SUBGRAPH_BLOCK_NUMBER(),
      })
      .catch((e) => {
        console.error(e);
        return e;
      })
  );

  const subgraphQueryResults = await Promise.all(subgraphPromises);

  const subgraphBlockNumbers = subgraphQueryResults.map((res) =>
    res instanceof Error ? 0 : res?.data?._meta?.block?.number || 0
  );

  let bestIndex = 0;
  let maxBlockNumber = 0;

  for (let i = 0; i < subgraphClients.length; i += 1) {
    if (subgraphBlockNumbers[i] > maxBlockNumber) {
      maxBlockNumber = subgraphBlockNumbers[i];
      bestIndex = i;
    }
  }

  return subgraphClients[bestIndex];
}

export const getExchangeSubgraphClients = async () => {
  const chainIds = [ChainId.AVAXMAINNET];
  const promises = chainIds.map((chainId) =>
    getExchangeSubgraphClient(chainId)
  );

  const res = await Promise.all(promises);

  return chainIds.reduce(
    (obj, key, index) => ({ ...obj, [key]: res[index] }),
    {}
  );
};
