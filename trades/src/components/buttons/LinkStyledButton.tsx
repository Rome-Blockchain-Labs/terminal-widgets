import tw, { styled } from 'twin.macro';

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  ${tw`border-none no-underline bg-none cursor-pointer text-yellow-400 font-medium`}

  ${({ disabled }) => disabled && tw`cursor-default text-gray-400`}

  :hover {
    ${({ disabled }) => !disabled && tw`underline`}
  }

  :focus {
    ${tw`outline-none`}
    ${({ disabled }) => !disabled && tw`underline`}
  }
`;
