export type TokenType = {
  address: string;
  name: string;
  pooled: number;
  symbol: string;
  total_supply: number;
  latest_usd_price: number;
  latest_native_price: number;
};

export type TokenDetail = {
  label: string;
  value: string;
};
