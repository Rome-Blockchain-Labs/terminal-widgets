import { InformationCircleIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import Select from './Select'
import Toggle from './ToggleSwitch'
import { useState } from 'react'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import useSherpaContext from '../../hooks/useSherpaContext'

const getNameFromRelayer = (relayer:any) => `${relayer?.["name"]} - ${relayer?.["fee"]}%`

const WithdrawScreen = () => {
  const { sherpaClient, sherpaRelayerOptions } = useSherpaContext()
  const client = sherpaClient as any
  const [destinationAddress, setDestinationAddress] = useState('')
  const [uniqueKey, setUniqueKey] = useState('')
  const [selfRelay, setSelfRelay] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")

  const withdraw = async () => {
    if (!client) return
    setIsWithdrawing(true)
    const [, selectedToken, valueWei] = uniqueKey.split('-')
    await client.fetchEvents(valueWei, selectedToken)
    const res = await client.withdraw(
      uniqueKey,
      destinationAddress,
      selfRelay,
      sherpaRelayerOptions.find(o=>selectedOption.includes(o?.["name"]))
    )
    if (res) {
      setIsWithdrawing(false)
    }
  }
  useEffect(() => {
    const refreshSherpaClient = async () => {
      if (!client) return
      await client.fetchCircuitAndProvingKey() //must be done but can be done eagerly
    }
    refreshSherpaClient()
  }, [client])

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex w-full mt-2">
        <div>
          <div className="flex">
            <span className="font-medium text-[9px]">Relayer Mode</span>
            <InformationCircleIcon className="w-2 h-2 mb-2" />
          </div>
          <Toggle enabled={!selfRelay} toggle={()=>setSelfRelay(b=>!b)} />
        </div>

        <div className="ml-2">
          <div className="flex">
            <span className="font-medium text-[9px]">Relayer Fee</span>
            <InformationCircleIcon className="w-2 h-2 mb-2" />
          </div>
          <Select
            possibleOptions={sherpaRelayerOptions.filter(o=>o!==selectedOption).map(getNameFromRelayer)}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption} />
        </div>
      </div>

      <div>
        <div className="flex">
          <span className="font-medium text-[9px]">Unique Key</span>
          <InformationCircleIcon className="w-2 h-2 mb-2" />
        </div>
        <input
          onChange={(e) => setUniqueKey(e.target.value)}
          className="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Unique Key Here"
          value={uniqueKey}
        />
      </div>

      <div className="mt-[6px]">
        <div className="flex">
          <span className="font-medium text-[9px]">
            Recipient Wallet Address
          </span>
          <InformationCircleIcon className="w-2 h-2 mb-2" />
        </div>
        <input
          onChange={(e) => setDestinationAddress(e.target.value)}
          className="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Address Here"
          value={destinationAddress}
        />
      </div>

      <button
        onClick={withdraw}
        className="grid place-items-center mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white"
      >
        {isWithdrawing ? <LoadingSpinner /> : 'Withdraw'}
      </button>
    </div>
  )
}

export default WithdrawScreen
