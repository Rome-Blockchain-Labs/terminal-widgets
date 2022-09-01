import styled from 'styled-components';
import tw from 'twin.macro';

import { AutoColumn } from '../Column';
import { RowBetween, RowFixed } from '../Row';

export const ModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`;

export const FadedSpan = styled(RowFixed)`
  font-size: 14px;
`;

export const TextDot = styled.div`
  height: 3px;
  width: 3px;

  border-radius: 50%;
`;

export const Checkbox = styled.input`
  height: 20px;
  margin: 0;
`;

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`;

export const MenuItem = styled(RowBetween)`
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  outline: none;
  border-style: solid;

  -webkit-appearance: none;

  ${tw`text-xl border border-green-400 rounded-xl`}

  ::placeholder {
  }
  transition: border 100ms;
  :focus {
    outline: none;
  }
`;
export const Separator = styled.div`
  width: 100%;
  height: 1px;
`;

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
`;
