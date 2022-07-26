import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { ABI } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getUnclaimedPglRewardBalance = async (
  contractAddresses: ContractAddresses
) => {
  const account = await getAccount();
  const provider = await getProvider();

  const contract = getContract(
    contractAddresses.PglStakingContract,
    ABI.PglStakingContract,
    provider,
    account
  );

  const claimableRewardTotalPromises = [0, 1].flatMap((rewardTokenIndex) => {
    return contract
      .getClaimableRewards(rewardTokenIndex)
      .then((response: EthersBigNumber) => {
        return new BigNumber(response.toString()).shiftedBy(-18);
      });
  });

  return Promise.all(claimableRewardTotalPromises).then((claimableRewards) => {
    const total = claimableRewards.reduce((sum, tokenClaimableRewards) => {
      return sum.plus(tokenClaimableRewards);
    }, new BigNumber(0));

    return {
      data: total.toString(),
    };
  });
};

export default getUnclaimedPglRewardBalance;
