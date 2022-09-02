import { useQuery } from '@apollo/client';

import { Pair } from '../../types';
import { getTokenDetailQuery } from '../tokenDetails';

export const useTokenDetails = (pair: Pair) => {
  const { address, blockchain, exchange } = pair;
  const { data, loading } = useQuery(getTokenDetailQuery(blockchain), {
    skip: !address,
    variables: {
      exchange: exchange,
      pair_address: address,
    },
  });

  return { data, loading };
};
