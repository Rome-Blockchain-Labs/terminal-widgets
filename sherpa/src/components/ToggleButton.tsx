import tw, { styled } from 'twin.macro'

// A button that triggers some onClick result, but looks like a link.
export const ToggleButton = styled.button<{ disabled?: boolean }>`
  ${tw`m-[2px] py-2 flex-grow text-white font-bold cursor-pointer text-[11px] rounded-[50px] bg-[#19A99D]`}

  ${({ disabled }) => disabled && tw`text-[#03283D] bg-white `}
`
