import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { ABI } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getPglBalance = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const provider = await getProvider();

  const pglContract = getContract(
    contractAddresses.QiAvaxPgl,
    ABI.PangolinPair,
    provider,
    account
  );

  return pglContract.balanceOf(account).then((response: EthersBigNumber) => {
    const balance = new BigNumber(response.toString()).shiftedBy(-18);

    return {
      data: balance.toString(),
    };
  });
};

export default getPglBalance;
