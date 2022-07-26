// import { multiChains } from '@rbl/velox-common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { INVALID, validateStrategy } from '../../redux/derivedState';
import { completeStep1 } from '../../redux/strategyConfig/strategyConfigSlice';
import ExchangeSelector from '../containers/exchangeSelector';
import MaxGas from '../containers/maxGas';
import { StepPagination } from '../containers/pagination';
import TokenSearch from '../containers/tokenSearch';
import { withEnlargedProps } from '../WidgetSizeStateContext';
import { StepHeading, StepSection, StepText } from './common/css';
import StepperItem from './common/v2/StepperItem';
// const { NETWORKS } = multiChains;

const NormalSelectExchangeWrapper = styled.div`
  min-height: 15rem;
`;

const EnlargedSelectExchangeWrapper = styled.div`
  min-height: 20rem;
`;

const SelectExchangeWrapper = withEnlargedProps(
  NormalSelectExchangeWrapper,
  EnlargedSelectExchangeWrapper
);

const StepSelectExchange = (props) => {
  const dispatch = useDispatch();
  const invalidReasons = useSelector(validateStrategy);
  const { gwei } = useSelector((state) => state?.velox?.strategy);
  let fixedGasPrice;
  const { chainHex } = useSelector((state) => state?.velox?.wallet.connection);
  const { chainId } = useSelector(
    (state) => state?.velox?.strategy?.selectedExchange?.identifiers
  );
  const isWrongNetwork = parseInt(chainHex) !== parseInt(chainId);
  // if (
  //   selectedExchange?.key?.toLowerCase() ===
  //     NETWORKS.AVALANCHE.MAINNET.PANGOLIN.NAME.toLowerCase() ||
  //   selectedExchange?.key?.toLowerCase() ===
  //     NETWORKS.AVALANCHE.MAINNET.TRADERJOE.NAME.toLowerCase()
  // ) {
  //   fixedGasPrice = 225;
  // }
  // if (
  //   selectedExchange?.key?.toLowerCase() ===
  //   NETWORKS.BSC.MAINNET.PANCAKESWAP.NAME.toLowerCase()
  // ) {
  //   fixedGasPrice = 5;
  // }

  useEffect(() => {
    if (!invalidReasons.includes(INVALID.STEP1_NULL_PAIR) && gwei > 0) {
      dispatch(completeStep1(true));
    } else {
      dispatch(completeStep1(false));
    }
  }, [invalidReasons, gwei, dispatch]);

  return (
    <StepperItem
      bodyBackgroundColor="#05545A"
      completed={props.completed}
      headerText="Select Exchange"
      indexBackgroundColor="#0D6D6F"
      indexText="Step&nbsp;1"
      name={props.name}
      opened={props.opened}
      ready={props.ready}
      onOpen={props.onOpen}
    >
      <SelectExchangeWrapper>
        <StepSection>
          <StepHeading>Select Exchange</StepHeading>
          <ExchangeSelector />
        </StepSection>

        {!isWrongNetwork && (
          <div>
            <StepSection>
              <StepHeading>{!fixedGasPrice && 'Select'} Gas Limit</StepHeading>
              <MaxGas fixedGasPrice={fixedGasPrice} />
            </StepSection>
            <StepSection>
              <StepHeading>Select Token Pairing</StepHeading>
              <TokenSearch />
            </StepSection>
          </div>
        )}

        {isWrongNetwork && (
          <StepSection>
            <StepText>Please switch network</StepText>
          </StepSection>
        )}
      </SelectExchangeWrapper>

      <StepSection>
        <StepPagination />
      </StepSection>
    </StepperItem>
  );
};

export default StepSelectExchange;
