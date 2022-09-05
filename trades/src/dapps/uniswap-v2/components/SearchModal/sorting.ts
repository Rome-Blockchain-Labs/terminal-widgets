import { Token, TokenAmount } from '@rbl/velox-common/uniV2ClonesSDK';
import { useMemo } from 'react';

import { getDefaultCurrencySymbol } from '../../../../utils';
import { useAllTokenBalances } from '../../state/wallet/hooks';

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB)
      ? -1
      : balanceA.equalTo(balanceB)
      ? 0
      : 1;
  } else if (balanceA && balanceA.greaterThan('0')) {
    return -1;
  } else if (balanceB && balanceB.greaterThan('0')) {
    return 1;
  }
  return 0;
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined;
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address];
    const balanceB = balances[tokenB.address];

    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0) return balanceComp;

    const tokenASymbol = getDefaultCurrencySymbol(tokenA);
    const tokenBSymbol = getDefaultCurrencySymbol(tokenB);

    if (tokenASymbol && tokenBSymbol) {
      // sort by symbol
      return tokenASymbol.toLowerCase() < tokenBSymbol.toLowerCase() ? -1 : 1;
    } else {
      return tokenASymbol ? -1 : tokenBSymbol ? -1 : 0;
    }
  };
}

export function useTokenComparator(
  inverted: boolean
): (tokenA: Token, tokenB: Token) => number {
  const balances = useAllTokenBalances();
  const comparator = useMemo(
    () => getTokenComparator(balances ?? {}),
    [balances]
  );
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1;
    } else {
      return comparator;
    }
  }, [inverted, comparator]);
}
