import React from 'react'
import tw, { styled } from 'twin.macro'

const Count = styled.div`
  ${tw`rounded-sm px-2 py-[2px]  bg-primary font-bold text-white text-[7px]`}
`

const DepositStat = () => {
  return (
    <div tw="flex">
      <Count>3685</Count>
      <div tw="ml-[6px] text-primary text-[7px]"> 5 hours ago</div>
    </div>
  )
}

export default DepositStat
