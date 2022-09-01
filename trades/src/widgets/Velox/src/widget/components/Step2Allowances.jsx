import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { validateStrategy } from '../../redux/derivedState';
import { completeStep2 } from '../../redux/strategyConfig/strategyConfigSlice';
import Allowances from '../containers/allowances';
import { StepPagination } from '../containers/pagination';
import { StepHeading, StepSection } from './common/css';
import StepperItem from './common/v2/StepperItem';

const StepAllowances = (props) => {
  const dispatch = useDispatch();

  const invalidReasons = useSelector(validateStrategy);
  const stepCompletions = useSelector((state) => state?.velox?.strategyConfig);

  useEffect(() => {
    const completedStep1 = stepCompletions.completedStep1;

    if (!completedStep1) {
      return dispatch(completeStep2(false));
    }
    dispatch(completeStep2(true));
  }, [invalidReasons, stepCompletions, dispatch]);

  return (
    <StepperItem
      bodyBackgroundColor="#0D6D6F"
      completed={props.completed}
      headerText="Allowances & Wrapping"
      indexBackgroundColor="#0D8486"
      indexText="Step&nbsp;2"
      name={props.name}
      opened={props.opened}
      ready={props.ready}
      onOpen={props.onOpen}
    >
      <StepHeading>ALLOWANCES & WRAPPING</StepHeading>
      <StepSection>
        <Allowances></Allowances>
      </StepSection>
      <StepSection>
        <StepPagination />
      </StepSection>
    </StepperItem>
  );
};

export default StepAllowances;
