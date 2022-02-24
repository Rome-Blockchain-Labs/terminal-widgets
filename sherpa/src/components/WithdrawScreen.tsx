import { InformationCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import Select from './Select'
import { ToggleSwitch } from './ToggleSwitch'
import * as sherpa from 'sherpa'
import { useState } from 'react'
import web3 from '../web3'

interface WithdrawScreenProps {
  selectedContract: any
}
const WithdrawScreen = ({ selectedContract }: WithdrawScreenProps) => {
  const [destinationAddress, setDestinationAddress] = useState('')
  const [commitment, setCommitment] = useState('')
  const [selfRelay, setSelfRelay] = useState(false)

  const handleOnChange = (e) => {
    if (e.target.checked) {
      setSelfRelay(true)
    } else {
      setSelfRelay(false)
    }
  }

  const withdraw = async () => {
    const state = sherpa.state()
    console.log(state)
    const netId = 43113
    const events = await sherpa.getters.getEvents(
      state,
      selectedContract.address,
      netId
    )
    function sortEventsByLeafIndex(a, b) {
      return a.leafIndex < b.leafIndex ? 1 : -1
    }
    const depositEvents = events.events
      .filter((e) => e.type === 'Deposit')
      .sort(sortEventsByLeafIndex)

    const circuit = await (await fetch('/withdraw.json')).json()
    const provingKey = await (
      await fetch('/withdraw_proving_key.bin')
    ).arrayBuffer()

    await sherpa.withdraw(
      commitment,
      destinationAddress,
      selfRelay,
      netId,
      web3,
      { depositEvents },
      circuit,
      provingKey
    )
  }
  return (
    <div tw="flex flex-col flex-grow">
      <div tw="flex w-full mt-2">
        <div>
          <div tw="flex">
            <span tw="font-medium text-[9px]">Relayer Mode</span>
            <InformationCircleIcon tw="mb-2 h-2 w-2" />
          </div>
          <ToggleSwitch onChange={handleOnChange} />
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
          onChange={(e) => setCommitment(e.target.value)}
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
          onChange={(e) => setDestinationAddress(e.target.value)}
          tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Address Here"
        />
      </div>

      <button
        onClick={withdraw}
        tw="mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white"
      >
        Withdraw
      </button>
    </div>
  )
}

export default WithdrawScreen
