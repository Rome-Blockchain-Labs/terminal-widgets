import { useQuery } from '@apollo/client';
import { tokenHierarchyLogic } from '@rbl/velox-common';

import {
  ExchangeType,
  getChainIdByNetworkName,
  NetworkName,
} from '../../constants/networkExchange';
import { mapThisNetworkMULTICHAINSNETWORKSNameToMultiChainNetwork } from '../../constants/networkExchange/tempMaps';
import { getSearchPairsByKeywordQuery } from '../queries';

export const usePairs = (
  blockchain: NetworkName,
  exchange: ExchangeType,
  query?: string
) => {
  const chainId = getChainIdByNetworkName(blockchain);
  const { data, loading } = useQuery(getSearchPairsByKeywordQuery(blockchain), {
    variables: {
      exchange,
      input: `%${query || '0x'}%`, //0x so it matches Velox default query for cache
    },
  });

  const pairs = data && [...data?.pairs];
  if (!loading && pairs) {
    for (const index in pairs) {
      let pair = pairs[index];
      let isToken0BaseOfPair: boolean;

      try {
        isToken0BaseOfPair = tokenHierarchyLogic.isToken0BaseOfPair(
          mapThisNetworkMULTICHAINSNETWORKSNameToMultiChainNetwork[blockchain],
          String(chainId),
          String(pair.token0_address),
          String(pair.token1_address)
        );
      } catch (err) {
        console.error(
          'Could not get token hierarchy for:',
          mapThisNetworkMULTICHAINSNETWORKSNameToMultiChainNetwork[blockchain],
          String(chainId),
          String(pair.token0_address),
          String(pair.token1_address)
        );
        isToken0BaseOfPair = true;
      }

      if (!isToken0BaseOfPair) {
        pair = {
          ...(pair as any),
          token0: pair.token1,
          token0_address: pair.token1_address,
          token1: pair.token0,
          token1_address: pair.token0_address,
        };
        pairs[index] = pair;
      }
    }
  }

  return { data: { pairs }, loading };
};
