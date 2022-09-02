import { darken } from 'polished';
import React from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components';
import styled from 'styled-components';
import tw from 'twin.macro';

import { RowBetween } from '../Row';

const Base = styled(RebassButton)<{
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : 'auto')};
  margin: ${({ margin }) => (margin ? margin : 'unset')};
  font-weight: 500;
  text-align: center;
  border-radius: 5.5px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`;

export const ButtonPrimary = styled(Base)`
  ${tw`bg-green-400 text-black font-bold text-xl`}

  &:hover {
    ${tw`bg-dark-400 text-green-400`}
  }
  &:active {
  }
  &:disabled {
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
    ${tw`bg-gray-500 text-gray-400`}
  }
`;

export const ButtonLight = styled(Base)`
  font-weight: 500;
  ${tw`bg-gray-500 text-gray-300 text-xl hover:text-green-400`}
  &:focus {
  }
  &:hover {
  }
  &:active {
  }
  :disabled {
    opacity: 0.6;
    :hover {
      cursor: not-allowed;

      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const ButtonGray = styled(Base)`
  font-size: 16px;
  font-weight: 500;
`;

export const ButtonSecondary = styled(Base)`
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
  }
  &:hover {
  }
  &:active {
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const ButtonPink = styled(Base)`
  color: white;

  &:focus {
  }
  &:hover {
  }
  &:active {
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonUNIGradient = styled(ButtonPrimary)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;

  background: radial-gradient(
      174.47% 188.91% at 1.84% 0%,
      #ff007a 0%,
      #2172e5 100%
    ),
    #edeef2;
  width: fit-content;
  position: relative;
  cursor: pointer;
  border: none;
  white-space: no-wrap;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`;

export const ButtonOutlined = styled(Base)`
  ${tw`bg-dark-400`}

  border-radius: 5.5px;
  font-size: 12px;

  &:focus {
  }
  &:hover {
  }
  &:active {
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  ${tw`text-green-400`}

  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    opacity: 50%;
    cursor: not-allowed;
  }
`;

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;

  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonConfirmedStyle = styled(Base)`
  &:disabled {
    cursor: auto;
  }
`;

const ButtonErrorStyle = styled(Base)`
  &:hover {
  }
  &:focus {
  }
  &:active {
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    ${tw`bg-gray-500`}
  }
`;

export function ButtonConfirmed({
  altDisabledStyle,
  confirmed,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />;
  }
}

export function ButtonError({
  error,
  ...rest
}: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}

export const StyledButtonDropdown = styled(Base)`
  border-radius: 4px;
  border: none;
  font-size: 12px;

  &:focus {
  }
  &:hover {
  }
  &:active {
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export function ButtonDropdown({
  children,
  disabled = false,
  expanded = true,
  ...rest
}: { expanded: boolean; disabled?: boolean } & ButtonProps) {
  return (
    <StyledButtonDropdown {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ alignItems: 'center', display: 'flex' }}>{children}</div>
        {expanded ? (
          <ChevronUp size="18" />
        ) : (
          <ChevronDown color="white" size="18" />
        )}
      </RowBetween>
    </StyledButtonDropdown>
  );
}

export function ButtonDropdownLight({
  children,
  disabled = false,
  ...rest
}: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ alignItems: 'center', display: 'flex' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  );
}

export function ButtonRadio({
  active,
  ...rest
}: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}
