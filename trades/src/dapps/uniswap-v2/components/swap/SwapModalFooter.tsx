import 'twin.macro';

import { Trade, TradeType } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useContext, useMemo, useState } from 'react';
import { Repeat } from 'react-feather';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';

import { ButtonError } from '../../../../components/buttons';
import { AutoColumn } from '../../../../components/column';
import QuestionHelper from '../../../../components/questionHelper';
import { AutoRow, RowBetween, RowFixed } from '../../../../components/row';
import { DappContext } from '../../../../contexts';
import { getDefaultCurrencySymbol } from '../../../../utils';
import { Field } from '../../state/swap/actions';
import { TYPE } from '../../theme';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from '../../utils/prices';
import FormattedPriceImpact from './FormattedPriceImpact';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';

export default function SwapModalFooter({
  allowedSlippage,
  disabledConfirm,
  onConfirm,
  swapErrorMessage,
  trade,
}: {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const theme = useContext(ThemeContext);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );
  const { exchange } = useContext(DappContext);
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(
    () => computeTradePriceBreakdown(exchange, trade),
    [trade, exchange]
  );
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text color={theme.text2} fontSize={12} fontWeight={400}>
            Price
          </Text>
          <Text
            color={theme.text1}
            fontSize={12}
            fontWeight={500}
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              paddingLeft: '10px',
              textAlign: 'right',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini
              onClick={() => setShowInverted(!showInverted)}
            >
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={12} fontWeight={400}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? 'Minimum received'
                : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={12}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TYPE.black>
            <TYPE.black fontSize={12} marginLeft={'4px'}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? getDefaultCurrencySymbol(trade.outputAmount.currency)
                : getDefaultCurrencySymbol(trade.inputAmount.currency)}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={12} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={12} fontWeight={400}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={12}>
            {realizedLPFee
              ? realizedLPFee?.toSignificant(6) +
                ' ' +
                getDefaultCurrencySymbol(trade.inputAmount.currency)
              : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          disabled={disabledConfirm}
          error={severity > 2}
          id="confirm-swap-or-send"
          style={{ margin: '10px 0 0 0' }}
          tw="hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400"
          onClick={onConfirm}
        >
          <span tw="text-xl font-medium">
            {severity > 2 ? 'SWAP ANYWAY' : 'CONFIRM SWAP'}
          </span>
        </ButtonError>

        {swapErrorMessage ? (
          <SwapCallbackError error={swapErrorMessage} />
        ) : null}
      </AutoRow>
    </>
  );
}
