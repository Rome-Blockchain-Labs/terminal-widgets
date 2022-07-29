import { isWrappedNativeToken } from '@rbl/velox-common/multiChains';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  token0IsBaseSelector,
  validateStrategy,
} from '../../../redux/derivedState';
import { INVALID } from '../../../redux/derivedState';
import useTokenQuota from '../../../redux/quotas/useTokenQuota';
import {
  setSlippagePercent,
  swapPriceBound,
  toggleDirection,
  updatePrice,
  updateStrategyAmounts,
} from '../../../redux/strategy/strategySlice';
import IconArrowRight from '../../assets/icons/icon-arrow-right.svg';
import IconError from '../../assets/icons/icon-error.svg';
import IconInfoDark from '../../assets/icons/icon-info-dark.svg';
import { OutlinedDarkInput } from '../../assets/styled';
import { Button } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import TokenImage from '../../components/TokenImage';
import TokenOutlinedDropdown from '../../components/TokenOutlinedDropdown';
import {
  useWidgetSizeState,
  withEnlargedProps,
} from '../../WidgetSizeStateContext';
import MinMax from './MinMax';
import ModeTriggerReference from './StrategyModeSelector/ModeTriggerReference';

const ButtonMaxAmount = styled(Button)`
  padding: 0.375rem 1.875rem 0.313rem 0.813rem;
  width: 5.625rem;
  margin: 0 0 0 0;
  margin-right: 0.3rem;
  float: initial;
  > img {
    margin: 0rem 0rem 0rem 0.625rem;
    right: 0.188rem;
  }
`;

const RotatingImg = styled.img`
  @media only screen and (max-width: 48.063rem) {
    // margin: .313rem 0;
    // transform: rotate(90deg);
  }
`;

const NormalRotatingImgWrapper = styled.div`
  vertical-align: middle;
  text-align: center;
  width: 1.875rem;
  height: 1.875rem;
  line-height: 1.875rem;
  box-shadow: 0 0 0 0.125rem #15b3b0;
  display: inline-block;
  border-radius: 50%;

  img {
    margin: 0.375rem;
  }
`;

const EnlargedRotatingImgWrapper = styled(NormalRotatingImgWrapper)`
  width: 3.75rem;
  height: 3.75rem;
  line-height: 3.75rem;
  margin: 0 0.5rem;
  img {
    margin: 0.8rem;
  }
`;

const RotatingImgWrapper = withEnlargedProps(
  NormalRotatingImgWrapper,
  EnlargedRotatingImgWrapper
);

const NormalFlexRow = styled.div`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  font-size: 0.5rem;
`;

const EnlargedFlexRow = styled(NormalFlexRow)`
  justify-content: center;
  font-size: 0.875rem;
`;
const FlexRow = withEnlargedProps(NormalFlexRow, EnlargedFlexRow);

const NormalContentRow = styled.div`
  margin-bottom: ${(props) => (props.enlarged ? '1.75rem' : '1rem')};
`;
const ContentRow = withEnlargedProps(NormalContentRow);

const FlexItem = styled.div`
  margin: 0 0.188rem;
`;

const NormalMiniOutlinedInput = styled(OutlinedDarkInput)`
  width: ${(props) => (props.enlarged ? '6rem' : '4rem')};
  margin: 0 0.313rem;
`;
const MiniOutlinedInput = withEnlargedProps(NormalMiniOutlinedInput);

const NormalPriceOutlinedInput = styled(OutlinedDarkInput)`
  width: ${(props) => (props.enlarged ? '6rem' : '4rem')};
`;
const PriceOutlinedInput = withEnlargedProps(NormalPriceOutlinedInput);

export const FixedPriceStrategy = () => {
  const dispatch = useDispatch();
  const widgetSizeState = useWidgetSizeState();
  const invalidReasons = useSelector(validateStrategy);

  const { connected } = useSelector((state) => state?.velox?.wallet.connection);
  const { selectedPair } = useSelector((state) => state?.velox?.tokenSearch);
  const token0IsBase = useSelector(token0IsBaseSelector);
  const {
    buyingToken0,
    price,
    priceImpact,
    priceIsUpperBound,
    selectedExchange,
    slippagePercent,
    token0Amount,
    token1Amount,
  } = useSelector((state) => state?.velox?.strategy);
  const { token0, token1 } = useSelector(
    (state) => state?.velox?.tokenSearch.selectedPair || {}
  ); //todo
  const token0Bal = useTokenQuota(token0?.id, 'balance')?.value;
  const token1Bal = useTokenQuota(token1?.id, 'balance')?.value;
  const soldTokenBal = buyingToken0 ? token1Bal : token0Bal;
  const amount = buyingToken0 ? token1Amount : token0Amount;

  if (!connected || !selectedPair) {
    return null;
  }
  const nonBaseToken = token0IsBase ? token1 : token0;
  const baseToken = token0IsBase ? token0 : token1;

  const sellingNativeToken = isWrappedNativeToken(
    selectedExchange.identifiers.blockchain,
    selectedExchange.identifiers.chainId,
    buyingToken0 ? token1?.id : token0?.id
  );
  const allowMaxClick =
    !!soldTokenBal &&
    Number(soldTokenBal) > 0 &&
    amount !== soldTokenBal &&
    !sellingNativeToken;

  const customRowStyle = {};

  if (widgetSizeState.enlarged) {
    customRowStyle.marginLeft = '-3.5rem';
    customRowStyle.marginRight = '-3.5rem';
  }

  return (
    <>
      <ContentRow>
        <FlexRow style={{ marginBottom: '.938rem' }}>
          <FlexItem>
            <FlexRow>
              {allowMaxClick && (
                <ButtonMaxAmount
                  onClick={(e) => {
                    dispatch(updateStrategyAmounts(soldTokenBal));
                  }}
                >
                  MAXIMUM
                </ButtonMaxAmount>
              )}
              <b>AMOUNT</b>
            </FlexRow>
          </FlexItem>
          <FlexItem>
            <FlexRow style={{ margin: '0' }}>
              <FlexItem style={{ display: 'flex' }}>
                <OutlinedDarkInput
                  charLength={amount?.length}
                  invalid={
                    invalidReasons.includes(INVALID.STEP3_AMOUNT) ||
                    invalidReasons.includes(INVALID.STEP3_BALANCE) ||
                    invalidReasons.includes(INVALID.STEP2_ALLOWANCE)
                  }
                  style={{ display: 'inline-block' }}
                  type="tel"
                  value={amount || ''}
                  onChange={(e) =>
                    dispatch(updateStrategyAmounts(e.target.value))
                  }
                />
                {(invalidReasons.includes(INVALID.STEP3_BALANCE) && (
                  <PinkTooltip
                    title={`Not enough ${
                      (buyingToken0 ? token1 : token0).symbol
                    } balance`}
                  >
                    <img
                      alt="error icon"
                      id=""
                      src={IconError}
                      width={widgetSizeState.enlarged ? 40 : 20}
                    />
                  </PinkTooltip>
                )) ||
                  (invalidReasons.includes(INVALID.STEP2_ALLOWANCE) && (
                    <PinkTooltip title={INVALID.STEP2_ALLOWANCE}>
                      <img
                        alt="error icon"
                        id=""
                        src={IconError}
                        width={widgetSizeState.enlarged ? 40 : 20}
                      />
                    </PinkTooltip>
                  ))}
              </FlexItem>
              <FlexItem>
                <TokenImage token={buyingToken0 ? token1 : token0} />
              </FlexItem>
            </FlexRow>
          </FlexItem>
        </FlexRow>
      </ContentRow>

      <ContentRow>
        <FlexRow
          style={{ cursor: 'pointer' }}
          onClick={() => dispatch(toggleDirection())}
        >
          <FlexItem>
            <TokenOutlinedDropdown token={buyingToken0 ? token1 : token0} />
          </FlexItem>
          <FlexItem>
            <RotatingImgWrapper>
              <RotatingImg
                alt={'arrowRight'}
                id={'exchange-tokens-arrow'}
                src={IconArrowRight}
              />
            </RotatingImgWrapper>
          </FlexItem>
          <FlexItem>
            <TokenOutlinedDropdown token={buyingToken0 ? token0 : token1} />
          </FlexItem>
        </FlexRow>
      </ContentRow>

      <ContentRow>
        <FlexRow style={{ paddingBottom: '1.25rem', ...customRowStyle }}>
          <FlexItem>
            When the price of one &nbsp;
            <TokenImage token={nonBaseToken} />
          </FlexItem>
          <FlexItem>
            <MinMax
              isMax={priceIsUpperBound}
              toggleDir={() => dispatch(swapPriceBound())}
            />
          </FlexItem>
          <FlexItem>&nbsp;&nbsp;than&nbsp;</FlexItem>
          <FlexItem>
            <PriceOutlinedInput
              charLength={price?.length}
              invalid={invalidReasons.includes(INVALID.STEP3_PRICE)}
              min="0"
              step="any"
              type="tel"
              value={price}
              onChange={(e) => dispatch(updatePrice(e.target.value))}
            />
          </FlexItem>
          <FlexItem>
            <ModeTriggerReference baseToken={baseToken} />
          </FlexItem>
        </FlexRow>
      </ContentRow>

      <ContentRow>
        <FlexRow>
          allowing a market movement of
          <MiniOutlinedInput
            invalid={invalidReasons.includes(INVALID.STEP3_PRICE_MOVEMENT)}
            min="0"
            step="any"
            type="tel"
            // placeholder={"0.3"}
            value={slippagePercent}
            onChange={(e) => dispatch(setSlippagePercent(e.target.value))}
          />
          percent
          <PinkTooltip
            title={`Big trades on low liquidity pairs will cause market price changes in the pair. This trade will currently move the market by ${priceImpact}% You must set a higher allowable market movement in order to execute in the future. `}
          >
            <img alt={'help info'} src={IconInfoDark} width={20} />
          </PinkTooltip>
        </FlexRow>
      </ContentRow>
    </>
  );
};
