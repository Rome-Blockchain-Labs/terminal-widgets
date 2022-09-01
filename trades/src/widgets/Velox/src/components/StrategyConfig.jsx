import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { STEP1, STEP2, STEP3, STEP4 } from '../constants';
import withHeaderAndSigner from '../containers/ethereum/with-provider';
import StepSelectExchange from './Step1SelectExchange';
import StepAllowances from './Step2Allowances';
import StepExchange from './Step3Exchange';
import StepReview from './Step4Review';

const StepList = styled.div`
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 60px;
`;

const StepItemWrapper = styled.div`
  margin-bottom: 2px;
`;

const HomePage = () => {
  const [currentStep, setCurrentStep] = useState(STEP1);
  const stepCompletions = useSelector((state) => state?.velox?.strategyConfig);

  const onOpenedHandler = (name, opened) => {
    setCurrentStep(name);
  };

  return (
    <StepList>
      <StepItemWrapper>
        <StepSelectExchange
          completed={stepCompletions.completedStep1}
          name={STEP1}
          opened={currentStep === STEP1}
          ready={true}
          onOpen={onOpenedHandler}
        />
      </StepItemWrapper>
      <StepItemWrapper>
        <StepAllowances
          completed={stepCompletions.completedStep2}
          name={STEP2}
          opened={currentStep === STEP2}
          ready={stepCompletions.completedStep1}
          onOpen={onOpenedHandler}
        />
      </StepItemWrapper>
      <StepItemWrapper>
        <StepExchange
          completed={stepCompletions.completedStep3}
          name={STEP3}
          opened={currentStep === STEP3}
          ready={stepCompletions.completedStep2}
          onOpen={onOpenedHandler}
        />
      </StepItemWrapper>
      <StepItemWrapper>
        <StepReview
          completed={stepCompletions.completedStep4}
          name={STEP4}
          opened={currentStep === STEP4}
          ready={stepCompletions.completedStep3}
          onOpen={onOpenedHandler}
        />
      </StepItemWrapper>
    </StepList>
  );
};

export default withHeaderAndSigner(HomePage);
