import styled from 'styled-components';

import {
  EnlargeableProps,
  withEnlargedProps,
} from '../../../WidgetSizeStateContext';

const StepWrapper = styled.div`
  width: 100%;
  background: rgba(13, 109, 111, 0.8);
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const NormalStepContent = styled.div<EnlargeableProps>`
  display: flex;
  align-content: stretch;

  width: 100%;
  padding: 1.5rem;
  margin: 0 auto;
  max-width: ${(props) => (props.enlarged ? '80rem' : '30rem')};
  min-height: 100%;
`;
const StepContent = withEnlargedProps(NormalStepContent);

const StepContentBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

function StepperWideItem(props: any) {
  return (
    <>
      <StepWrapper>
        <StepContent>
          <StepContentBody>
            <div style={{ width: '100%' }}>{props.children}</div>
          </StepContentBody>
        </StepContent>
      </StepWrapper>
    </>
  );
}

export default StepperWideItem;
