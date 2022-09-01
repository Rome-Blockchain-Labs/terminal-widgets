import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import {
  CONTRACTS_BY_NAME,
  TOKEN_QI_PAIRS,
  TOKENS,
} from '../../../../constants';
import { ContractAddresses, Token } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getCollateralFactors = async (contractAddresses: ContractAddresses) => {
  const provider = await getProvider();
  const account = await getAccount();

  const comptrollerContractInfo = CONTRACTS_BY_NAME.Comptroller;
  const comptroller = getContract(
    contractAddresses.Comptroller,
    comptrollerContractInfo.ABI,
    provider,
    account
  );

  const marketPromises = TOKENS.map(async (token) => {
    const address = contractAddresses[TOKEN_QI_PAIRS[token]];

    return comptroller
      .markets(address)
      .then(([, collateralFactor]: [boolean, EthersBigNumber]) => {
        return {
          collateralFactor: new BigNumber(
            collateralFactor.toString()
          ).shiftedBy(-18),
          token,
        };
      });
  });

  return Promise.all(marketPromises).then(
    (markets: { token: Token; collateralFactor: BigNumber }[]) => {
      const newCollateralFactors = Object.assign(
        {},
        ...markets.map(({ collateralFactor, token }) => ({
          [token]: collateralFactor.toString(),
        }))
      );

      return {
        data: newCollateralFactors,
      };
    }
  );
};

export default getCollateralFactors;
