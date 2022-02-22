import { InformationCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import Select from './Select'
import { ToggleSwitch } from './ToggleSwitch'

const WithdrawScreen = () => {
  return (
    <div tw="flex flex-col flex-grow">
      <div tw="flex w-full mt-2">
        <div>
          <div tw="flex">
            <span tw="font-medium text-[9px]">Relayer Mode</span>
            <InformationCircleIcon tw="mb-2 h-2 w-2" />
          </div>
          <ToggleSwitch />
        </div>

        <div tw="ml-2">
          <div tw="flex">
            <span tw="font-medium text-[9px]">Relayer Fee</span>
            <InformationCircleIcon tw="mb-2 h-2 w-2" />
          </div>
          <Select />
        </div>
      </div>

      <div>
        <div tw="flex">
          <span tw="font-medium text-[9px]">Unique Key</span>
          <InformationCircleIcon tw="mb-2 h-2 w-2" />
        </div>
        <input
          tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Unique Key Here"
        />
      </div>

      <div tw="mt-[6px]">
        <div tw="flex">
          <span tw="font-medium text-[9px]">Recipient Wallet Address</span>
          <InformationCircleIcon tw="mb-2 h-2 w-2" />
        </div>
        <input
          tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Address Here"
        />
      </div>

      <button tw="mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white">
        Withdraw
      </button>
    </div>
  )
}

export default WithdrawScreen
