import useSWR from 'swr';

import { KYBER_AGGREGATOR_STATS_API } from '../../../config';

interface VolumeResponse {
  totalVolume: string;
  last24hVolume: string;
}

export default function useAggregatorVolume(): VolumeResponse {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const url = `${KYBER_AGGREGATOR_STATS_API}/api/volume`;

  const { data, error } = useSWR(url, fetcher, {
    onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return;

      // Only retry up to 10 times.
      if (retryCount >= 10) return;

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000);
        return;
      }

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
    refreshInterval: 10000,
  });

  if (error) {
    console.error(error.message);
  }

  return data;
}
