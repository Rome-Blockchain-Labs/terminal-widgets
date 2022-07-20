import {
  Currency,
  CurrencyAmount,
  JSBI,
  Token,
  TokenAmount,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ERC20_INTERFACE from '../../../../constants/abis/erc20';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { isAddress } from '../../../../utils';
import { useAllTokens } from '../../hooks/Tokens';
import { AppState } from '../index';
import { useMultipleContractSingleData } from '../multicall/hooks';
import { updateBalance } from '../user/actions';

export function useETHBalance(
  address: string | undefined,
  forceZeroReturn = false
): CurrencyAmount | undefined {
  const { connector } = useWallets();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (forceZeroReturn || !connector || !connector.provider) {
        return undefined;
      }
      const balance = await connector.provider?.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      dispatch(updateBalance((balance as number) || 0));
    })();
  }, [connector, address, forceZeroReturn, dispatch]);
  const balance = useSelector<AppState, AppState['user']['balance']>(
    (state) => state.user.balance
  );
  return CurrencyAmount.ether(JSBI.BigInt(balance || 0));
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    'balanceOf',
    [address]
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: TokenAmount | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(
  account?: string,
  token?: Token
): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: ((Currency & { isNative?: boolean }) | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency instanceof Token
      ) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);
  const containsETH: boolean = useMemo(
    () =>
      currencies?.some((currency) => currency && currency.isNative) ?? false,
    [currencies]
  );
  /** useCurrencyBalances is used many times (once for every individual currency)
   *
   * The containsETH makes it so that the native token isn't fetched unless it has been
   * requested in the currency array.
   *
   * There are better solutions to this problem, but this is working
   */

  const ethBalance = useETHBalance(account as string | undefined, !containsETH);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (currency instanceof Token) return tokenBalances[currency.address];
        if (currency.isNative) return ethBalance;
        return undefined;
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  );
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0];
}

// mimics useAllBalances
export function useAllTokenBalances(): {
  [tokenAddress: string]: TokenAmount | undefined;
} {
  const { account } = useWallets();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  );
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}
