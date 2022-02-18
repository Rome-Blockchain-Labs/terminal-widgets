import tw, { styled } from 'twin.macro'

export const ToggleSwitch = styled.input`
  ${tw`appearance-none w-[64px] pl-8 m-0 rounded-17 before:content-['OFF']
    before:text-[#CDCDCD] checked:before:text-[#19A99D] checked:before:content-['ON'] cursor-pointer`}

  background: radial-gradient(
      circle 12px,
      gray 100%,
      transparent calc(100% + 1px)
    )
  #03283D -16px;
  transition: 0.3s ease-in-out;

  &::before {
    font: bold 12px/32px Verdana;
    text-shadow: 0 1px black;
  }

  &:checked {
    background-color: #03283d;
    padding-left: 8px;
    background-position: 16px;
  }
`
