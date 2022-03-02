import React from 'react'
import ReactSelect from 'react-select'
import tw, { styled } from 'twin.macro'

const DropDown = styled(ReactSelect)`
  ${tw`w-[120px] h-[26px]`}
  & .Select__value-container {
    ${tw`w-[120px] h-[26px]`}
  }

  & .Select__indicator Select__dropdown-indicator {
    border-color: transparent transparent red;
  }
  & .Select__control {
    ${tw`w-[120px] h-[26px]`}
  }
`

export default DropDown
