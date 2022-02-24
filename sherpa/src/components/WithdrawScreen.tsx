import { InformationCircleIcon } from '@heroicons/react/outline'
import React, { useEffect } from 'react'
import Select from './Select'
import { ToggleSwitch } from './ToggleSwitch'
import * as sherpa from 'sherpa'
import { useState } from 'react'
import web3 from '../web3'
import sherpaClient from 'utils/sherpa'

interface WithdrawScreenProps {
  selectedContract: any
}
const WithdrawScreen = ({ selectedContract }: WithdrawScreenProps) => {
  const [destinationAddress, setDestinationAddress] = useState('0xB1Eb136EfAB647b2c99e9C08aC21F2BD7d79794E')
  const [uniqueKey, setUniqueKey] = useState('sherpa-avax-10000000000000000000-43113-0x1dacb1e8b89a4d857153cb35831751b7b91caa950355a2128b7ae67d025e792d0a0dcfe92e9ea1ddfb59fa8004e4538ea2275100fb351923657a5dc70d23')
  const [selfRelay, setSelfRelay] = useState(false)

  const handleOnChange = (e) => {
    if (e.target.checked) {
      setSelfRelay(true)
    } else {
      setSelfRelay(false)
    }
  }

  const withdraw = async () => {
    const [_, selectedToken, valueWei] = uniqueKey.split('-')
    await sherpaClient.fetchCircuitAndProvingKey()
    const events = await sherpaClient.fetchEvents(valueWei, selectedToken)
    const a = await sherpaClient.withdraw(
      uniqueKey,
      destinationAddress,
      selfRelay,
      sherpaClient.getRelayerList()[0]//todo move this into the button and control it
    )
    const b = JSON.stringify(a)
    alert(b)
  }
  useEffect(() => {
    const refreshSherpaClient = async () => {
      await sherpaClient.fetchCircuitAndProvingKey() //must be done but can be done eagerly
    }
    refreshSherpaClient()
  }, [])

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
          onChange={(e) => setUniqueKey(e.target.value)}
          tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Unique Key Here"
          value={uniqueKey}
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
          value={destinationAddress}
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
