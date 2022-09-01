import BigNumber from 'bignumber.js';

import {
  DECIMALS,
  REWARDS,
  TOKEN_QI_PAIRS,
  TOKENS,
} from '../../../../constants';
import { ContractAddresses, RewardToken } from '../../../../types';
import { getComptroller } from '../../../../utils';

const getRewardSpeeds = async (contractAddresses: ContractAddresses) => {
  const comptroller = await getComptroller(contractAddresses.Comptroller);

  const rewardSpeedPromises = TOKENS.map((token) => {
    const qiContractAddress = contractAddresses[TOKEN_QI_PAIRS[token]];

    const tokenRewardSpeedPromises = Object.entries(REWARDS).map(
      ([rewardToken, index]) => {
        const supplyRewardSpeedPromise = comptroller.supplyRewardSpeeds(
          index,
          qiContractAddress
        );
        const borrowRewardSpeedPromise = comptroller.borrowRewardSpeeds(
          index,
          qiContractAddress
        );

        return Promise.all([
          supplyRewardSpeedPromise,
          borrowRewardSpeedPromise,
        ]).then(([supplyRewardSpeed, borrowRewardSpeed]) => ({
          borrowRewardSpeed: new BigNumber(
            borrowRewardSpeed.toString()
          ).shiftedBy(-DECIMALS[rewardToken as RewardToken]),
          rewardToken,
          supplyRewardSpeed: new BigNumber(
            supplyRewardSpeed.toString()
          ).shiftedBy(-DECIMALS[rewardToken as RewardToken]),
        }));
      }
    );

    return Promise.all(tokenRewardSpeedPromises).then((tokenRewardSpeeds) => {
      return {
        rewards: Object.assign(
          {},
          ...tokenRewardSpeeds.map(
            ({ borrowRewardSpeed, rewardToken, supplyRewardSpeed }) => ({
              [rewardToken]: {
                borrow: borrowRewardSpeed.toString(),
                supply: supplyRewardSpeed.toString(),
              },
            })
          )
        ),
        token,
      };
    });
  });

  return Promise.all(rewardSpeedPromises).then((rewardSpeeds) => {
    return {
      data: Object.assign(
        {},
        ...rewardSpeeds.map(({ rewards, token }) => ({
          [token]: rewards,
        }))
      ),
    };
  });
};

export default getRewardSpeeds;
