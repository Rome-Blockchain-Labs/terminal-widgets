import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { STEP1, STEP2, STEP3, STEP4 } from '../../../constants';
import { closeList } from '../../../redux/strategy/strategySlice';
import { setCurrentStep } from '../../../redux/strategyConfig/strategyConfigSlice';
import StepPaginationNumber from '../../components/common/v2/StepPaginationNumber';
import { useWidgetSizeState } from '../../WidgetSizeStateContext';
import StepPaginationBackButton from './StepPaginationBackButton';
import StepPaginationNextButton from './StepPaginationNextButton';

const StepPaginationWrapper = styled.div`
  padding-top: 2rem;
  text-align: center;
`;

const FlatButton = styled.button`
  background: none;
  outline: none !important;
  box-shadow: none;
  padding: 0.25rem;
`;

export const StepPagination = memo(() => {
  const dispatch = useDispatch();
  const stepCompletions = useSelector(
    (state: any) => state?.velox?.strategyConfig
  );

  const onOpenedHandler = (name: string) => {
    dispatch(setCurrentStep(name));
    dispatch(closeList());
  };

  const widgetSizeState = useWidgetSizeState();

  if (!widgetSizeState.enlarged) {
    return null;
  }

  return (
    <StepPaginationWrapper>
      <StepPaginationBackButton />

      <FlatButton onClick={() => onOpenedHandler(STEP1)}>
        <StepPaginationNumber
          active={stepCompletions.currentStep === STEP1}
          step={'1'}
        />
      </FlatButton>
      <FlatButton
        disabled={!stepCompletions.readyStep2}
        onClick={() => onOpenedHandler(STEP2)}
      >
        <StepPaginationNumber
          active={stepCompletions.currentStep === STEP2}
          disabled={!stepCompletions.readyStep2}
          step={'2'}
        />
      </FlatButton>
      <FlatButton
        disabled={!stepCompletions.readyStep3}
        onClick={() => onOpenedHandler(STEP3)}
      >
        <StepPaginationNumber
          active={stepCompletions.currentStep === STEP3}
          disabled={!stepCompletions.readyStep3}
          step={'3'}
        />
      </FlatButton>
      <FlatButton
        disabled={!stepCompletions.readyStep4}
        onClick={() => onOpenedHandler(STEP4)}
      >
        <StepPaginationNumber
          active={stepCompletions.currentStep === STEP4}
          disabled={!stepCompletions.readyStep4}
          step={'4'}
        />
      </FlatButton>

      <StepPaginationNextButton />
    </StepPaginationWrapper>
  );
});
