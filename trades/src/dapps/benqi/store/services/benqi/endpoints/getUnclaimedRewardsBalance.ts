import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import {
  DECIMALS,
  REWARDS,
  TOKEN_QI_PAIRS,
  TOKENS,
} from '../../../../constants';
import { ContractAddresses, RewardToken, Token } from '../../../../types';
import { getComptroller, getQiContractFromToken } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';

const getUnclaimedRewardsBalance = async (
  contractAddresses: ContractAddresses
) => {
  const comptroller = await getComptroller(contractAddresses.Comptroller);
  const account = await getAccount();

  const unclaimedRewardPromises = Object.entries(REWARDS).flatMap(
    ([intermediateRewardToken, rewardIndex]) => {
      const rewardToken = intermediateRewardToken as RewardToken;

      const rewardAccruedPromise = comptroller
        .rewardAccrued(REWARDS[rewardToken], account)
        .then((rewardAccrued: EthersBigNumber) => {
          return new BigNumber(rewardAccrued.toString()).shiftedBy(
            -DECIMALS[rewardToken]
          );
        });

      const tokenRewardPromises = TOKENS.map((intermediateToken) => {
        const token = intermediateToken as Token;
        const qiContractAddress = contractAddresses[TOKEN_QI_PAIRS[token]];

        const supplyIndexPromise = comptroller
          .rewardSupplyState(rewardIndex, qiContractAddress)
          .then((supplyState: { index: EthersBigNumber }) => {
            return new BigNumber(supplyState.index.toString()).shiftedBy(
              -54 + DECIMALS[TOKEN_QI_PAIRS[token]]
            );
          });

        const borrowIndexPromise = comptroller
          .rewardBorrowState(rewardIndex, qiContractAddress)
          .then((borrowState: { index: EthersBigNumber }) => {
            return new BigNumber(borrowState.index.toString()).shiftedBy(
              -54 + DECIMALS[token]
            );
          });

        const supplierIndexPromise = comptroller
          .rewardSupplierIndex(rewardIndex, qiContractAddress, account)
          .then((supplierIndex: EthersBigNumber) => {
            return new BigNumber(supplierIndex.toString()).shiftedBy(
              -54 + DECIMALS[TOKEN_QI_PAIRS[token]]
            );
          });

        const borrowerIndexPromise = comptroller
          .rewardBorrowerIndex(rewardIndex, qiContractAddress, account)
          .then((borrowerIndex: EthersBigNumber) => {
            return new BigNumber(borrowerIndex.toString()).shiftedBy(
              -54 + DECIMALS[token]
            );
          });

        const qiContractPromise = getQiContractFromToken(
          token,
          contractAddresses[TOKEN_QI_PAIRS[token]]
        );

        return Promise.all([
          supplyIndexPromise,
          borrowIndexPromise,
          supplierIndexPromise,
          borrowerIndexPromise,
          qiContractPromise,
        ]).then(
          ([
            supplyIndex,
            borrowIndex,
            intermediateSupplierIndex,
            borrowerIndex,
            qiContract,
          ]) => {
            const balancePromise = qiContract
              .balanceOf(account)
              .then((balance: EthersBigNumber) => {
                return new BigNumber(balance.toString()).shiftedBy(
                  -DECIMALS[TOKEN_QI_PAIRS[token]]
                );
              });

            const borrowBalancePromise = qiContract
              .borrowBalanceStored(account)
              .then((borrowBalance: EthersBigNumber) => {
                return new BigNumber(borrowBalance.toString()).shiftedBy(
                  -DECIMALS[token]
                );
              });

            return Promise.all([balancePromise, borrowBalancePromise]).then(
              ([balance, borrowBalance]) => {
                let supplierIndex = intermediateSupplierIndex;
                if (supplierIndex.isZero()) {
                  supplierIndex = new BigNumber(10)
                    .pow(36)
                    .shiftedBy(-54 + DECIMALS[TOKEN_QI_PAIRS[token]]);
                }

                let supplierAccrued = new BigNumber(0);
                if (supplierIndex.gt(0)) {
                  const supplyIndexDelta = supplyIndex.minus(supplierIndex);
                  supplierAccrued = balance.times(supplyIndexDelta);
                }

                let borrowerAccrued = new BigNumber(0);
                if (borrowerIndex.gt(0)) {
                  const borrowIndexDelta = borrowIndex.minus(borrowerIndex);
                  borrowerAccrued = borrowBalance.times(borrowIndexDelta);
                }

                const rewards = supplierAccrued.plus(borrowerAccrued);

                return {
                  rewards,
                  token,
                };
              }
            );
          }
        );
      });

      return Promise.all([rewardAccruedPromise, ...tokenRewardPromises]).then(
        ([rewardAccrued, ...rewardsByToken]) => {
          return {
            rewardAccrued: rewardAccrued.toString(),
            rewardToken,
            rewards: Object.assign(
              {},
              ...rewardsByToken.map(({ rewards, token }) => ({
                [token]: rewards.toString(),
              }))
            ),
          };
        }
      );
    }
  );

  return Promise.all(unclaimedRewardPromises).then((results) => {
    return {
      data: Object.assign(
        {},
        ...results.map(({ rewardAccrued, rewardToken, rewards }) => ({
          [rewardToken]: {
            rewardAccrued,
            rewards,
          },
        }))
      ),
    };
  });
};

export default getUnclaimedRewardsBalance;
