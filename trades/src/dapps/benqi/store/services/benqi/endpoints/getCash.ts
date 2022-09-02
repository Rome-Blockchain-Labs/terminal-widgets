import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getQiContractFromToken } from '../../../../utils';

const getCash = async (contractAddresses: ContractAddresses) => {
  const cashPromises = TOKENS.map(async (token) => {
    const qiTokenContract = await getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    );

    return qiTokenContract.getCash().then((cash: EthersBigNumber) => {
      return {
        cash: new BigNumber(cash.toString()).shiftedBy(-DECIMALS[token]),
        token,
      };
    });
  });

  return Promise.all(cashPromises).then((cashByToken) => {
    return {
      data: Object.assign(
        {},
        ...cashByToken.map(({ cash, token }) => ({
          [token]: cash.toString(),
        }))
      ),
    };
  });
};

export default getCash;
