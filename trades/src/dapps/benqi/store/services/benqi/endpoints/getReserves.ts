import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import {
  CONTRACTS_BY_NAME,
  DECIMALS,
  TOKEN_QI_PAIRS,
  TOKENS,
} from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getReserves = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const provider = await getProvider();

  const tokenPromises = TOKENS.map((token) => {
    const tokenContractInfo = CONTRACTS_BY_NAME[TOKEN_QI_PAIRS[token]];
    const qiTokenContractAddress = contractAddresses[TOKEN_QI_PAIRS[token]];

    const qiToken = getContract(
      qiTokenContractAddress,
      tokenContractInfo.ABI,
      provider,
      account
    );

    const reserveFactorPromise = qiToken
      .reserveFactorMantissa()
      .then((response: EthersBigNumber) => {
        return new BigNumber(response.toString()).shiftedBy(-18);
      });

    const totalReservesPromise = qiToken
      .totalReserves()
      .then((response: EthersBigNumber) => {
        return new BigNumber(response.toString()).shiftedBy(-DECIMALS[token]);
      });

    return Promise.all([reserveFactorPromise, totalReservesPromise]).then(
      ([reserveFactor, totalReserves]) => {
        return {
          [token]: {
            reserveFactor: reserveFactor.toString(),
            totalReserves: totalReserves.toString(),
          },
        };
      }
    );
  });

  return Promise.all(tokenPromises).then((reserves) => {
    return {
      data: Object.assign({}, ...reserves),
    };
  });
};

export default getReserves;
