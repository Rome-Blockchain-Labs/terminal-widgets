export type TransactionType = 'buy' | 'sell';

export type Transaction = {
  base_amount: number;
  base_decimals: number;
  base_token: string;
  direction: TransactionType;
  native_price?: number;
  price: number;
  swapindex: number;
  quote_amount: number;
  quote_decimals: number;
  quote_token: string;
  timestamp: number;
  txhash: string;
  usd_price?: number;
};
