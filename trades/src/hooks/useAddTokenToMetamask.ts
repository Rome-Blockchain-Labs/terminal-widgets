import { useWeb3React } from '@romeblockchain/wallet';
import { useCallback, useState } from 'react';

type Params = {
  decimals: number;
  symbol: string;
  address: string;
  image: string;
};

export const useAddTokenToMetamask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { connector } = useWeb3React();

  const addTokenToMetamask = useCallback(
    (params: Params) => {
      setLoading(true);

      if (!connector?.watchAsset) return;
      return connector
        .watchAsset(params)
        .catch((err) => {
          setError(err);
        })
        .then(() => setLoading(false));
    },
    [connector]
  );

  return { addTokenToMetamask, error, loading };
};
