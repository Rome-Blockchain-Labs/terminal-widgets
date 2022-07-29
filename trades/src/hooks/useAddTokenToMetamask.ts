import { useCallback, useState } from 'react';

import { useWallets } from '../contexts/WalletsContext/WalletContext';

type Params = {
  decimals: number;
  symbol: string;
  address: string;
  image: string;
};

export const useAddTokenToMetamask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { connector } = useWallets();

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
