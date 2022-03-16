import { InformationCircleIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import Toggle from './ToggleSwitch'
import { useState } from 'react'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import useSherpaContext from '../../hooks/useSherpaContext'
import DropDown from './DropDown'
import Modal from './Modal'
import Tooltip from 'rc-tooltip'
import { useForm } from 'react-hook-form'
import { setTimeout } from 'timers'
import Router, { useRouter } from 'next/router'

const getNameFromRelayer = (relayer: any) =>
  `${relayer?.['name']} - ${relayer?.['fee']}%`

const WithdrawScreen = ({ setTransaction }: any) => {
  const { sherpaClient, sherpaRelayerOptions } = useSherpaContext()
  const client = sherpaClient as any
  const [selfRelay, setSelfRelay] = useState(true)
  const [selectedOption, setSelectedOption] = useState('')
  const [relayError, setRelayError] = useState<boolean>()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const onSubmit = async (data: any) => {
    await withdraw(data.uniqueKey, data.destinationAddress)
  }

  const [success, setSuccess] = useState<boolean>()
  const [error, setError] = useState<string>()

  const withdraw = async (uniqueKey: string, destinationAddress: string) => {
    if (!client) return
    if (!selfRelay && selectedOption === '') {
      setRelayError(true)
      return
    }

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
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const refreshSherpaClient = async () => {
      if (!client) return
      await client.fetchCircuitAndProvingKey() //must be done but can be done eagerly
    }
    refreshSherpaClient()
  }, [client])

  useEffect(() => {
    if ((!selfRelay && selectedOption) || selfRelay) {
      setRelayError(false)
    }
  }, [selectedOption, selfRelay])

  useEffect(() => {
    console.log(success)
    if (success) {
      console.log('wait')
      setTimeout(() => setTransaction('deposit'), 1000)
    }
  }, [setTransaction, success])

  return (
    <div className="flex flex-col flex-grow">
      {success && (
        <Modal
          type="success"
          message="Withdraw successful. Please wait 5 - 10 minutes to receive your withdrawal. Redirecting you back to the homepage"
        />
      )}
      {error && <Modal type="error" message={error} />}

      <div className="flex mt-2">
        <span className="font-medium text-[1.9vw] lg:text-lg ">
          Relayer Mode
        </span>
        <Tooltip
          placement="bottom"
          trigger={['hover']}
          overlay={
            <div className="w-[200px] text-[1.3vw] lg:text-sm">
              Using a relayer will allow you to withdraw to a fresh wallet.
              NOTE: relayer mode is currently disable for ERC20 withdrawals.
            </div>
          }
        >
          <InformationCircleIcon className="h-[1.4vw] w-[1.4vw] lg:w-4 lg:h-4 mb-2" />
        </Tooltip>
      </div>
      <Toggle enabled={!selfRelay} toggle={() => setSelfRelay((b) => !b)} />

      <div className="flex mt-2">
        <span className="font-medium text-[1.9vw] lg:text-lg">Relayer Fee</span>
        <Tooltip
          placement="bottom"
          trigger={['hover']}
          overlay={
            <div className="w-[200px] text-[1.3vw] lg:text-sm">
              Using a relayer incurs free paid to the operator.
            </div>
          }
        >
          <InformationCircleIcon className="h-[1.4vw] w-[1.4vw] lg:w-4 lg:h-4 mb-2" />
        </Tooltip>
      </div>

      <div className="mt-2">
        <DropDown
          disabled={selfRelay}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          possibleOptions={sherpaRelayerOptions
            .filter((o) => o !== selectedOption)
            .map(getNameFromRelayer)}
        />
        {relayError && (
          <p className="mt-2 text-[1.4vw] lg:text-sm text-red-600">
            Select a relayer fee.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2">
          <div className="flex">
            <span className="font-medium text-[1.9vw]  lg:text-lg">
              Unique Key
            </span>
            <Tooltip
              placement="bottom"
              trigger={['hover']}
              overlay={
                <div className="w-[200px] text-[1.3vw] lg:text-sm">
                  Unique key extracted at deposit to enable withdrawal.
                </div>
              }
            >
              <InformationCircleIcon className="h-[1.4vw] w-[1.4vw] lg:w-4 lg:h-4 mb-2" />
            </Tooltip>
          </div>
          <div>
            <input
              type="text"
              className="px-2 rounded-sm text-[1.7vw] lg:text-lg p-[3%]  w-full bg-primary text-white placeholder:text-[#707070]"
              placeholder="Insert Unique Key Here"
              {...register('uniqueKey', { required: 'Uniquey key required' })}
            />

            {errors.uniqueKey && (
              <p className="mt-2 text-[1.4vw] lg:text-sm text-red-600">
                {errors.uniqueKey.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 mb-10">
          <div className="flex">
            <span className="font-medium text-[1.9vw] lg:text-lg">
              Recipient Wallet Address
            </span>
            <Tooltip
              placement="bottom"
              trigger={['hover']}
              overlay={
                <div className="w-[200px] text-[1.3vw] lg:text-sm">
                  The wallet you want the amount withdrawn to. Can be an address
                  you are not connected to when using a relayer.
                </div>
              }
            >
              <InformationCircleIcon className="h-[1.4vw] w-[1.4vw] lg:w-4 lg:h-4 mb-2" />
            </Tooltip>
          </div>
          <div>
            <input
              type="text"
              className="px-2 rounded-sm text-[1.7vw] lg:text-xl p-[3%]  w-full bg-primary text-white placeholder:text-[#707070]"
              placeholder="Insert Address Here"
              {...register('destinationAddress', {
                required: 'Destination address required',
              })}
            />
            {errors.destinationAddress && (
              <p className="mt-2 text-[1.4vw] lg:text-sm text-red-600">
                {errors.destinationAddress.message}
              </p>
            )}
          </div>
        </div>

        <button className="mt-10 sm:mt-auto grid place-items-center  rounded-full w-full p-[2%] text-primary text-[2.4vw] lg:text-2xl mb-[5%] bg-white min-h-[2.4vw]">
          {isSubmitting ? <LoadingSpinner /> : 'Withdraw'}
        </button>
      </form>
    </div>
  )
}

export default WithdrawScreen
