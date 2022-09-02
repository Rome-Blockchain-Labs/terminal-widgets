import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TOKEN_API_NAMES } from '../../../constants';
import { Token } from '../../../types';

type TokenApiResponse = {
  suppliers: number;
  borrowers: number;
};

type DailyAverageBalance = {
  date: string;
  supply: number;
  borrows: number;
};

type Price = {
  date: string;
  price: number;
};

type DailyAverageUtilisation = {
  date: string;
  utilisation: number;
};

const tokens = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.benqi.fi/',
  }),
  endpoints: (builder) => ({
    getDailyAverageBalances: builder.query<DailyAverageBalance[], Token>({
      query: (token) =>
        `tokens/${TOKEN_API_NAMES[token]}/daily_average_balance`,
    }),
    getDailyAverageUtilisation: builder.query<DailyAverageUtilisation[], Token>(
      {
        query: (token) => `tokens/${TOKEN_API_NAMES[token]}/daily_utilisation`,
      }
    ),
    getToken: builder.query<TokenApiResponse, Token>({
      query: (token) => `tokens/${TOKEN_API_NAMES[token]}`,
    }),
    getTokenPriceHistory: builder.query<Price[], Token>({
      query: (token) => `tokens/${TOKEN_API_NAMES[token]}/prices`,
    }),
  }),
  reducerPath: 'tokens',
});

export default tokens;
