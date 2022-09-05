import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { validateStrategy } from '../../../redux/derivedState';
import {
  isToken0Base,
  setRetries,
} from '../../../redux/strategy/strategySlice';
import { openReviewModal } from '../../../redux/strategy/strategySlice';
import IconArrowRight from '../../assets/icons/icon-arrow-right.svg';
import IconInfo from '../../assets/icons/icon-info.svg';
import IconReview from '../../assets/icons/icon-review.svg';
import IconReviewGreen from '../../assets/icons/icon-review-green.svg';
import { HelpText, ImageButton, NumFont } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import TokenInlineDropdown from '../../components/TokenInlineDropdown';
import { withEnlargedProps } from '../../WidgetSizeStateContext';
import { usd } from './StrategyModeSelector/allowableStrategyModes';

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
`;

const BoldText = styled.span`
  color: #15b3b0;
  font-weight: bold;
`;

const BoldLabel = withEnlargedProps(styled.span`
  color: #00d3cf;
  font-weight: bold;
  font-size: ${(props) => (props.enlarged ? '.875rem' : '.625rem')};
`);

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 8.75rem minmax(auto, 30rem);
  gap: 0.625rem;
  margin: 0 auto;

  @media (max-width: 61.938rem) {
    grid-template-columns: 6.25rem minmax(auto, 30rem);
  }
`;

const ColumnLeft = withEnlargedProps(styled(BoldText)`
  place-self: start;
  margin: auto 0;
  margin-bottom: ${(props) => (props.enlarged ? '1.625rem' : '0')};
  text-align: left;
`);

const ColumnRight = withEnlargedProps(styled.div`
  font-size: ${(props) => (props.enlarged ? '.875rem' : '.625rem')};
  margin: auto 0;
  margin-bottom: ${(props) => (props.enlarged ? '1.625rem' : '0')};
  place-self: start;
  word-wrap: normal;
  color: #15b3b0;
  > * {
    display: inline-block;
    margin: 0 0.188rem;
  }
`);

const RadioInput = styled.label`
  input[type='radio']:after {
    width: .938rem;
    height: .938rem;
    border-radius: .938rem;
    left: -0.063rem;
    position: relative;
    background-color: #08333c;
    content: '';
    display: inline-block;
    visibility: visible;
    border: .125rem solid #067c82;
  }

  input[type='radio']:checked:after {
    width: .938rem;
    height: .938rem;
    border-radius: .938rem;
    left: -0.063rem;
    position: relative;
    background-color: #067c82;
    content: '';
    display: inline-block;
    visibility: visible;
    box-shadow: inset 0 0 .313rem #08333c;
`;

const TokenExchangeArrow = withEnlargedProps(styled.div`
  display: flex;
  height: 2.5rem;
  margin: 0 1rem;
`);

const TokenExchangeRow = styled.div`
  display: flex;
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
      <div style={{ color: '#08333c' }}>
        <GridContainer>
          <ColumnLeft>
            <BoldLabel>TRADE:</BoldLabel>
          </ColumnLeft>
          <ColumnRight>
            <TokenExchangeRow>
              <TokenInlineDropdown token={buyingToken0 ? token1 : token0} />
              <TokenExchangeArrow>
                <img
                  alt={'arrowRight'}
                  id={'exchange-tokens-arrow'}
                  src={IconArrowRight}
                  width={20}
                />
              </TokenExchangeArrow>
              <TokenInlineDropdown token={buyingToken0 ? token0 : token1} />
            </TokenExchangeRow>
          </ColumnRight>
          <ColumnLeft>
            <BoldLabel>SPENDING:</BoldLabel>
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
            <BoldLabel>MAX GAS:</BoldLabel>
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
            <BoldLabel># OF RETRIES:</BoldLabel>
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
              <NumFont>0</NumFont>&nbsp;
              <input
                checked={numRetries === 0}
                type={'radio'}
                onChange={() => dispatch(setRetries(0))}
              />
            </RadioInput>
            <RadioInput>
              <NumFont>1</NumFont>&nbsp;
              <input
                checked={numRetries === 1}
                type={'radio'}
                onChange={() => dispatch(setRetries(1))}
              />
            </RadioInput>
            <RadioInput>
              <NumFont>2</NumFont>&nbsp;
              <input
                checked={numRetries === 2}
                type={'radio'}
                onChange={() => dispatch(setRetries(2))}
              />
            </RadioInput>
          </ColumnRight>
          <ColumnLeft>&nbsp;</ColumnLeft>
          <ColumnRight>
            <FlexRow>
              {!invalidReasons.length ? (
                <ImageButton onClick={() => opReviewStrategyOpen()}>
                  REVIEW&nbsp;
                  <img alt={'deploy'} src={IconReview} />
                </ImageButton>
              ) : (
                <ImageButton style={{ cursor: 'pointer' }}>
                  REVIEW&nbsp;
                  <img alt={'noDeploy'} src={IconReviewGreen} />
                </ImageButton>
              )}
            </FlexRow>
          </ColumnRight>
        </GridContainer>
        <div
          style={{
            color: '#15b3b0',
            marginTop: '1rem',
            textAlign: 'right',
          }}
        >
          <HelpText>
            NOTE: Tokens with special tokenomics (transfer tax etc) are not yet
            supported
          </HelpText>
        </div>
      </div>
    </>
  );
};

export default ExchangeReview;
