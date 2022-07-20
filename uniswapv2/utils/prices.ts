import { ExchangeName } from '@rbl/velox-common/multiChains';
import {
  CurrencyAmount,
  JSBI,
  Percent,
  TokenAmount,
  Trade,
} from '@rbl/velox-common/uniV2ClonesSDK';

import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from '../../../constants';
import { basisPointsToPercent, getDefaultCurrencySymbol } from '../../../utils';
import { Field } from '../state/swap/actions';

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  exchange?: ExchangeName,
  trade?: Trade
): {
  priceImpactWithoutFee?: Percent;
  realizedLPFee?: CurrencyAmount;
} {
  // for each hop in our trade, calculate the expected output, without considering fees
  let hopNum = 0;
  let nextHopStartAmount = Number(trade?.inputAmount.toSignificant(20));
  trade?.route.pairs.forEach((pair) => {
    const inToken = trade?.route.path[hopNum];
    hopNum++;
    const inputIsZero = pair.token1.address === inToken.address;
    const inputReserve = inputIsZero
      ? pair.reserve1.toSignificant(20)
      : pair.reserve0.toSignificant(20);
    const outputReserve = inputIsZero
      ? pair.reserve0.toSignificant(20)
      : pair.reserve1.toSignificant(20);

    /**Uniswap swaps operate just that the reverve0 * reserve1 remains constant before and after a trade
     * Therefore k = res1 * res2 = (res1 + deltaRes1) * (res2 + deltaRes2) where deltaRes is the change in reserve
     * Since priceOfOutput = deltaOutput/deltaInput
     * Then priceOfOutput = outputReserve / (inputReserve + inputTradeAmount)
     * And nextAmount = inputTradeAmount * outputReserve / (inputReserve + inputTradeAmount)
     * **/
    nextHopStartAmount =
      Number(nextHopStartAmount) *
      (Number(outputReserve) /
        (Number(inputReserve) + Number(nextHopStartAmount)));
  });
  const realizedLPFee = new Percent(
    JSBI.BigInt(
      Math.floor(
        (nextHopStartAmount /
          Number(trade?.inputAmount.toSignificant(20)) /
          Number(trade?.executionPrice.toSignificant(20)) -
          1) *
          1e9
      ) || 0
    ),
    JSBI.BigInt(1e9)
  ).subtract(JSBI.BigInt(0));

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction =
    trade && realizedLPFee
      ? trade.priceImpact.subtract(realizedLPFee)
      : undefined;

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(
        priceImpactWithoutFeeFraction?.numerator,
        priceImpactWithoutFeeFraction?.denominator
      )
    : undefined;

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(
          trade.inputAmount.token,
          realizedLPFee.multiply(trade.inputAmount.raw).quotient
        )
      : CurrencyAmount.ether(
          realizedLPFee.multiply(trade.inputAmount.raw).quotient
        ));

  return {
    priceImpactWithoutFee: priceImpactWithoutFeePercent,
    realizedLPFee: realizedLPFeeAmount,
  };
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: Trade | undefined,
  allowedSlippage: number
): { [field in Field]?: CurrencyAmount } {
  const pct = basisPointsToPercent(allowedSlippage);
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  };
}

export function warningSeverity(
  priceImpact: Percent | undefined
): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1;
  return 0;
}

export function formatExecutionPrice(
  trade?: Trade,
  inverted?: boolean
): string {
  if (!trade) {
    return '';
  }
  return inverted
    ? `${trade.executionPrice
        .invert()
        .toSignificant(6)} ${getDefaultCurrencySymbol(
        trade.inputAmount.currency
      )} / ${getDefaultCurrencySymbol(trade.outputAmount.currency)}`
    : `${trade.executionPrice.toSignificant(6)} ${getDefaultCurrencySymbol(
        trade.outputAmount.currency
      )} / ${getDefaultCurrencySymbol(trade.inputAmount.currency)}`;
}
