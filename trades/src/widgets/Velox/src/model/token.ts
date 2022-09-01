export interface Token {
  decimals: number;
  id: string;
  name: string;
  symbol: string;
  image: string;
  tradingVolume: string;

  balance: number;
  amount: number;
  allowance: number;
  usd: number;
}
