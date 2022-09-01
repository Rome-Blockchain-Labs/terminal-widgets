import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';

import { CONTRACTS_BY_NAME } from '../constants';
import { ContractType, Token } from '../types';
import getAccount from './getAccount';
import getProvider from './getProvider';

export const getContract = (
  address: string,
  ABI: any,
  library: Web3Provider,
  account: string
): Contract => {
  return new Contract(address, ABI, library.getSigner(account));
};

export const getComptroller = async (address: string) => {
  const provider = await getProvider();
  const account = await getAccount();

  const { ABI } = CONTRACTS_BY_NAME.Comptroller;

  return getContract(address, ABI, provider, account);
};

export const getQiContractFromToken = async (token: Token, address: string) => {
  const provider = await getProvider();
  const account = await getAccount();

  const { ABI } = getQiContractFromUnderlying(token);

  return getContract(address, ABI, provider, account);
};

export const getQiContractFromUnderlying = (asset: ContractType) => {
  return CONTRACTS_BY_NAME[CONTRACTS_BY_NAME[asset].qiContract];
};
