import { Trade, TradeType } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useContext } from 'react';
import tw from 'twin.macro';

import { AutoColumn } from '../../../../components/column';
import QuestionHelper from '../../../../components/questionHelper';
import { RowBetween, RowFixed } from '../../../../components/row';
import { DappContext } from '../../../../contexts';
import { getDefaultCurrencySymbol } from '../../../../utils';
import { Field } from '../../state/swap/actions';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from '../../utils/prices';
import FormattedPriceImpact from './FormattedPriceImpact';
import { SectionBreak } from './styleds';
import SwapRoute from './SwapRoute';

const Label = tw.span`text-xl text-gray-200`;
const Value = tw.span`text-xl text-white`;

function TradeSummary({
  allowedSlippage,
  trade,
}: {
  trade: Trade;
  allowedSlippage: number;
}) {
  const { exchange } = useContext(DappContext);
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(
    exchange,
    trade
  );
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage
  );

  return (
    <>
      <AutoColumn style={{ padding: '0 12px' }}>
        <RowBetween>
          <RowFixed>
            <Label>{isExactIn ? 'Minimum received' : 'Maximum sold'}</Label>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <Value>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(
                    4
                  )} ${getDefaultCurrencySymbol(
                    trade.outputAmount.currency
                  )}` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(
                    4
                  )} ${getDefaultCurrencySymbol(trade.inputAmount.currency)}` ??
                  '-'}
            </Value>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Label>Price Impact</Label>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Label>Liquidity Provider Fee</Label>
            <QuestionHelper text="A portion of each trade goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <Value>
            {realizedLPFee
              ? `${realizedLPFee.toSignificant(2)} ${getDefaultCurrencySymbol(
                  trade.inputAmount.currency
                )}`
              : '-'}
          </Value>
        </RowBetween>
      </AutoColumn>
    </>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary allowedSlippage={allowedSlippage} trade={trade} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <span tw="text-xl">Route</span>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  );
}
