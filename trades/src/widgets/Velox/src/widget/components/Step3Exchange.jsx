import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { validateStrategy } from '../../redux/derivedState';
import { completeStep3 } from '../../redux/strategyConfig/strategyConfigSlice';
import { FixedPriceStrategy } from '../containers/exchange/index';
import { StepPagination } from '../containers/pagination';
import { StepHeading, StepSection } from './common/css';
import StepperItem from './common/v2/StepperItem';
const StepExchange = (props) => {
  const dispatch = useDispatch();
  const invalidReasons = useSelector(validateStrategy);
  const stepCompletions = useSelector((state) => state?.velox?.strategyConfig);

  useEffect(() => {
    const completedStep2 = stepCompletions.completedStep2;
    const incomplete = invalidReasons.length > 0;

    if (!completedStep2) {
      return dispatch(completeStep3(false));
    }

    dispatch(completeStep3(!incomplete));
  }, [invalidReasons, stepCompletions, dispatch]);

  return (
    <StepperItem
      bodyBackgroundColor="#0D8486"
      completed={props.completed}
      headerText="Exchange"
      indexBackgroundColor="#139DA0"
      indexText="Step&nbsp;3"
      name={props.name}
      opened={props.opened}
      ready={props.ready}
      onOpen={props.onOpen}
    >
      <StepHeading>Exchange</StepHeading>
      <StepSection>
        <FixedPriceStrategy></FixedPriceStrategy>
      </StepSection>
      <StepSection>
        <StepPagination />
      </StepSection>
    </StepperItem>
  );
};

export default StepExchange;
