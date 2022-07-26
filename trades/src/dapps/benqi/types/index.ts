import BigNumber from 'bignumber.js';

import { QI_TOKENS, TOKENS } from '../constants';

export const CONTRACT_TYPES = [
  'AVAX',
  'BENQI',
  'LINK',
  'USDT',
  'WBTC',
  'ETH',
  'DAI',
  'BTCb',
  'sAVAX',
  'QiSAVAX',
  'QiBTCb',
  'USDC',
  'USDTn',
  'USDCn',
  'QiLINK',
  'QiUSDT',
  'QiAVAX',
  'QiBTC',
  'QiETH',
  'QiDAI',
  'QiUSDC',
  'QiQI',
  'QiUSDCn',
  'QiUSDTn',
  'Comptroller',
  'Maximillion',
  'PglStakingContract',
  'PangolinRouter',
  'QiAvaxPgl',
] as const;

export type ContractType = typeof CONTRACT_TYPES[number];

export type ContractAddresses = {
  [contract in ContractType]: string;
};

export type Token = typeof TOKENS[number];

export type QiToken = typeof QI_TOKENS[number];

export type RewardToken = 'BENQI' | 'AVAX';

export type TokenBigNumberMap = {
  [token in Token]: BigNumber;
};

export type Apy = {
  [token in Token]: {
    borrow: BigNumber;
    supply: BigNumber;
  };
};

export type Liquidity = {
  [token in Token]: {
    supply: BigNumber;
    usd: BigNumber;
  };
};

export type PglPoolReserves = {
  qi: BigNumber;
  avax: BigNumber;
};

export enum TransactionStatus {
  Waiting,
  Confirmed,
  Rejected,
  Finished,
}

export type SortDirection = 'ASC' | 'DESC';

export type TransactionType = 'MINT' | 'REPAYBORROW' | 'REDEEM' | 'BORROW';

export type BaseTransaction = {
  transaction: string;
  timestamp: number;
  block: number;
  status?: TransactionStatus;
};

export type Transaction = BaseTransaction & {
  event: TransactionType;
  token: Token;
  amount: BigNumber;
};

export type Liquidation = BaseTransaction & {
  liquidator: string;
  repayToken: Token;
  repayAmount: BigNumber;
  seizeToken: Token;
  seizedTokens: BigNumber;
};
