import { InformationCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import tw, { styled } from 'twin.macro'

const Token = styled.div`
  ${tw`mt-1 flex items-center rounded-sm w-full h-[26px] bg-primary text-secondary font-bold text-[9px] pl-2 `}
`
const Amount = styled.button`
  ${tw`h-12 w-12 bg-primary text-secondary rounded-full flex flex-col items-center justify-center`}
`

const DepositScreen = () => {
  return (
    <div tw="mt-2 flex flex-col flex-grow">
      <div tw="text-primary text-[9px] font-medium ">Token</div>
      <Token>AVAX</Token>
      <div tw="flex mt-2">
        <span tw="font-medium text-[9px]">Amount</span>
        <InformationCircleIcon tw="mb-2 h-2 w-2" />
      </div>
      <div tw="flex justify-between">
        <Amount>
          <span>10</span>
          <span tw="text-white text-[8px] -mt-1">AVAX</span>
        </Amount>
        <Amount>
          <span>100</span>
          <span tw="text-white text-[8px] -mt-1">AVAX</span>
        </Amount>
        <Amount>
          <span>500</span>
          <span tw="text-white text-[8px] -mt-1">AVAX</span>
        </Amount>
      </div>

      <button tw="mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white">
        Deposit
      </button>
    </div>
  )
}

export default DepositScreen
