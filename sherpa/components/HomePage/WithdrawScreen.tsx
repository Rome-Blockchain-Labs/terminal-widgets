import { InformationCircleIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import Toggle from './ToggleSwitch'
import { useState } from 'react'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import useSherpaContext from '../../hooks/useSherpaContext'
import DropDown from './DropDown'
import Modal from './Modal'

const getNameFromRelayer = (relayer: any) =>
  `${relayer?.['name']} - ${relayer?.['fee']}%`

const WithdrawScreen = () => {
  const { sherpaClient, sherpaRelayerOptions } = useSherpaContext()
  const client = sherpaClient as any
  const [destinationAddress, setDestinationAddress] = useState('')
  const [uniqueKey, setUniqueKey] = useState('')
  const [selfRelay, setSelfRelay] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<boolean>()

  const withdraw = async () => {
    if (!client) return
    if (!selfRelay && selectedOption === '') {
      setError('Select a relayer fee.')
      return
    }
    if (!destinationAddress) {
      setError('Set receipient address')
      return
    }
    if (!uniqueKey) {
      setError('Set a unique key')
      return
    }
    setIsWithdrawing(true)
    const [, selectedToken, valueWei] = uniqueKey.split('-')
    await client.fetchEvents(valueWei, selectedToken)
    try {
      const res = await client.withdraw(
        uniqueKey,
        destinationAddress,
        selfRelay,
        sherpaRelayerOptions.find((o) => selectedOption.includes(o?.['name']))
      )

      if (res) {
        setSuccess(true)
        setIsWithdrawing(false)
      }
    } catch (error) {
      console.log(error)
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
      {success && <Modal />}
      <div className="flex mt-2">
        <span className="font-medium text-[1.9vw] lg:text-lg ">
          Relayer Mode
        </span>
        <InformationCircleIcon className="w-2 h-2 mb-2" />
      </div>
      <Toggle enabled={!selfRelay} toggle={() => setSelfRelay((b) => !b)} />

      <div className="flex">
        <span className="font-medium text-[1.9vw] lg:text-lg">Relayer Fee</span>
        <InformationCircleIcon className="w-2 h-2 mb-2" />
      </div>
      <DropDown
        disabled={selfRelay}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        possibleOptions={sherpaRelayerOptions
          .filter((o) => o !== selectedOption)
          .map(getNameFromRelayer)}
      />
      <div>
        <div className="flex">
          <span className="font-medium text-[1.9vw]  lg:text-lg">
            Unique Key
          </span>
          <InformationCircleIcon className="w-2 h-2 mb-2" />
        </div>
        <input
          onChange={(e) => setUniqueKey(e.target.value)}
          className="px-2 rounded-sm text-[1.7vw] lg:text-lg p-[3%]  w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Unique Key Here"
          value={uniqueKey}
        />
      </div>

      <div className="mt-[6px]">
        <div className="flex">
          <span className="font-medium text-[1.9vw] lg:text-xl">
            Recipient Wallet Address
          </span>
          <InformationCircleIcon className="w-2 h-2 mb-2" />
        </div>
        <input
          onChange={(e) => setDestinationAddress(e.target.value)}
          className="px-2 rounded-sm text-[1.7vw] lg:text-xl p-[3%]  w-full bg-primary text-white placeholder:text-[#707070]"
          placeholder="Insert Address Here"
          value={destinationAddress}
        />
      </div>
      <button
        onClick={withdraw}
        className=" mt-10 sm:mt-auto grid place-items-center  rounded-full w-full p-[2%] text-primary text-[2.4vw] lg:text-2xl mb-[5%] bg-white min-h-[2.4vw]"
      >
        {isWithdrawing ? <LoadingSpinner /> : 'Withdraw'}
      </button>
    </div>
  )
}

export default WithdrawScreen
