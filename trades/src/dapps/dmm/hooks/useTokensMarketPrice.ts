import { ChainId, ETHER, Token, WETH } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import { useMemo } from 'react';
import useSWR from 'swr';

import { ROME_ENV } from '../../../config';
import { COINGECKO_NETWORK_ID } from '../constants/index';

export default function useTokensMarketPrice(
  tokens: (Token | null | undefined)[]
) {
  const { chainId } = useWeb3React();

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const tokenAddress = tokens
    .filter(Boolean)
    .map((token) =>
      token === ETHER
        ? WETH[(chainId as keyof typeof WETH) || ChainId.MAINNET].address
        : token?.address
    );

  const url = `https://api.coingecko.com/api/v3/simple/token_price/${
    COINGECKO_NETWORK_ID[
      (chainId as keyof typeof COINGECKO_NETWORK_ID) || ChainId.MAINNET
    ]
  }?contract_addresses=${tokenAddress.join()}&vs_currencies=usd`;

  const { data, error } = useSWR(url, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return;

      // Only retry up to 10 times.
      if (retryCount >= 10) return;

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000);
        return;
      }

      // Retry after 20 seconds.
      setTimeout(() => revalidate({ retryCount }), 20000);
    },
    refreshInterval: 30000,
  });

  if (error && ROME_ENV === 'local') {
    console.error(error);
  }

  return useMemo(() => {
    return tokens.map((token) => {
      if (
        !token ||
        !token.address ||
        !data ||
        !data[token?.address?.toLowerCase()]
      )
        return 0;

      if (token === ETHER)
        return (
          data[
            WETH[
              (chainId as keyof typeof WETH) || ChainId.MAINNET
            ].address.toLowerCase()
          ]?.usd ?? 0
        );

      return data[token?.address?.toLowerCase()]?.usd ?? 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, data, JSON.stringify(tokens)]);
}
