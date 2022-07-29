import { ChainId, Token, WETH } from '@dynamic-amm/sdk';
import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { AppState } from '../../../../store';
import { FARM_HISTORIES } from '../../apollo/queries';
import {
  DEFAULT_REWARDS,
  FAIRLAUNCH_ADDRESSES,
  ZERO_ADDRESS,
} from '../../constants';
import FAIRLAUNCH_ABI from '../../constants/abis/fairlaunch.json';
import { useAllTokens } from '../../hooks/Tokens';
import { useFairLaunchContracts } from '../../hooks/useContract';
import useTokensMarketPrice from '../../hooks/useTokensMarketPrice';
import {
  useBlockNumber,
  useETHPrice,
  useExchangeClient,
  useTokensPrice,
} from '../application/hooks';
import {
  Farm,
  FarmHistoriesSubgraphResult,
  FarmHistory,
  FarmHistoryMethod,
} from '../farms/types';
import { useAppDispatch } from '../hooks';
import { useMultipleContractSingleData } from '../multicall/hooks';
import { getBulkPoolData } from '../pools/hooks';
import { setFarmsData, setLoading, setYieldPoolsError } from './actions';

export const useRewardTokens = () => {
  const { chainId } = useWallets();
  const rewardTokensMulticallResult = useMultipleContractSingleData(
    FAIRLAUNCH_ADDRESSES[chainId as ChainId],
    new Interface(FAIRLAUNCH_ABI),
    'getRewardTokens'
  );

  const defaultRewards = useMemo(() => {
    return DEFAULT_REWARDS[chainId as ChainId] || [];
  }, [chainId]);

  return useMemo(() => {
    let result: string[] = [];

    rewardTokensMulticallResult.forEach((token) => {
      if (token?.result?.[0]) {
        result = result.concat(
          token?.result?.[0].filter((item: string) => result.indexOf(item) < 0)
        );
      }
    });

    return [...defaultRewards, ...result];
  }, [rewardTokensMulticallResult, defaultRewards]);
};

export const useRewardTokenPrices = (tokens: (Token | undefined)[]) => {
  const tokenPrices = useTokensPrice(tokens);
  const marketPrices = useTokensMarketPrice(tokens);

  return tokenPrices.map((price, index) => price || marketPrices[index] || 0);
};

export const useFarmsData = () => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useWallets();
  const fairLaunchContracts = useFairLaunchContracts();
  const ethPrice = useETHPrice();
  const allTokens = useAllTokens();
  const blockNumber = useBlockNumber();

  const apolloClient = useExchangeClient();
  const farmsData = useSelector(
    (state: AppState) => state.dapps.dmm.farms.data
  );
  const loading = useSelector(
    (state: AppState) => state.dapps.dmm.farms.loading
  );
  const error = useSelector((state: AppState) => state.dapps.dmm.farms.error);

  useEffect(() => {
    async function getListFarmsForContract(
      contract: Contract
    ): Promise<Farm[]> {
      const rewardTokenAddresses: string[] = await contract?.getRewardTokens();
      const poolLength = await contract?.poolLength();

      const pids = [...Array(BigNumber.from(poolLength).toNumber()).keys()];

      const poolInfos = await Promise.all(
        pids.map(async (pid: number) => {
          const poolInfo = await contract?.getPoolInfo(pid);

          return {
            ...poolInfo,
            pid,
          };
        })
      );

      const stakedBalances = await Promise.all(
        pids.map(async (pid: number) => {
          const stakedBalance = account
            ? await contract?.getUserInfo(pid, account as string)
            : { amount: 0 };

          return stakedBalance.amount;
        })
      );

      const pendingRewards = await Promise.all(
        pids.map(async (pid: number) => {
          const pendingRewards = account
            ? await contract?.pendingRewards(pid, account as string)
            : null;

          return pendingRewards;
        })
      );

      const poolAddresses = poolInfos.map((poolInfo) =>
        poolInfo.stakeToken.toLowerCase()
      );

      const farmsData = await getBulkPoolData(
        poolAddresses,
        apolloClient,
        ethPrice.currentPrice,
        chainId
      );

      const rewardTokens = rewardTokenAddresses.map((address) =>
        address.toLowerCase() === ZERO_ADDRESS.toLowerCase()
          ? WETH[chainId as ChainId]
          : allTokens[address]
      );

      const farms: Farm[] = poolInfos.map((poolInfo, index) => {
        return {
          ...farmsData.find(
            (farmData: Farm) =>
              farmData &&
              farmData.id.toLowerCase() === poolInfo.stakeToken.toLowerCase()
          ),
          ...poolInfo,
          fairLaunchAddress: contract.address,
          rewardTokens,
          userData: {
            rewards: pendingRewards[index],
            stakedBalance: stakedBalances[index],
          },
        };
      });
      return farms.filter((farm) => !!farm.totalSupply);
    }

    async function checkForFarms() {
      try {
        if (!fairLaunchContracts) {
          dispatch(setFarmsData({}));
          return;
        }

        dispatch(setLoading(true));

        const result: { [key: string]: Farm[] } = {};

        const fairLaunchAddresses = Object.keys(fairLaunchContracts);
        const promises: Promise<Farm[]>[] = [];

        fairLaunchAddresses.forEach((address) => {
          promises.push(getListFarmsForContract(fairLaunchContracts[address]));
        });

        const promiseResult = await Promise.all(promises);

        fairLaunchAddresses.forEach((address, index) => {
          result[address] = promiseResult[index];
        });

        dispatch(setFarmsData(result));
      } catch (err) {
        console.error(err);
        dispatch(setYieldPoolsError((err as Error).message));
      }

      dispatch(setLoading(false));
    }

    checkForFarms();
  }, [
    apolloClient,
    dispatch,
    ethPrice.currentPrice,
    chainId,
    fairLaunchContracts,
    account,
    blockNumber,
    allTokens,
  ]);

  return { data: farmsData, error, loading };
};

export const useYieldHistories = (isModalOpen: boolean) => {
  const { account, chainId } = useWallets();
  const [histories, setHistories] = useState<FarmHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const apolloClient = useExchangeClient();

  useEffect(() => {
    async function fetchFarmHistories() {
      if (!account || !isModalOpen) {
        return;
      }

      setLoading(true);

      try {
        const result = await apolloClient.query<FarmHistoriesSubgraphResult>({
          fetchPolicy: 'network-only',
          query: FARM_HISTORIES,
          variables: {
            user: account,
          },
        });

        const historiesData: FarmHistory[] = [];

        result.data.deposits.forEach((deposit) => {
          historiesData.push({
            amount: deposit.amount,
            id: deposit.id,
            method: FarmHistoryMethod.DEPOSIT,
            stakeToken: deposit.stakeToken,
            timestamp: deposit.timestamp,
          });
        });

        result.data.withdraws.forEach((withdraw) => {
          historiesData.push({
            amount: withdraw.amount,
            id: withdraw.id,
            method: FarmHistoryMethod.WITHDRAW,
            stakeToken: withdraw.stakeToken,
            timestamp: withdraw.timestamp,
          });
        });

        result.data.harvests.forEach((harvest) => {
          const txHash = harvest.id.split('-')?.[0];

          const index = historiesData.findIndex(
            (history) =>
              history.method === FarmHistoryMethod.HARVEST &&
              history.rewardToken === harvest.rewardToken &&
              history.id.includes(txHash)
          );

          if (index < 0) {
            historiesData.push({
              amount: harvest.amount,
              id: harvest.id,
              method: FarmHistoryMethod.HARVEST,
              rewardToken: harvest.rewardToken,
              stakeToken: harvest.stakeToken,
              timestamp: harvest.timestamp,
            });
          } else {
            historiesData[index].amount = BigNumber.from(
              historiesData[index].amount
            )
              .add(BigNumber.from(harvest.amount))
              .toString();
          }
        });

        result.data.vests.forEach((vest) => {
          const txHash = vest.id.split('-')?.[0];

          const index = historiesData.findIndex(
            (history) =>
              history.method === FarmHistoryMethod.CLAIM &&
              history.rewardToken === vest.rewardToken &&
              history.id.includes(txHash)
          );

          if (index < 0) {
            historiesData.push({
              amount: vest.amount,
              id: vest.id,
              method: FarmHistoryMethod.CLAIM,
              rewardToken: vest.rewardToken,
              timestamp: vest.timestamp,
            });
          } else {
            historiesData[index].amount = BigNumber.from(
              historiesData[index].amount
            )
              .add(BigNumber.from(vest.amount))
              .toString();
          }
        });

        historiesData.sort(function (a, b) {
          return parseInt(b.timestamp) - parseInt(a.timestamp);
        });

        setHistories(historiesData);
      } catch (err) {
        setHistories([]);
      }

      setLoading(false);
    }

    fetchFarmHistories();
  }, [chainId, account, isModalOpen, apolloClient]);

  return { data: histories, loading };
};
