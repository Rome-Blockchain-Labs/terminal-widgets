import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { ABI } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getPglTotalStakeAmount = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const provider = await getProvider();

  const contract = getContract(
    contractAddresses.PglStakingContract,
    ABI.PglStakingContract,
    provider,
    account
  );

  return contract.totalSupplies().then((response: EthersBigNumber) => {
    return {
      data: new BigNumber(response.toString()).shiftedBy(-18).toString(),
    };
  });
};

export default getPglTotalStakeAmount;
