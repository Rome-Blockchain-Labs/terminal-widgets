import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { STEP1, STEP2, STEP3, STEP4 } from '../../constants';
import { closeList, openList } from '../../redux/strategy/strategySlice';
import { setCurrentStep } from '../../redux/strategyConfig/strategyConfigSlice';
import withHeaderAndSigner from '../containers/ethereum/with-provider';
import ConfirmDeploymentErrorModal from '../containers/exchange/ConfirmDeploymentErrorModal';
import ConfirmDeploymentSuccessModal from '../containers/exchange/ConfirmDeploymentSuccessModal';
import ExchangeReviewModal from '../containers/exchange/ExchangeReviewModal';
import StrategyList from '../containers/strategies';
import {
  useWidgetSizeState,
  withEnlargedProps,
} from '../WidgetSizeStateContext';
import StepListItem from './common/v2/ListItem';
import StepSelectExchange from './Step1SelectExchange';
import StepAllowances from './Step2Allowances';
import StepExchange from './Step3Exchange';
import StepReview from './Step4Review';

const StepConfigLayout = styled.div`
  display: flex;
  align-items: stretch;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  height: 100%;
`;

const StretchLayout = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.313rem;
  justify-content: space-between;
`;

const NormalStepList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 2.063rem;
  row-gap: 0.313rem;
  height: 18.75rem;
`;
const EnlargedStepList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 2.063rem;
  row-gap: 0.313rem;
  height: 22.5rem;
`;
const StepList = withEnlargedProps(NormalStepList, EnlargedStepList);

const StepListItemWrapper = styled.div`
  display: flex;
  flex: 1 100%;
  align-items: stretch;
`;

const StepBody = styled.div`
  align-items: stretch;
  width: 100%;
`;

// enum Tabs {
//   OPEN_LIST = 'openList',
//   CLOSE_LIST = 'closeList',
//   TOGGLE_LIST = 'toggleList',
//   STEP1 = 'step1',
//   STEP2 = 'step2',
//   STEP3 = 'step3',
//   STEP4 = 'step4',
// }

const HomePage = () => {
  const stepCompletions = useSelector(
    (state: any) => state?.velox?.strategyConfig
  );
  const currentStep = stepCompletions.currentStep;
  const widgetSize = useWidgetSizeState();
  const dispatch = useDispatch();

  const {
    confirmDeploymentErrorModalOpen,
    confirmDeploymentSuccessModalOpen,
    isListOpened,
    reviewModalOpen,
  } = useSelector((state: any) => state?.velox?.strategy);

  const onOpenedHandler = (name: any, opened: any) => {
    dispatch(setCurrentStep(name));
    dispatch(closeList());
  };

  const openStrategyList = () => {
    dispatch(openList());
  };

  useEffect(() => {
    if (isListOpened) {
      dispatch(setCurrentStep(''));
    } else {
      dispatch(setCurrentStep(currentStep || STEP1));
    }
  }, [isListOpened, currentStep, dispatch]);

  useEffect(() => {
    widgetBridge.init();
    widgetBridge.subscribe(
      RomeEventType.TERMINAL_CLICK_BUTTON,
      (action: any) => {}
    );
  }, []);

  if (reviewModalOpen) return <ExchangeReviewModal />;
  if (confirmDeploymentErrorModalOpen) return <ConfirmDeploymentErrorModal />;
  if (confirmDeploymentSuccessModalOpen)
    return <ConfirmDeploymentSuccessModal />;

  return (
    <>
      <StepConfigLayout>
        <StretchLayout>
          <StepList>
            <StepListItemWrapper>
              <StepListItem
                name={STEP1}
                opened={currentStep === STEP1}
                ready={true}
                text="STEP&nbsp;1"
                onOpen={onOpenedHandler}
              ></StepListItem>
            </StepListItemWrapper>
            <StepListItemWrapper>
              <StepListItem
                name={STEP2}
                opened={currentStep === STEP2}
                ready={stepCompletions.readyStep2}
                text="STEP&nbsp;2"
                onOpen={onOpenedHandler}
              ></StepListItem>
            </StepListItemWrapper>
            <StepListItemWrapper>
              <StepListItem
                name={STEP3}
                opened={currentStep === STEP3}
                ready={stepCompletions.readyStep3}
                text="STEP&nbsp;3"
                onOpen={onOpenedHandler}
              ></StepListItem>
            </StepListItemWrapper>
            <StepListItemWrapper>
              <StepListItem
                name={STEP4}
                opened={currentStep === STEP4}
                ready={stepCompletions.readyStep4}
                text="STEP&nbsp;4"
                onOpen={onOpenedHandler}
              ></StepListItem>
            </StepListItemWrapper>
          </StepList>
          {widgetSize.enlarged && (
            <StepList style={{ maxHeight: '10rem' }}>
              <StepListItemWrapper>
                <StepListItem
                  name={'STRATEGIES'}
                  opened={isListOpened}
                  ready={true}
                  text="#&nbsp;STRATEGIES"
                  onOpen={openStrategyList}
                ></StepListItem>
              </StepListItemWrapper>
            </StepList>
          )}
        </StretchLayout>
        <StepBody>
          {isListOpened && <StrategyList></StrategyList>}

          {!isListOpened && (
            <>
              {currentStep === STEP1 && (
                <StepSelectExchange
                  completed={stepCompletions.completedStep1}
                  name={STEP1}
                  opened={currentStep === STEP1}
                  ready={true}
                  onOpen={onOpenedHandler}
                />
              )}

              {currentStep === STEP2 && (
                <StepAllowances
                  completed={stepCompletions.completedStep2}
                  name={STEP2}
                  opened={currentStep === STEP2}
                  ready={stepCompletions.completedStep1}
                  onOpen={onOpenedHandler}
                />
              )}

              {currentStep === STEP3 && (
                <StepExchange
                  completed={stepCompletions.completedStep3}
                  name={STEP3}
                  opened={currentStep === STEP3}
                  ready={stepCompletions.completedStep2}
                  onOpen={onOpenedHandler}
                />
              )}

              {currentStep === STEP4 && (
                <StepReview
                  completed={stepCompletions.completedStep4}
                  name={STEP4}
                  opened={currentStep === STEP4}
                  ready={stepCompletions.completedStep3}
                  onOpen={onOpenedHandler}
                />
              )}
            </>
          )}
        </StepBody>
      </StepConfigLayout>
    </>
  );
};

export default withHeaderAndSigner(HomePage);
