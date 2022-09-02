import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getQiContractFromToken } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';

const getSupplyBalance = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();

  const supplyBalancePromises = TOKENS.map((token) => {
    return getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    )
      .then((tokenContract) => tokenContract.getAccountSnapshot(account))
      .then((snapshot: EthersBigNumber[]) => {
        const underlyingDecimals = DECIMALS[token];
        const qiDecimals = DECIMALS[TOKEN_QI_PAIRS[token]];

        const exchangeRateDecimals = 18 + underlyingDecimals - qiDecimals;
        const exchangeRate = new BigNumber(snapshot[3].toString()).shiftedBy(
          -exchangeRateDecimals
        );
        const tokenBalance = new BigNumber(snapshot[1].toString()).shiftedBy(
          -qiDecimals
        );
        const supplyBalance = tokenBalance.times(exchangeRate);

        return {
          supplyBalance,
          token,
        };
      });
  });

  return Promise.all(supplyBalancePromises).then((supplyBalances) => {
    return {
      data: Object.assign(
        {},
        ...supplyBalances.map(({ supplyBalance, token }) => ({
          [token]: supplyBalance.toString(),
        }))
      ),
    };
  });
};

export default getSupplyBalance;
