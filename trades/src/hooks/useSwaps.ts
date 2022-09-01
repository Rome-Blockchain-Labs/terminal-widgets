import uniqueBy from '@popperjs/core/lib/utils/uniqueBy';
import { differenceBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExchangeType, NetworkName } from '../constants/networkExchange';
import {
  Avalanche_Tokenswaps_With_Prices,
  OnSwapSubscription,
  OnSwapSubscriptionVariables,
  Order_By,
} from '../generated/graphql';
import client from '../gql/apollo-client';
import { getPairSwapQuery, getPairSwapSubscription } from '../gql/queries';
import { OrderBy } from '../types';
import { useIsMounted, useSubscription } from '.';

type ResultType = Pick<
  Avalanche_Tokenswaps_With_Prices,
  | 'direction'
  | 'price'
  | 'usd_price'
  | 'txhash'
  | 'swapindex'
  | 'timestamp'
  | 'base_token'
  | 'quote_token'
>;

export const useSwaps = (
  blockchain: NetworkName,
  exchange: ExchangeType,
  pairAddress: string,
  token0?: string,
  token1?: string,
  limit: number = 30
) => {
  const mounted = useIsMounted();
  const [data, setData] = useState<ResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState<OrderBy>();
  const [subscribed, setSubscribed] = useState(true);

  const { data: subscribedData } = useSubscription<
    OnSwapSubscription,
    OnSwapSubscriptionVariables
  >(getPairSwapSubscription(blockchain), {
    skip: !token0 || !token1 || !subscribed,
    variables: {
      baseToken: token0?.toLowerCase(),
      exchange,
      limit: 5,
      pairAddress,
      quoteToken: token1?.toLowerCase(),
    },
  });

  const subscribedDataForCurrentPair = useMemo(
    () =>
      subscribedData?.swap
        .filter(
          (row) =>
            row.base_token === token0?.toLowerCase() &&
            row.quote_token === token1?.toLowerCase()
        )
        .map((rowData) => ({ ...rowData, isSubscription: true })),
    [subscribedData, token0, token1]
  );

  const fetch = useCallback(
    async (
      token0: string,
      token1: string,
      pairAddress: string,
      limit: number,
      offset: number,
      orderBy: OrderBy
    ) => {
      return await client.query({
        fetchPolicy: 'no-cache',
        query: getPairSwapQuery(blockchain),
        variables: {
          baseToken: token0.toLowerCase(),
          exchange,
          limit,
          offset,
          orderBy,
          pairAddress: pairAddress,
          quoteToken: token1.toLowerCase(),
        },
      });
    },
    [blockchain, exchange]
  );

  const fetchMore = useCallback(() => {
    if (token0 && token1) {
      setLoading(true);
      fetch(
        token0,
        token1,
        pairAddress,
        limit || 100,
        data.length,
        orderBy || { timestamp: Order_By.Desc }
      )
        .then((result) => {
          if (mounted.current) {
            if (result.data.swap.length) {
              const uniqueData = uniqueBy(
                [...data, ...result.data.swap],
                (rowData) => rowData.txhash + rowData.swapindex
              );
              setData(uniqueData);
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          if (mounted.current) {
            setLoading(false);
          }
        });
    }
  }, [data, fetch, limit, mounted, orderBy, token0, token1, pairAddress]);

  const sort = useCallback(
    (orderBy: OrderBy) => {
      if (token0 && token1 && limit) {
        setOrderBy(orderBy);
        fetch(token0, token1, pairAddress, limit || 100, 0, orderBy).then(
          (result) => {
            if (mounted.current) {
              setData(result.data.swap);
              setHasMore(true);
            }
          }
        );
      }
    },
    [fetch, limit, mounted, token0, token1, pairAddress]
  );

  const enableSubscription = useCallback(() => {
    if (subscribed) {
      return;
    }

    if (token0 && token1) {
      fetch(token0, token1, pairAddress, limit, 0, {
        timestamp: Order_By.Desc,
      }).then((result) => {
        if (mounted.current) {
          setData(result.data.swap);
          setSubscribed(true);
        }
      });
    }
  }, [fetch, limit, mounted, subscribed, token0, token1, pairAddress]);

  const preventSubscription = useCallback(() => {
    setSubscribed(false);
  }, []);

  useEffect(() => {
    if (token0 && token1) {
      setData([]);
      fetch(token0, token1, pairAddress, limit, 0, {
        timestamp: Order_By.Desc,
      }).then((result) => {
        if (mounted.current) {
          setData(result.data.swap);
        }
      });
    }
  }, [fetch, limit, mounted, token0, token1, pairAddress]);

  useEffect(() => {
    if (data.length) {
      const newData = differenceBy(
        subscribedDataForCurrentPair,
        data,
        (row) => {
          return row.txhash + row.swapindex;
        }
      );
      if (newData.length) {
        setData([...newData, ...data]);
      }
    }
  }, [data, subscribedDataForCurrentPair]);

  useEffect(() => {
    if (data.length > limit && subscribed) {
      setData(data.slice(0, limit));
    }
  }, [data, limit, subscribed]);

  return {
    data,
    enableSubscription,
    fetchMore,
    hasMore,
    loading,
    preventSubscription,
    sort,
  };
};
