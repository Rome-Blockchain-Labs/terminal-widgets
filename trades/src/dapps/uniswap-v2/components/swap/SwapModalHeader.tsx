import { Trade, TradeType } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useContext, useMemo } from 'react';
import { AlertTriangle, ArrowDown } from 'react-feather';
import { Text } from 'rebass';
import { theme } from 'twin.macro';

import { ButtonPrimary } from '../../../../components/buttons';
import { AutoColumn } from '../../../../components/column';
import { RowBetween, RowFixed } from '../../../../components/row';
import { DappContext } from '../../../../contexts';
import {
  getDefaultCurrencySymbol,
  isAddress,
  shortenAddress,
} from '../../../../utils';
import { Field } from '../../state/swap/actions';
import { TYPE } from '../../theme';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  warningSeverity,
} from '../../utils/prices';
import CurrencyLogo from '../CurrencyLogo';
import { SwapShowAcceptChanges, TruncatedText } from './styleds';

export default function SwapModalHeader({
  allowedSlippage,
  onAcceptChanges,
  recipient,
  showAcceptChanges,
  trade,
}: {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  );
  const { exchange } = useContext(DappContext);
  const { priceImpactWithoutFee } = useMemo(
    () => computeTradePriceBreakdown(exchange, trade),
    [trade, exchange]
  );
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={trade.inputAmount.currency}
            size={'18px'}
            style={{ width: 'fit-content' }}
          />
          <TruncatedText
            color={
              showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT
                ? 'white'
                : ''
            }
            fontSize={12}
            fontWeight={500}
            style={{ marginLeft: '12px' }}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={12} fontWeight={500} style={{ marginLeft: '10px' }}>
            {getDefaultCurrencySymbol(trade.inputAmount.currency)}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown
          color={theme`colors.white`}
          size="16"
          style={{ marginLeft: '4px', minWidth: '16px' }}
        />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={trade.outputAmount.currency}
            size={'18px'}
            style={{ marginRight: '12px' }}
          />
          <TruncatedText
            color={
              priceImpactSeverity > 2
                ? theme`colors.red`
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? theme`colors.white`
                : ''
            }
            fontSize={12}
            fontWeight={500}
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={12} fontWeight={500} style={{ marginLeft: '10px' }}>
            {getDefaultCurrencySymbol(trade.outputAmount.currency)}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges gap={'0px'} justify="flex-start">
          <RowBetween>
            <RowFixed>
              <AlertTriangle
                color={theme`colors.yellow.400`}
                size={12}
                style={{ marginRight: '8px', minWidth: 24 }}
              />
              <span tw="text-xl text-yellow-400"> Price Updated</span>
            </RowFixed>
            <ButtonPrimary
              style={{
                borderRadius: '12px',
                fontSize: '0.825rem',
                padding: '.5rem',
              }}
              width="150px"
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn
        gap="sm"
        justify="flex-start"
        style={{ padding: '12px 0 0 0px' }}
      >
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <span tw="italic text-xl text-left">
            {'Output is estimated. You will receive at least '}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
              {getDefaultCurrencySymbol(trade.outputAmount.currency)}
            </b>
            {' or the transaction will revert.'}
          </span>
        ) : (
          <span tw="italic text-xl text-left">
            {'Input is estimated. You will sell at most '}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
              {getDefaultCurrencySymbol(trade.inputAmount.currency)}
            </b>
            {' or the transaction will revert.'}
          </span>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn
          gap="sm"
          justify="flex-start"
          style={{ padding: '12px 0 0 0px' }}
        >
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient) : recipient}
            </b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}
