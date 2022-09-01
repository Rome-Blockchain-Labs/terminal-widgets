import { createApi } from '@reduxjs/toolkit/query/react';

import { ContractAddresses, RewardToken, Token } from '../../../types';
import {
  getAllowances,
  getBorrowApy,
  getBorrowBalance,
  getCash,
  getCollateralFactors,
  getCollateralStatus,
  getContractBorrowBalance,
  getExchangeRates,
  getMarketBorrowCaps,
  getOldTokenBalance,
  getPangolinRouterQiAllowance,
  getPglAllowance,
  getPglBalance,
  getPglKLast,
  getPglPoolReserves,
  getPglRewardSpeed,
  getPglStakeAmount,
  getPglTotalStakeAmount,
  getPglTotalSupply,
  getPrices,
  getReserves,
  getRewardSpeeds,
  getSupplyApy,
  getSupplyBalance,
  getTotalBorrows,
  getTotalSupply,
  getUnclaimedPglRewardBalance,
  getUnclaimedRewardsBalance,
  getWalletBalance,
} from './endpoints';

type ApiTokenBigNumberString = {
  [token in Token]: string;
};

type ApiTokenBoolean = {
  [token in Token]: boolean;
};

type ApiTokenRewardSpeeds = {
  [token in Token]: {
    [rewardToken in RewardToken]: {
      supply: string;
      borrow: string;
    };
  };
};

export type UnclaimedRewardsBalanceBreakdown = {
  [rewardToken in RewardToken]: {
    rewardAccrued: string;
    rewards: {
      [token in Token]: string;
    };
  };
};

type ApiPoolReserves = {
  qi: string;
  avax: string;
};

type ApiReserves = {
  [token in Token]: {
    reserveFactor: string;
    totalReserves: string;
  };
};

const benqi = createApi({
  baseQuery: () => ({ error: 'missing queryFn' }),
  endpoints: (builder) => ({
    getAllowances: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getAllowances,
    }),
    getBorrowApy: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getBorrowApy,
    }),
    getBorrowBalance: builder.query<ApiTokenBigNumberString, ContractAddresses>(
      {
        queryFn: getBorrowBalance,
      }
    ),
    getCash: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getCash,
    }),
    getCollateralFactors: builder.query<
      ApiTokenBigNumberString,
      ContractAddresses
    >({
      queryFn: getCollateralFactors,
    }),
    getCollateralStatus: builder.query<ApiTokenBoolean, ContractAddresses>({
      queryFn: getCollateralStatus,
    }),
    getContractBorrowBalance: builder.query<
      ApiTokenBigNumberString,
      ContractAddresses
    >({
      queryFn: getContractBorrowBalance,
    }),
    getExchangeRates: builder.query<ApiTokenBigNumberString, ContractAddresses>(
      {
        queryFn: getExchangeRates,
      }
    ),
    getMarketBorrowCaps: builder.query<
      ApiTokenBigNumberString,
      ContractAddresses
    >({
      queryFn: getMarketBorrowCaps,
    }),
    getOldTokenBalance: builder.query<ApiTokenBigNumberString, void>({
      queryFn: getOldTokenBalance,
    }),
    getPangolinRouterQiAllowance: builder.query<string, ContractAddresses>({
      queryFn: getPangolinRouterQiAllowance,
    }),
    getPglAllowance: builder.query<string, ContractAddresses>({
      queryFn: getPglAllowance,
    }),
    getPglBalance: builder.query<string, ContractAddresses>({
      queryFn: getPglBalance,
    }),
    getPglKLast: builder.query<string, ContractAddresses>({
      queryFn: getPglKLast,
    }),
    getPglPoolReserves: builder.query<ApiPoolReserves, ContractAddresses>({
      queryFn: getPglPoolReserves,
    }),
    getPglRewardSpeed: builder.query<string, ContractAddresses>({
      queryFn: getPglRewardSpeed,
    }),
    getPglStakeAmount: builder.query<string, ContractAddresses>({
      queryFn: getPglStakeAmount,
    }),
    getPglTotalStakeAmount: builder.query<string, ContractAddresses>({
      queryFn: getPglTotalStakeAmount,
    }),
    getPglTotalSupply: builder.query<string, ContractAddresses>({
      queryFn: getPglTotalSupply,
    }),
    getPrices: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getPrices,
    }),
    getReserves: builder.query<ApiReserves, ContractAddresses>({
      queryFn: getReserves,
    }),
    getRewardSpeeds: builder.query<ApiTokenRewardSpeeds, ContractAddresses>({
      queryFn: getRewardSpeeds,
    }),
    getSupplyApy: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getSupplyApy,
    }),
    getSupplyBalance: builder.query<ApiTokenBigNumberString, ContractAddresses>(
      {
        queryFn: getSupplyBalance,
      }
    ),
    getTotalBorrows: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getTotalBorrows,
    }),
    getTotalSupply: builder.query<ApiTokenBigNumberString, ContractAddresses>({
      queryFn: getTotalSupply,
    }),
    getUnclaimedPglRewardBalance: builder.query<string, ContractAddresses>({
      queryFn: getUnclaimedPglRewardBalance,
    }),
    getUnclaimedRewardsBalance: builder.query<
      UnclaimedRewardsBalanceBreakdown,
      ContractAddresses
    >({
      queryFn: getUnclaimedRewardsBalance,
    }),
    getWalletBalance: builder.query<ApiTokenBigNumberString, ContractAddresses>(
      {
        queryFn: getWalletBalance,
      }
    ),
  }),
  reducerPath: 'benqi',
});

export default benqi;
