import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses, Token } from '../../../../types';
import { getContract, getQiContractFromUnderlying } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getExchangeRates = async (contractAddresses: ContractAddresses) => {
  const provider = await getProvider();
  const account = await getAccount();

  const exchangeRatePromises = TOKENS.map((token) => {
    const qiContractInfo = getQiContractFromUnderlying(token);
    const qiContractAddress = contractAddresses[TOKEN_QI_PAIRS[token]];
    const qiContract = getContract(
      qiContractAddress,
      qiContractInfo.ABI,
      provider,
      account
    );

    return qiContract
      .getAccountSnapshot(account)
      .then((snapshot: [any, any, any, EthersBigNumber]) => {
        const underlyingDecimals = DECIMALS[token];
        const qiDecimals = DECIMALS[TOKEN_QI_PAIRS[token]];
        const exchangeRateDecimals = 18 + underlyingDecimals - qiDecimals;
        const exchangeRate = new BigNumber(snapshot[3].toString()).shiftedBy(
          -exchangeRateDecimals
        );

        return {
          exchangeRate,
          token,
        };
      })
      .catch(() => ({
        exchangeRate: new BigNumber(0),
        token,
      }));
  });

  return Promise.all(exchangeRatePromises).then(
    (results: { token: Token; exchangeRate: BigNumber }[]) => {
      const newExchangeRates = Object.assign(
        {},
        ...results.map(({ exchangeRate, token }) => ({
          [token]: exchangeRate.toString(),
        }))
      );

      return {
        data: newExchangeRates,
      };
    }
  );
};

export default getExchangeRates;
