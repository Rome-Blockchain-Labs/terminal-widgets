import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import IconArrowRight from '../../assets/icons/icon-arrow-right.svg';
import IconInfo from '../../assets/icons/icon-info.svg';
import IconReview from '../../assets/icons/icon-review.svg';
import IconReviewGreen from '../../assets/icons/icon-review-green.svg';
import { MediumButton, NumFont } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import TokenImage from '../../components/TokenImage';
import { validateStrategy } from '../../redux/derivedState';
import { isToken0Base, setRetries } from '../../redux/strategy/strategySlice';
import { openReviewModal } from '../../redux/strategy/strategySlice';
import ConfirmDeploymentErrorModal from './ConfirmDeploymentErrorModal';
import ConfirmDeploymentSuccessModal from './ConfirmDeploymentSuccessModal';
import ExchangeReviewModal from './ExchangeReviewModal';
import { usd } from './StrategyModeSelector/allowableStrategyModes';

const MediumButtonDarkGradient = styled(MediumButton)`
  background: linear-gradient(70deg, #1f8486 0%, #ed127a 100%);
  :hover {
    background: linear-gradient(70deg, #ed127a 0%, #1f8486 100%);
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const BoldText = styled.span`
  color: #08333c;
  font-weight: bold;
`;

const BoldLabel = styled.span`
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

const ExchangeReview = () => {
  const dispatch = useDispatch();
  const invalidReasons = useSelector(validateStrategy);
  const {
    buyingToken0,
    gwei,
    numRetries,
    price,
    priceImpact,
    priceIsUpperBound,
    selectedExchange,
    slippagePercent,
    strategyMode,
    token0Amount,
    token1Amount,
  } = useSelector((state) => state?.velox?.strategy);
  const { selectedPair } = useSelector(
    (state) => state?.velox?.tokenSearch || {}
  );
  const { connection } = useSelector((state) => state?.velox?.wallet);

  if (!selectedPair) {
    return <></>;
  }

  const { token0, token1 } = selectedPair;
  const amount = buyingToken0 ? token1Amount : token0Amount;
  const token0IsBase = isToken0Base(selectedExchange, token0, token1);
  const baseToken = token0IsBase ? token0 : token1;
  const nonBaseToken = token0IsBase ? token1 : token0;

  const opReviewStrategyOpen = () => dispatch(openReviewModal());

  return (
    <>
      <ExchangeReviewModal />
      <ConfirmDeploymentSuccessModal />
      <ConfirmDeploymentErrorModal />

      <div style={{ color: '#08333c' }}>
        <GridContainer>
          <ColumnLeft>
            <BoldLabel>TRADE</BoldLabel>
          </ColumnLeft>
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
          <ColumnLeft>
            <BoldLabel>SPEND</BoldLabel>
          </ColumnLeft>
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

          <ColumnLeft>
            <BoldLabel>MAX GAS</BoldLabel>
          </ColumnLeft>
          <ColumnRight>
            <NumFont>{gwei}</NumFont>
            <BoldText>
              {connection?.chainHex === '0xa86a' ? 'nAVAX (GWEI)' : 'GWEI'}
            </BoldText>
          </ColumnRight>
          <ColumnLeft>
            <BoldLabel>MARKET MOVEMENT</BoldLabel>
          </ColumnLeft>
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
            <BoldLabel># OF RE-TRIES </BoldLabel>
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
          {!invalidReasons.length ? (
            <MediumButtonDarkGradient onClick={() => opReviewStrategyOpen()}>
              REVIEW
              <img alt={'deploy'} src={IconReview} width={30} />
            </MediumButtonDarkGradient>
          ) : (
            <MediumButtonDarkGradient>
              REVIEW
              <img alt={'noDeploy'} src={IconReviewGreen} width={30} />
            </MediumButtonDarkGradient>
          )}
        </FlexRow>
        <div style={{ fontSize: '9px', marginTop: '29px', textAlign: 'right' }}>
          NOTE: Tokens with special tokenomics (transfer tax etc) are not yet
          supported
        </div>
      </div>
    </>
  );
};

export default ExchangeReview;
