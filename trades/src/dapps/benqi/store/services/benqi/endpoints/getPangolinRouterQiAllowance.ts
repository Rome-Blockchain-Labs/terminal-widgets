import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { ABI } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getPangolinRouterQiAllowance = async (
  contractAddresses: ContractAddresses
) => {
  const account = await getAccount();
  const provider = await getProvider();

  const qiContract = getContract(
    contractAddresses.BENQI,
    ABI.Erc20,
    provider,
    account
  );

  return qiContract
    .allowance(account, contractAddresses.PangolinRouter)
    .then((response: EthersBigNumber) => {
      const allowance = new BigNumber(response.toString()).shiftedBy(-18);

      return {
        data: allowance.toString(),
      };
    });
};

export default getPangolinRouterQiAllowance;
