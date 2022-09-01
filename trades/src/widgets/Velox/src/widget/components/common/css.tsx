import styled from 'styled-components';

import { withEnlargedProps } from '../../WidgetSizeStateContext';

const EnlargedStepHeading = styled.h2`
  text-align: left;
  font: normal normal bold 1.125rem/1.375rem Montserrat;
  letter-spacing: 0rem;
  color: #00d3cf;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
`;

const NormalStepHeading = styled.h2`
  text-align: left;
  font: normal normal bold 0.625rem Montserrat;
  letter-spacing: 0rem;
  color: #00d3cf;
  text-transform: uppercase;
  margin-bottom: 0.625rem;
`;

export const StepHeading = withEnlargedProps(
  NormalStepHeading,
  EnlargedStepHeading
);

export const HighlightOnHover = styled.span`
  cursor: pointer;

  &:hover {
    background-color: #255E6A;
    border-radius: 1.25rem;
`;

export const VerticalAlignCenter = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: left;
`;

export const NormalStepSection = styled.div`
  margin-bottom: 0.625rem;
  width: 100%;
`;

export const EnlargedStepSection = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

export const StepSection = withEnlargedProps(
  NormalStepSection,
  EnlargedStepSection
);

export const NormalStepText = styled.div`
  font-size: 0.625rem;
`;
export const EnlargedStepText = styled.div`
  font-size: 1rem;
`;
export const StepText = withEnlargedProps(NormalStepText, EnlargedStepText);
