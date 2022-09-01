import React from 'react';
import styled from 'styled-components';

import { TYPE } from '../../theme';

const Wrapper = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 20px;
  border: none;
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0.4rem 0.4rem;
  align-items: center;
`;

const ToggleElement = styled.span<{ isActive?: boolean; bgColor?: string }>`
  border-radius: 50%;
  height: 24px;
  width: 24px;

  :hover {
    opacity: 0.8;
  }
`;

const StatusText = styled(TYPE.main)<{ isActive?: boolean }>`
  margin: 0 10px;
  width: 24px;
`;

export interface ToggleProps {
  id?: string;
  isActive: boolean;
  bgColor: string;
  toggle: () => void;
}

export default function ListToggle({
  bgColor,
  id,
  isActive,
  toggle,
}: ToggleProps) {
  return (
    <Wrapper id={id} isActive={isActive} onClick={toggle}>
      {isActive && (
        <StatusText fontWeight="600" isActive={true} margin="0 6px">
          ON
        </StatusText>
      )}
      <ToggleElement bgColor={bgColor} isActive={isActive} />
      {!isActive && (
        <StatusText fontWeight="600" isActive={false} margin="0 6px">
          OFF
        </StatusText>
      )}
    </Wrapper>
  );
}
