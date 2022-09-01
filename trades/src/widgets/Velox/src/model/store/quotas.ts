export interface AsyncNumber {
  loading?: boolean;
  error?: Error | null;
  value?: string;
  min?: string;
}

export interface Quota {
  balance: AsyncNumber;
  allowance: AsyncNumber;
  usdPrice: AsyncNumber;
}

export type QuotasState = Record<string, Quota>;
