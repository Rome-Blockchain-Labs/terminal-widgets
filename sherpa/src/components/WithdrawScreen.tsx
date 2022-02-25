import { InformationCircleIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import Select from './Select'
import { ToggleSwitch } from './ToggleSwitch'
import { useState } from 'react'
import sherpaClient from 'utils/sherpa'
import { LoadingSpinner } from './icons/LoadingSpinner'

const WithdrawScreen = () => {
  const [destinationAddress, setDestinationAddress] = useState('')
  const [uniqueKey, setUniqueKey] = useState('')
  const [selfRelay, setSelfRelay] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOnChange = (e) => {
    if (e.target.checked) {
      setSelfRelay(true)
    } else {
      setSelfRelay(false)
    }
  }

  const withdraw = async () => {
    setLoading(true)
    const [_, selectedToken, valueWei] = uniqueKey.split('-')
    await sherpaClient.fetchEvents(valueWei, selectedToken)
    const res = await sherpaClient.withdraw(
      uniqueKey,
      destinationAddress,
      selfRelay,
      sherpaClient.getRelayerList()[0] //todo move this into the button and control it
    )
    if (res) {
      setLoading(false)
    }
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
        tw="grid place-items-center mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white"
      >
        {loading ? <LoadingSpinner /> : 'Withdraw'}
      </button>
    </div>
  )
}

export default WithdrawScreen
