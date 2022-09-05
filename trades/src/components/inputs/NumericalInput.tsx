import React from 'react';
import tw, { styled } from 'twin.macro';

import { escapeRegExp } from '../../utils';

const StyledInput = styled.input<{
  error?: boolean;
  fontSize?: string;
  align?: string;
}>`
  ${tw`w-0 relative flex-1 text-xl font-bold font-fira whitespace-nowrap bg-transparent overflow-hidden overflow-ellipsis p-0 placeholder-gray-300`}
  ${({ error }) => (error ? tw`text-red-500` : tw`text-white`)};
  text-align: ${({ align }) => align && align};
`;

const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$'); // match escaped "." characters via in a non-capturing group

export const NumericalInput = React.memo(function InnerInput({
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
      type="text"
      value={value}
      onChange={(event) => {
        // replace commas with periods, because uniswap exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
    />
  );
});

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
