import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ChainId } from '@dynamic-amm/sdk';
import { useEffect, useState } from 'react';

import { KYBER_MAINNET_ENV } from '../../../../config';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { getExchangeSubgraphUrls } from '../../apollo/manager';
import { GLOBAL_DATA } from '../../apollo/queries';
import useAggregatorVolume from '../../hooks/useAggregatorVolume';
import {
  useBlockNumber,
  useExchangeClient,
} from '../../state/application/hooks';

interface GlobalData {
  dmmFactories: {
    totalVolumeUSD: string;
    totalVolumeETH: string;
    totalFeeUSD: string;
    untrackedVolumeUSD: string;
    untrackedFeeUSD: string;
    totalLiquidityUSD: string;
    totalLiquidityETH: string;
    totalAmplifiedLiquidityUSD: string;
    totalAmplifiedLiquidityETH: string;
    [key: string]: string;
  }[];
  aggregatorData?: {
    totalVolume?: string;
    last24hVolume?: string;
  };
}

export function useGlobalData() {
  const { chainId } = useWallets();
  const blockNumber = useBlockNumber();
  const apolloClient = useExchangeClient();
  const [globalData, setGlobalData] = useState<GlobalData>();
  const aggregatorData = useAggregatorVolume();

  useEffect(() => {
    const getSumValues = (results: { data: GlobalData }[], field: string) => {
      return results
        .reduce(
          (total, item) =>
            total + parseFloat(item?.data?.dmmFactories?.[0]?.[field] || '0'),
          0
        )
        .toString();
    };

    const getResultByChainIds = async (chainIds: ChainId[]) => {
      const allChainPromises = chainIds.map((chain) => {
        const subgraphPromises = getExchangeSubgraphUrls(chain)
          .map((uri) => new ApolloClient({ cache: new InMemoryCache(), uri }))
          .map((client) =>
            client.query({
              fetchPolicy: 'cache-first',
              query: GLOBAL_DATA(chain),
            })
          );
        return subgraphPromises;
      });

      const queryResult = (
        await Promise.all(
          allChainPromises.map((promises) =>
            Promise.any(promises.map((p) => p.catch((e) => e)))
          )
        )
      ).filter((res) => !(res instanceof Error));

      return {
        data: {
          dmmFactories: [
            {
              totalAmplifiedLiquidityETH: getSumValues(
                queryResult,
                'totalAmplifiedLiquidityETH'
              ),
              totalAmplifiedLiquidityUSD: getSumValues(
                queryResult,
                'totalAmplifiedLiquidityUSD'
              ),
              totalFeeUSD: getSumValues(queryResult, 'totalFeeUSD'),
              totalLiquidityETH: getSumValues(queryResult, 'totalLiquidityETH'),
              totalLiquidityUSD: getSumValues(queryResult, 'totalLiquidityUSD'),
              totalVolumeETH: getSumValues(queryResult, 'totalVolumeETH'),
              totalVolumeUSD: getSumValues(queryResult, 'totalVolumeUSD'),
              untrackedFeeUSD: getSumValues(queryResult, 'untrackedFeeUSD'),
              untrackedVolumeUSD: getSumValues(
                queryResult,
                'untrackedVolumeUSD'
              ),
            },
          ],
        },
      };
    };

    async function getGlobalData() {
      let result;

      if (KYBER_MAINNET_ENV === 'production') {
        result = await getResultByChainIds([
          ChainId.MAINNET,
          ChainId.MATIC,
          ChainId.BSCMAINNET,
          ChainId.AVAXMAINNET,
          ChainId.FANTOM,
        ]);
      } else if (KYBER_MAINNET_ENV === 'staging') {
        result = await getResultByChainIds([
          ChainId.ROPSTEN,
          ChainId.MUMBAI,
          ChainId.BSCTESTNET,
          ChainId.AVAXTESTNET,
          ChainId.FANTOM,
        ]);
      } else {
        result = await apolloClient.query({
          fetchPolicy: 'cache-first',
          query: GLOBAL_DATA(chainId as ChainId),
        });
      }

      setGlobalData({
        ...result.data,
        aggregatorData: {
          last24hVolume: aggregatorData?.last24hVolume,
          totalVolume: aggregatorData?.totalVolume,
        },
      });
    }

    getGlobalData();
  }, [chainId, blockNumber, apolloClient, aggregatorData]);

  return globalData;
}
