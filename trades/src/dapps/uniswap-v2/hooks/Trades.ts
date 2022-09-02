import {
  Currency,
  CurrencyAmount,
  Pair,
  Token,
  Trade,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import { flatMap } from 'lodash';
import { useMemo } from 'react';

import { BASES_TO_CHECK_TRADES_AGAINST } from '../../../constants';
import { wrappedCurrency } from '../../../utils';
import { PairState, usePairs } from '../data/Reserves';

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const { chainId } = useWeb3React();

  const bases: Token[] = useMemo(
    () =>
      (chainId ? (BASES_TO_CHECK_TRADES_AGAINST as any)[chainId] : []) || [],
    [chainId]
  );

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined];

  const basePairs: [Token, Token][] = useMemo(
    () =>
      flatMap(bases, (base): [Token, Token][] =>
        bases.map((otherBase) => [base, otherBase])
      ).filter(([t0, t1]) => t0.address !== t1.address),
    [bases]
  );

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            .filter((tokens): tokens is [Token, Token] =>
              Boolean(tokens[0] && tokens[1])
            )
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true;
              return true;
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  );

  const allPairs = usePairs(allPairCombinations);

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] =>
            Boolean(result[0] === PairState.EXISTS && result[1])
          )
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] =
              memo[curr.liquidityToken.address] ?? curr;
            return memo;
          }, {})
      ),
    [allPairs]
  );
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(
  currencyAmountIn?: CurrencyAmount,
  currencyOut?: Currency
): Trade | null {
  const allowedPairs = useAllCommonPairs(
    currencyAmountIn?.currency,
    currencyOut
  );
  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
          maxHops: 3,
          maxNumResults: 1,
        })[0] ?? null
      );
    }
    return null;
  }, [allowedPairs, currencyAmountIn, currencyOut]);
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount
): Trade | null {
  const allowedPairs = useAllCommonPairs(
    currencyIn,
    currencyAmountOut?.currency
  );

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
          maxHops: 3,
          maxNumResults: 1,
        })[0] ?? null
      );
    }
    return null;
  }, [allowedPairs, currencyIn, currencyAmountOut]);
}