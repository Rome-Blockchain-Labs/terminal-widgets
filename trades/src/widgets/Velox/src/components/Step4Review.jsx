import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ExchangeReview from '../containers/exchange/ExchangeReview';
import { completeStep4 } from '../redux/strategyConfig/strategyConfigSlice';
import StepperItem from './common/v2/StepperItem';

const StepReview = (props) => {
  const dispatch = useDispatch();
  const stepCompletions = useSelector((state) => state?.velox?.strategyConfig);

  useEffect(() => {
    const completedStep3 = stepCompletions.completedStep3;
    if (completedStep3) {
      dispatch(completeStep4(true));
    } else {
      dispatch(completeStep4(false));
    }
  }, [stepCompletions, dispatch]);

  return (
    <StepperItem
      bodyBackgroundColor="#139DA0"
      completed={props.completed}
      headerText="Review & Deployment"
      indexBackgroundColor="#17B5B8"
      indexText="Step&nbsp;4"
      name={props.name}
      opened={props.opened}
      ready={props.ready}
      onOpen={props.onOpen}
    >
      <ExchangeReview />
    </StepperItem>
  );
};

export default StepReview;
