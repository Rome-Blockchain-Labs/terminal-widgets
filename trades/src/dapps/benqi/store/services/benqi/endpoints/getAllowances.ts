import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { CONTRACTS_BY_NAME, DECIMALS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getAllowances = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const provider = await getProvider();

  const allowancePromises = TOKENS.map((token) => {
    const tokenContractInfo = CONTRACTS_BY_NAME[token];
    const tokenContractAddress = contractAddresses[token];
    const qiTokenContractAddress =
      contractAddresses[tokenContractInfo.qiContract];

    const tokenContract = getContract(
      tokenContractAddress,
      tokenContractInfo.ABI,
      provider,
      account
    );

    return tokenContract
      .allowance(account, qiTokenContractAddress)
      .then((allowance: EthersBigNumber) => {
        return {
          allowance: new BigNumber(allowance.toString()).shiftedBy(
            -DECIMALS[token]
          ),
          token,
        };
      });
  });

  return Promise.all(allowancePromises).then((allowances) => {
    return {
      data: Object.assign(
        {},
        ...allowances.map(({ allowance, token }) => ({
          [token]: allowance.toString(),
        }))
      ),
    };
  });
};

export default getAllowances;
