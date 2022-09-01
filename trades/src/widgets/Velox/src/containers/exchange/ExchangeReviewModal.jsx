import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'reactstrap';
import styled from 'styled-components';

import IconArrowRight from '../../assets/icons/icon-arrow-right.svg';
import IconCloseXGreen from '../../assets/icons/icon-close-x-green.svg';
import IconDeploy from '../../assets/icons/icon-deploy.svg';
import IconInfo from '../../assets/icons/icon-info.svg';
import { MediumButton, NumFont } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import TokenImage from '../../components/TokenImage';
import { token0IsBaseSelector } from '../../redux/derivedState';
import {
  addStrategy,
  closeReviewModal,
  setRetries,
} from '../../redux/strategy/strategySlice';
import useProvider from '../ethereum/use-provider';
import { usd } from './StrategyModeSelector/allowableStrategyModes';

const StyledModal = styled(Modal)`
  > * {
    border-radius: 20px;
    border: 2px solid #067c82;
    background-color: #05595a;
    box-shadow: rgba(34, 178, 177, 0.5) 4px 0px 4px 0px,
      rgba(34, 178, 177, 0.5) 0px 4px 4px 0px;
    padding-bottom: 15px;
  }
  text-align: center;
  display: flex;
`;

const NegativeButton = styled(MediumButton)`
  color: #08333c;
  background: #067c82;

  :hover {
    background: #03a7a9;
  }
`;
const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const BoldText = styled.span`
  color: #00d3cf;
  font-weight: bold;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 140px minmax(auto, 250px);
  gap: 20px;
  margin: 0 auto;

  @media (max-width: 991px) {
    grid-template-columns: 100px minmax(auto, 250px);
  }
`;
const ColumnLeft = styled(BoldText)`
  place-self: end;
  margin: auto 0;
  text-align: right;
`;
const ColumnRight = styled.div`
  place-self: start;
  margin: auto 0;
  word-wrap: normal;
  * {
    display: inline-block;
    margin: 0 3px;
  }
`;

const RadioInput = styled.label`
  input[type='radio']:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    left: -1px;
    position: relative;
    background-color: #08333c;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid #067c82;
  }

  input[type='radio']:checked:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    left: -1px;
    position: relative;
    background-color: #067c82;
    content: '';
    display: inline-block;
    visibility: visible;
    box-shadow: inset 0 0 5px #08333c;
`;

const ExchangeReviewModal = () => {
  const { provider } = useProvider();
  const dispatch = useDispatch();
  const {
    buyingToken0,
    gwei,
    numRetries,
    price,
    priceImpact,
    priceIsUpperBound,
    reviewModalOpen,
    slippagePercent,
    strategyMode,
    token0Amount,
    token1Amount,
  } = useSelector((state) => state?.velox?.strategy);
  const { selectedPair } = useSelector(
    (state) => state?.velox?.tokenSearch || {}
  );
  const { token0, token1 } = selectedPair;
  const amount = buyingToken0 ? token1Amount : token0Amount;
  const token0IsBase = useSelector(token0IsBaseSelector);
  const baseToken = token0IsBase ? token0 : token1;
  const nonBaseToken = token0IsBase ? token1 : token0;

  const onAddStrategy = () => {
    dispatch(closeReviewModal());
    dispatch(addStrategy({ provider }));
  };
  const onCloseReviewModal = () => dispatch(closeReviewModal());
  const { connection } = useSelector((state) => state?.velox?.wallet);

  return (
    <StyledModal
      centered={true}
      isOpen={reviewModalOpen}
      toggle={onCloseReviewModal}
    >
      <div style={{ padding: '10px 10px 0 10px', textAlign: 'right' }}>
        <a href="/#" onClick={onCloseReviewModal}>
          <img alt={'deploy'} src={IconCloseXGreen} width={15} />
        </a>
      </div>
      <GridContainer>
        <ColumnLeft>TRADE</ColumnLeft>
        <ColumnRight>
          <TokenImage token={buyingToken0 ? token1 : token0} />
          <img
            alt={'arrowRight'}
            id={'exchange-tokens-arrow'}
            src={IconArrowRight}
            width={20}
          />
          <TokenImage token={buyingToken0 ? token0 : token1} />
        </ColumnRight>
        <ColumnLeft>SPEND</ColumnLeft>
        <ColumnRight>
          <NumFont>{amount}</NumFont>
          <BoldText>{buyingToken0 ? token1.symbol : token0.symbol}</BoldText>
          {strategyMode === usd ? (
            <>
              when
              <BoldText>{nonBaseToken.symbol}</BoldText>
              is
              <NumFont>${price}</NumFont>
              {priceIsUpperBound ? 'or less' : 'or more'}
            </>
          ) : (
            <>
              when one
              <BoldText>{nonBaseToken.symbol}</BoldText>
              is worth
              <NumFont>{price}</NumFont>
              {priceIsUpperBound ? 'or less' : 'or more'}
              <BoldText>{baseToken.symbol}</BoldText>
            </>
          )}
        </ColumnRight>

        <ColumnLeft>MAX GAS</ColumnLeft>
        <ColumnRight>
          <NumFont>{gwei}</NumFont>
          <BoldText>
            {connection?.chainHex === '0xa86a' ? 'nAVAX (GWEI)' : 'GWEI'}
          </BoldText>
        </ColumnRight>
        <ColumnLeft>MARKET MOVEMENT</ColumnLeft>
        <ColumnRight>
          Ensure the market moves less than
          <BoldText>{slippagePercent || 0.3} %</BoldText>
          {!!priceImpact && (
            <>
              Current price impact of this trade is
              <BoldText>-{priceImpact} %</BoldText>
            </>
          )}
        </ColumnRight>
        <ColumnLeft>
          # OF RE-TRIES{' '}
          <PinkTooltip
            title={
              'Select the number of times you want this strategy to automatically re-try. Each re-try will spend additional gas.'
            }
          >
            <img alt={'information icon'} src={IconInfo} width={17} />
          </PinkTooltip>
        </ColumnLeft>
        <ColumnRight>
          <RadioInput>
            <NumFont>0</NumFont>
            <input
              checked={numRetries === 0}
              type={'radio'}
              onChange={() => dispatch(setRetries(0))}
            />
          </RadioInput>
          <RadioInput>
            <NumFont>1</NumFont>
            <input
              checked={numRetries === 1}
              type={'radio'}
              onChange={() => dispatch(setRetries(1))}
            />
          </RadioInput>
          <RadioInput>
            <NumFont>2</NumFont>
            <input
              checked={numRetries === 2}
              type={'radio'}
              onChange={() => dispatch(setRetries(2))}
            />
          </RadioInput>
        </ColumnRight>
      </GridContainer>
      <br />
      <FlexRow>
        <NegativeButton onClick={onCloseReviewModal}>
          CANCEL
          <img alt={'deploy'} src={IconCloseXGreen} width={30} />
        </NegativeButton>
        <MediumButton onClick={onAddStrategy}>
          DEPLOY
          <img alt={'deploy'} src={IconDeploy} width={30} />
        </MediumButton>
      </FlexRow>
    </StyledModal>
  );
};

export default ExchangeReviewModal;
