import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import TimeAgo from 'timeago-react';

import IconCalender from '../../assets/icons/icon-calendar.svg';
import IconGreaterThan from '../../assets/icons/icon-greater-or-equal.svg';
import IconInfo from '../../assets/icons/icon-info.svg';
import IconLessThan from '../../assets/icons/icon-less-or-equal.svg';
import IconRemove from '../../assets/icons/icon-remove.svg';
import { MediumButton, NumFont, TokenFont } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import { PartnerStrategyDeployed } from '../../model/strategy';
import {
  deleteUserStrategy,
  recreateUserStrategy,
} from '../../redux/strategy/strategySlice';
import useProvider from '../ethereum/use-provider';
import ExchangeImage from './ExchangeImage';
import StrategyStatusIcon from './strategyStatus';

const EllipsisedNumFont = styled(NumFont)`
  vertical-align: middle;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12vw;
  @media only screen and (max-width: 1100px) {
    max-width: 300px;
  }
`;

const Block = styled.span`
  display: block;
`;

const AlternatingColorRow = styled.tr<any>`
  ${(props) => (props.index % 2 ? 'background-color:#213C4B;' : '')}
  ${(props) =>
    props.isOldSignatureStrategy &&
    (props.index % 2
      ? 'background-color:#84405f;'
      : 'background-color:#74304f;')}
  height:auto;
`;
const ClickableTooltip = styled(PinkTooltip)`
  cursor: pointer;
`;
const CenteredData = styled.td`
  text-align: center;
`;

const StrategyRow = (props: {
  strategy: PartnerStrategyDeployed;
  index: number;
}) => {
  const { index, strategy } = props;
  const {
    created_at,
    exchange,
    identifier,
    inToken,
    isUsdPriceRelatedToTokenIn,
    maxTokenOutPerTokenIn,
    maxUsdPrice,
    minTokenOutPerTokenIn,
    minUsdPrice,
    outToken,
    tokenInAmount,
    updated_at,
  } = strategy;
  const dispatch = useDispatch();
  const { provider } = useProvider();
  const onDeleteClick = () =>
    dispatch(deleteUserStrategy({ identifier, provider }));
  const onRecreateClick = () =>
    dispatch(recreateUserStrategy({ provider, strategy }));
  const inTokenSymbol = inToken.symbol.toUpperCase();
  const outTokenSymbol = outToken.symbol.toUpperCase();

  const triggeredOnNonBasePriceIncrease = Boolean(minUsdPrice);
  const triggeredOnNonBaseValueIncrease = Boolean(
    isUsdPriceRelatedToTokenIn ? minTokenOutPerTokenIn : maxTokenOutPerTokenIn
  );
  const typeGreaterThan =
    triggeredOnNonBasePriceIncrease || triggeredOnNonBaseValueIncrease;

  let thresholdValue =
    (minUsdPrice && `$${minUsdPrice}`) ||
    (maxUsdPrice && `$${maxUsdPrice}`) ||
    (minTokenOutPerTokenIn && `${minTokenOutPerTokenIn}`) ||
    (maxTokenOutPerTokenIn && `${maxTokenOutPerTokenIn}`) ||
    '';

  //when isUsdPriceRelatedToTokenIn, the threshold needs to be inverted.
  // isUsdPriceRelatedToTokenIn is equivalent to tokenOutIsBase. This is like saying
  // if !tokenOutIsBase, we we need to invert amounts for trigger
  const isUsdTriggered = minUsdPrice || maxUsdPrice;
  if (!isUsdTriggered && !isUsdPriceRelatedToTokenIn) {
    thresholdValue = String(1 / Number(thresholdValue));
  }

  const basePriceToken = isUsdPriceRelatedToTokenIn
    ? inTokenSymbol
    : outTokenSymbol;
  const nonBasePriceToken = isUsdPriceRelatedToTokenIn
    ? outTokenSymbol
    : inTokenSymbol;

  //Note that the minPrice is refering to the non-base token, whereas minTokenOut refers to tokenIn/tokenOut
  // hence why the isUsdPriceRelatedToTokenIn is, to bring them into the same comparison
  const thresholdTooltipText =
    (minUsdPrice &&
      `Execute when the price of ${basePriceToken} is more than ${thresholdValue}`) ||
    (maxUsdPrice &&
      `Execute when the price ${basePriceToken} is less than ${thresholdValue}`) ||
    `Execute when 1 ${basePriceToken} is worth ${
      triggeredOnNonBaseValueIncrease ? 'more' : 'less'
    } ${thresholdValue} ${nonBasePriceToken}`;

  const isOldSignatureStrategy =
    (strategy?.identifier?.length || 0) < 10 &&
    strategy?.strategyStatus !== 'SUCCESSFUL' &&
    strategy.numAttempts !== strategy.maxAttempts;

  return (
    <AlternatingColorRow
      key={index}
      index={index}
      isOldSignatureStrategy={isOldSignatureStrategy}
    >
      <td>
        {isOldSignatureStrategy ? (
          <TokenFont style={{ color: '#af98a4' }}>
            <MediumButton
              style={{ textAlign: 'center' }}
              onClick={onRecreateClick}
            >
              Re-sign
            </MediumButton>
          </TokenFont>
        ) : (
          <>
            <ExchangeImage exchangeName={exchange} />{' '}
            <TokenFont>
              {exchange === 'TraderJoe' ? 'Trader Joe' : exchange}
            </TokenFont>
          </>
        )}
      </td>
      <td>
        <img
          alt={''}
          src={outToken.primary_img_uri}
          style={{ borderRadius: '50%' }}
          width={20}
        />{' '}
        <TokenFont>{outTokenSymbol}</TokenFont>
      </td>
      <td>
        <img
          alt={''}
          src={inToken.primary_img_uri}
          style={{ borderRadius: '50%' }}
          width={20}
        />{' '}
        <TokenFont>{inTokenSymbol}</TokenFont>
      </td>
      <td>
        <EllipsisedNumFont>{tokenInAmount}</EllipsisedNumFont>
        <Block>{inTokenSymbol}</Block>
      </td>
      {isUsdTriggered ? (
        <td>
          <Block>
            <EllipsisedNumFont>{1}</EllipsisedNumFont> ({basePriceToken}){' '}
            {typeGreaterThan ? (
              <img alt="more than" src={IconGreaterThan} width="17" />
            ) : (
              <img alt="less than" src={IconLessThan} width="17" />
            )}
          </Block>
          <EllipsisedNumFont>{thresholdValue}</EllipsisedNumFont>
          <PinkTooltip title={thresholdTooltipText}>
            <img alt="more info" src={IconInfo} width="20" />
          </PinkTooltip>
        </td>
      ) : (
        <td>
          <Block>
            <EllipsisedNumFont>{1} </EllipsisedNumFont> ({basePriceToken}){' '}
            {typeGreaterThan ? (
              <img alt="more than" src={IconGreaterThan} width="17" />
            ) : (
              <img alt="less than" src={IconLessThan} width="17" />
            )}
          </Block>
          <Block>
            <EllipsisedNumFont>{thresholdValue}</EllipsisedNumFont> (
            {nonBasePriceToken})
            <PinkTooltip title={thresholdTooltipText}>
              <img alt="more info" src={IconInfo} width="20" />
            </PinkTooltip>
          </Block>
        </td>
      )}
      <td>
        <NumFont>{strategy.numAttempts}</NumFont> of {strategy.maxAttempts}
      </td>
      <CenteredData>
        <ClickableTooltip
          title={
            <>
              Processed:{' '}
              <TimeAgo datetime={new Date(updated_at)} locale="en-US" />
              <br />
              Created:{' '}
              <TimeAgo datetime={new Date(created_at)} locale="en-US" />
            </>
          }
        >
          <img alt="update dates" id="" src={IconCalender} width="20" />
        </ClickableTooltip>
        <StrategyStatusIcon strategy={strategy} />
      </CenteredData>
      <CenteredData>
        <ClickableTooltip title={'Remove'}>
          <img
            alt="Add"
            id=""
            src={IconRemove}
            width="20"
            onClick={onDeleteClick}
          />
        </ClickableTooltip>
      </CenteredData>
    </AlternatingColorRow>
  );
};

export default StrategyRow;
