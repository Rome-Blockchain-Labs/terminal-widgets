import styled from 'styled-components';

import {
  StepPaginationButton,
  StepPaginationButtonProps,
} from './StepPaginationButton';

const StepPaginationNumberButton = styled(StepPaginationButton)`
  width: 2.813rem;
  ${(props: any) => {
    if (props.active) {
      return `
          background: #00D3CF;
          color: #08333C;
          border-color: #00D3CF;
        `;
    }
  }}
`;

export interface StepPaginationNumberProps extends StepPaginationButtonProps {
  step?: string;
  active?: boolean;
}

function StepPaginationNumber(props: StepPaginationNumberProps) {
  const { step } = props;

  return (
    <StepPaginationNumberButton {...props}>{step}</StepPaginationNumberButton>
  );
}

export default StepPaginationNumber;
