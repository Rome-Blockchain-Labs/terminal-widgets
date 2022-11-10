import { restService } from './restService';

export const fetchMarkets = async () =>
  restService<any>({
    endpoint: '/governance/venus',
    method: 'GET',
  });
