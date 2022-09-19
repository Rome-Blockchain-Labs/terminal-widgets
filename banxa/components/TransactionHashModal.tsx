import React, { useState } from 'react'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { classNames } from 'utils/style'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface TransactionHashModalProps {
  orderID: string
  destinationAddress: string
}

const TransactionHashModal = ({ orderID, destinationAddress }: TransactionHashModalProps) => {
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
  return (
    <>
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 grid place-items-center ">
        <div className="flex flex-col relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {confirmOrderLoading && (
            <div className="absolute bg-white shadow h-full w-full z-40 sm:rounded-lg top-0 left-0 flex items-center justify-center space-x-2 ">
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
          )}
          <TransactionForm destinationAddress={destinationAddress} orderID={orderID} confirmOrder={confirmOrder} />
        </div>
      </div>
    </>
  )
}

export default TransactionHashModal

interface TrnsactionFormProps {
  destinationAddress: string
  orderID: string
  confirmOrder: (data: any) => void
}

const TransactionForm = ({ destinationAddress, orderID, confirmOrder }: TrnsactionFormProps) => {
  const [acceptRisk, setAcceptRisk] = useState(false)
  const [hash, setHash] = useState<string>()
  const [walletAddress, setWalletAddress] = useState<string>()

  return (
    <>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
          <div className="text-lg font-medium leading-6 text-gray-900">Possible Repeat Transaction</div>
          <div className="mt-2 text-sm text-gray-500 gap-y-4 flex flex-col">
            <p>
              We have detected that you have earlier tried to complete a payment transaction to banxa. <br />
            </p>
            <p>
              This message appears because we did not receive the transaction id or there was an error in the
              transaction.
            </p>
            <p>
              If you can confirm that you have sent the tokens to the banxa’s wallet address then enter the wallet
              address used in the transaction and the transaction id that can be found in your walllet’s transaction
              history.
            </p>
          </div>
          <div className="mt-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Source Wallet Address
            </label>
            <div className="mt-1">
              <input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0xB1Eb136..."
              />
            </div>
          </div>
          <div className="mt-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Transaction Hash
            </label>
            <div className="mt-1">
              <input
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                type="text"
                name="hash"
                id="hash"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0xb9a54a0..."
              />
            </div>
          </div>
          <div className="relative flex items-start mt-3">
            <div className="flex h-5 items-center">
              <input
                checked={acceptRisk}
                onChange={() => setAcceptRisk(!acceptRisk)}
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <span id="comments-description" className="text-gray-500">
                I accept that there is a risk of losing funds for continuing the payment transaction.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          disabled={!walletAddress && !hash}
          className={classNames(
            hash && walletAddress ? 'bg-indigo-600' : 'bg-indigo-300',
            'mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
          )}
          onClick={() =>
            confirmOrder({
              tx_hash: hash,
              source_address: walletAddress,
              destination_address: process.env.NODE_ENV
                ? destinationAddress
                : '0xe7639fE2062c398b1E85a69d1BdA9129035008Ed',
              order_id: orderID,
            })
          }
        >
          Submit Hash
        </button>
        <button
          disabled={!acceptRisk}
          type="button"
          onClick={() => console.log('hee')}
          className={classNames(
            acceptRisk ? 'bg-red-300 text-gray-900' : 'bg-red-100 text-gray-800',
            'mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-base font-medium  shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
          )}
        >
          Continue Payment
        </button>
      </div>
    </>
  )
}
const ConfirmationSuccess = () => {
  return (
    <>
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <div className="text-lg font-medium leading-6 text-gray-900">Payment successful</div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          // onClick={() => setOpen(false)}
        >
          Go back to dashboard
        </button>
      </div>
    </>
  )
}
