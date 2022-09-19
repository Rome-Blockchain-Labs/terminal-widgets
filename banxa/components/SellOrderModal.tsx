import {
  getAddChainParametersfromNetworkName,
  SUPPORTED_WALLETS,
  useWallets,
  useWeb3React,
} from '@romeblockchain/wallet'
import React, { useEffect, useState } from 'react'
import MetamaskLogo from './icons/MetamaskLogo'
import WalletConnectLogo from './icons/WalletConnectLogo'
import Loader from './Loader'
import { WalletBox } from './WalletModal'
import NETWORK_NAME_MAP from '../constants/NetworkNames'
import { Order } from 'pages/orders'
import * as ethers from 'ethers'
import abi from '../abi/erc20.json'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import SuccessModal from './SuccessModal'
import ErrorModal from './Error'
import TokenAddresses from 'constants/TokenAddress'
import { XIcon } from '@heroicons/react/solid'
const steps = [
  { id: 'step1', pos: 'Step 1', name: 'Select Wallet', status: 'current' },
  { id: 'step2', pos: 'Step 2', name: 'Transfer Tokens', status: 'upcoming' },
]

interface StepProps {
  id: string
  name: string
  status: string
  setStep: (val: Record<string, string>) => void
}

const Step = ({ id, name, status, setStep }: StepProps) => {
  const { setSelectedWallet } = useWallets()
  const { account } = useWeb3React()
  useEffect(() => {
    if (!account) {
      setStep({
        step1: 'current',
        step2: 'upcoming',
      })
    }
  }, [account, setStep])

  return (
    <li
      className="flex-1 cursor-pointer "
      onClick={() => {
        if (id === 'Step 1') {
          setSelectedWallet(undefined)
        }
      }}
    >
      {status === 'complete' ? (
        <div className="group flex flex-col  border-indigo-600 py-2  hover:border-indigo-800  border-t-4  pt-4 ">
          <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">{id}</span>
          <span className="text-sm font-medium">{name}</span>
        </div>
      ) : status === 'current' ? (
        <div
          className="flex flex-col  border-indigo-600 py-2  border-l-0 border-t-4 pl-0 pt-4 pb-0"
          aria-current="step"
        >
          <span className=" text-sm font-bold text-indigo-600">{id}</span>
          <span className="text-sm font-bold">{name}</span>
        </div>
      ) : (
        <div className="group flex flex-col border-gray-200 py-2  hover:border-gray-300  border-t-4  pt-4 ">
          <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{id}</span>
          <span className="text-sm font-medium">{name}</span>
        </div>
      )}
    </li>
  )
}

const SellOrderModal = ({
  order,
  setModalVisibility,
}: {
  order: Order
  setModalVisibility: (val: boolean) => void
}) => {
  const { blockchain } = order

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Record<string, string>>({
    step1: 'current',
    step2: 'upcoming',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string>()

  const closeErrorModal = () => {
    setError(undefined)
  }
  if (loading) {
    return <Loader />
  }
  return (
    <>
      {success && <SuccessModal />}

      {error && <ErrorModal message={error} closeModal={closeErrorModal} />}
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 grid place-items-center ">
        <div className="wg:rounded-lg w-full  wg:w-4/5 bg-white h-full wg:h-4/5  py-2 px-4 relative flex flex-col max-w-4xl overflow-auto">
          <XIcon
            className="ml-auto text-black mb-4 mt-2 h-6 w-6 cursor-pointer"
            onClick={() => setModalVisibility(false)}
          />
          <nav aria-label="Progress" className="w-full">
            <ol role="list" className="flex space-y-0 space-x-8 ">
              {steps.map((s) => {
                const status = step[s.id]
                return <Step setStep={setStep} key={s.id} id={s.pos} name={s.name} status={status} />
              })}
            </ol>
          </nav>
          <div className="rounded-lg bg-gray-800 flex flex-col h-full overflow-auto">
            {step.step1 === 'current' ? (
              <WalletStep networkCode={blockchain.code} setLoading={setLoading} setStep={setStep} />
            ) : (
              <PaymentStep order={order} setSuccess={setSuccess} setError={setError} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SellOrderModal

interface WalletStepProps {
  setLoading: (val: boolean) => void
  setStep: (val: any) => void
  networkCode: string
}

const WalletStep = ({ setLoading, setStep, networkCode }: WalletStepProps) => {
  const networkName = NETWORK_NAME_MAP[networkCode]
  const { handleConnect, selectedWallet, setSelectedWallet } = useWallets()
  // const chainParams = getAddChainParametersfromNetworkName(networkName)
  const chainParams = getAddChainParametersfromNetworkName('rinkeby')

  return (
    <>
      <div className="text-white text-center m-6 wg:text-lg">
        Select which wallet you will use to transfer tokens from
      </div>
      <div className="flex-col wg:flex-row rounded-lg h-full mx-3 p-6   md:mx-0  flex flex-wrap justify-center items-center  bg-gray-800">
        {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
          const wallet = SUPPORTED_WALLETS[key]
          const isActive = selectedWallet === wallet.wallet

          return (
            <WalletBox
              key={index}
              connectHandler={async () => {
                setLoading(true)
                try {
                  await handleConnect(wallet.connector, setSelectedWallet, wallet.wallet, null, chainParams)
                  setStep({
                    step1: 'complete',
                    step2: 'current',
                  })
                } catch (error) {
                  console.log(error)
                }
                setLoading(false)
              }}
              isActive={isActive}
              walletName={wallet.wallet}
            >
              {wallet.wallet === 'METAMASK' ? <MetamaskLogo size={30} /> : <WalletConnectLogo size={30} />}
            </WalletBox>
          )
        })}
      </div>
    </>
  )
}

const PaymentStep = ({
  order,
  setSuccess,
  setError,
}: {
  order: Order
  setSuccess: (val: boolean) => void
  setError: (val: string) => void
}) => {
  const { blockchain, coin_amount, coin_code, fiat_amount, fiat_code, wallet_address, id } = order
  const { provider, account } = useWeb3React()
  const [contract, setContract] = useState<ethers.ethers.Contract>()
  const [decimals, setDecimals] = useState(0)
  const [hash, setHash] = useState<string>()
  const [loading, setLoading] = useState(false)
  const {
    mutate: confirmOrder,
    data: confirmOrderData,
    error: confirmOrderError,
    isLoading: confirmOrderLoading,
  } = useMutation((data: any) => {
    return axios.post('/api/banxa/confirm-order', {
      params: {
        ...data,
      },
    })
  })
  const networkName = NETWORK_NAME_MAP[blockchain.code]
  const token = TokenAddresses[networkName].find((t) => t.token === coin_code)
  console.log(token?.address)
  useEffect(() => {
    if (account && provider && token) {
      const signer = provider.getSigner(account)
      const contract = new ethers.Contract('0x386558a69c0fEf2fF5A572e9151dE64123Ef04C3', abi, signer)

      // const contract = new ethers.Contract(token.address, abi, signer)

      setContract(contract)
      contract.decimals().then((res: number) => setDecimals(res))
    }
  }, [account, provider, token])

  useEffect(() => {
    if (hash) {
      confirmOrder({
        tx_hash: hash,
        source_address: account,
        // destination_address: wallet_address,
        destination_address: '0xe7639fE2062c398b1E85a69d1BdA9129035008Ed',
        order_id: id,
      })
    }
  }, [account, confirmOrder, hash, id, wallet_address])

  useEffect(() => {
    if (confirmOrderData) {
      setLoading(false)
      setSuccess(true)
    }
  }, [confirmOrderData, setLoading, setSuccess])
  useEffect(() => {
    if (confirmOrderError) {
      setError(
        'Unable to confirm sell order. Please confirm that you have completed the transaction in your wallet before trying again'
      )
    }
  }, [confirmOrderError, setError])

  useEffect(() => {
    if (confirmOrderLoading) {
      setLoading(true)
    }
  }, [confirmOrderLoading, setLoading])
  if (loading || confirmOrderLoading) {
    return (
      <div className=" bg-white shadow h-full sm:rounded-lg  flex items-center justify-center space-x-2 ">
        <svg
          aria-hidden="true"
          className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    )
  }
  return (
    <div className=" bg-white shadow h-full sm:rounded-lg  flex flex-col overflow-auto">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Token Transfer Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Token and Fiat details.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Blockchain</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{blockchain.description}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Token to Transfer</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{coin_code}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Amount to Transfer</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{coin_amount}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Fiat to Receive</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{fiat_code}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Fiat to Receive</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{fiat_amount}</dd>
          </div>
        </dl>
      </div>
      <button
        type="button"
        className="my-4 mx-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={async () => {
          if (contract) {
            setLoading(true)
            const transferAmount = '0x' + (1 * Math.pow(10, decimals)).toString(16)
            // const transferAmount = '0x' + (coin_amount* Math.pow(10, decimals)).toString(16)
            try {
              const transaction = await contract.transfer('0xe7639fE2062c398b1E85a69d1BdA9129035008Ed', transferAmount)

              const receipt = await transaction.wait()
              if (receipt.status === 1) {
                setHash(receipt.transactionHash)
              } else {
                setError('Transaction failed. Please check your wallet for errors and try again.')
              }
            } catch (error: any) {
              setError('Transaction failed. Please try again.')
            }
          }
        }}
      >
        Send Tokens
      </button>
    </div>
  )
}
