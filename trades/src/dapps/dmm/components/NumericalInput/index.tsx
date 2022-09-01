import 'twin.macro';

import React from 'react';
import styled from 'styled-components';

import { escapeRegExp } from '../../utils';

const StyledInput = styled.input<{
  error?: boolean;
  fontSize?: string;
  align?: string;
}>`
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;

  font-size: ${({ fontSize }) => fontSize ?? '24px'};
  text-align: ${({ align }) => align && align};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;

  ${({ disabled, theme }) => disabled && 'cursor: not-allowed; opacity: 1;'}

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
  }
`;

const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$'); // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  onUserInput,
  placeholder,
  value,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean;
  fontSize?: string;
  align?: 'right' | 'left';
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <StyledInput
      {...rest}
      autoComplete="off"
      autoCorrect="off"
      // universal input options
      inputMode="decimal"
      maxLength={79}
      minLength={1}
      pattern="^[0-9]*[.,]?[0-9]*$"
      // text-specific options
      placeholder={placeholder || '0.0'}
      spellCheck="false"
      title="Token Amount"
      tw="bg-transparent text-xl"
      type="text"
      value={value}
      onChange={(event) => {
        // replace commas with periods, because dmmexchange exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
    />
  );
});

export default Input;

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
