import { isWrappedNativeToken } from '@rbl/velox-common/multiChains';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import IconArrowRight from '../../assets/icons/icon-arrow-right.svg';
import IconError from '../../assets/icons/icon-error.svg';
import IconInfoDark from '../../assets/icons/icon-info-dark.svg';
import { OutlinedInput } from '../../assets/styled';
import { Button } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import TokenDropdown from '../../components/TokenDropdown';
import TokenImage from '../../components/TokenImage';
import {
  token0IsBaseSelector,
  validateStrategy,
} from '../../redux/derivedState';
import { INVALID } from '../../redux/derivedState';
import useTokenQuota from '../../redux/quotas/useTokenQuota';
import {
  setSlippagePercent,
  swapPriceBound,
  toggleDirection,
  updatePrice,
  updateStrategyAmounts,
} from '../../redux/strategy/strategySlice';
import MinMax from './MinMax';
import ModeTriggerReference from './StrategyModeSelector/ModeTriggerReference';

const ButtonMaxAmount = styled(Button)`
  padding: 6px 10px 5px 13px;
  width: 92px;
  margin: 0 0 0 0;
  float: initial;
  > img {
    margin: 0px 0px 0px 10px;
    right: 3px;
  }
`;

const RotatingImg = styled.img`
  @media only screen and (max-width: 769px) {
    margin: 5px 0;
    transform: rotate(90deg);
  }
`;

const RotatingImgWrapper = styled.div`
  vertical-align: middle;
  text-align: center;
  width: 43px;
  height: 43px;
  line-height: 40px;
  box-shadow: 0 0 0 2px #15b3b0;
  display: inline-block;

  background-color: #0d6d6f;
  border-radius: 50%;
`;

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 1100px) {
    gap: 12px 0px;
  }
`;
const MobileDownFlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 769px) {
    flex-direction: column;
  }
`;

const SpacedFlexItem = styled.div`
  margin: 0px 10px;
`;
const FlexItem = styled.div`
  margin: 7px 3px;
`;

const MiniOutlinedInput = styled(OutlinedInput)`
  width: 60px;
  margin: 0 5px;
`;

const StepHeading = styled.h2`
  text-align: left;
  font: normal normal bold 14px/18px Montserrat;
  letter-spacing: 0px;
  color: #00d3cf;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

export const FixedPriceStrategy = () => {
  const dispatch = useDispatch();
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

  return (
    <>
      <StepHeading>EXCHANGE</StepHeading>

      <FlexRow>
        <FlexRow>
          <FlexRow style={{ justifyContent: 'flex-end', minWidth: '154px' }}>
            {allowMaxClick && (
              <div
                style={{ marginRight: '5px' }}
                onClick={(e) => {
                  dispatch(updateStrategyAmounts(soldTokenBal));
                }}
              >
                <ButtonMaxAmount>MAXIMUM</ButtonMaxAmount>
              </div>
            )}
            <b>AMOUNT</b>
          </FlexRow>
          <FlexRow>
            <SpacedFlexItem>
              <OutlinedInput
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
                  <img alt="error icon" id="" src={IconError} width="20" />
                </PinkTooltip>
              )) ||
                (invalidReasons.includes(INVALID.STEP2_ALLOWANCE) && (
                  <PinkTooltip title={INVALID.STEP2_ALLOWANCE}>
                    <img alt="error icon" id="" src={IconError} width="20" />
                  </PinkTooltip>
                ))}
            </SpacedFlexItem>
            <FlexItem>
              <TokenImage token={buyingToken0 ? token1 : token0} />
            </FlexItem>
          </FlexRow>
        </FlexRow>

        <MobileDownFlexRow
          style={{ cursor: 'pointer' }}
          onClick={() => dispatch(toggleDirection())}
        >
          <FlexItem>
            <TokenDropdown token={buyingToken0 ? token1 : token0} />
          </FlexItem>
          <SpacedFlexItem>
            <RotatingImgWrapper>
              <RotatingImg
                alt={'arrowRight'}
                id={'exchange-tokens-arrow'}
                src={IconArrowRight}
                width={20}
              />
            </RotatingImgWrapper>
          </SpacedFlexItem>
          <FlexItem>
            <TokenDropdown token={buyingToken0 ? token0 : token1} />
          </FlexItem>
        </MobileDownFlexRow>
      </FlexRow>
      <FlexRow>
        <FlexItem>
          When the value of one <TokenImage token={nonBaseToken} /> is
        </FlexItem>
      </FlexRow>
      <FlexRow>
        <FlexItem>
          <MinMax
            isMax={priceIsUpperBound}
            toggleDir={() => dispatch(swapPriceBound())}
          />
        </FlexItem>
        <OutlinedInput
          charLength={price?.length}
          invalid={invalidReasons.includes(INVALID.STEP3_PRICE)}
          min="0"
          step="any"
          type="tel"
          value={price}
          onChange={(e) => dispatch(updatePrice(e.target.value))}
        />{' '}
        <FlexItem>
          <ModeTriggerReference baseToken={baseToken} />
        </FlexItem>
      </FlexRow>
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
    </>
  );
};
