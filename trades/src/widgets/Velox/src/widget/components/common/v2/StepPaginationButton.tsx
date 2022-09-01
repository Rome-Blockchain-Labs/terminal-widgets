import styled from 'styled-components';

export interface StepPaginationButtonProps {
  disabled?: boolean;
}

export const StepPaginationButton = styled.div<StepPaginationButtonProps>`
  display: inline-block;
  font: normal normal bold 1rem/1.188rem Montserrat;
  height: 2.813rem;
  line-height: 2.813rem;
  border-radius: 2.813rem;
  color: #00d3cf;
  border: 2px solid #0d8486;
  background: #08333c;

  ${(props: any) => {
    if (!props.disabled) {
      return;
    }

    return `
      background: #21474D;
      color: #0D8486;
    `;
  }}

  &:hover {
    ${(props: any) => {
      if (props.disabled) {
        return;
      }

      return `
        background: #00D3CF;
        color: #08333C;
        border-color: #00D3CF;
      `;
    }}
  }
`;
