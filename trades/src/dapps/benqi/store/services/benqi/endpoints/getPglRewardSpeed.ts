import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { ABI } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getPglRewardSpeed = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const provider = await getProvider();

  const pglStakingContract = getContract(
    contractAddresses.PglStakingContract,
    ABI.PglStakingContract,
    provider,
    account
  );

  return pglStakingContract
    .rewardSpeeds(1)
    .then((response: EthersBigNumber) => {
      return {
        data: new BigNumber(response.toString()).shiftedBy(-18).toString(),
      };
    });
};

export default getPglRewardSpeed;
