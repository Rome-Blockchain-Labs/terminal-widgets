import { CheckIcon } from '@heroicons/react/solid'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'

const SuccessModal = ({ orderID }: { orderID: string }) => {
  const router = useRouter()
  const ref = useRef(null)
  useOnClickOutside(ref, () => router.push(`/order/${orderID}`))
  return (
    <>
      <div className="fixed top-0 z-40 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-50 flex justify-center items-center">
        <div
          ref={ref}
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
        >
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="text-lg font-medium leading-6 text-gray-900">Payment successful</div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You have successfully transferred tokens to Banxa. Banxa will now verify that they have received
                  payment on their end and send your fiat money to your bank account within 1-2 days.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              onClick={() => router.push('/orders')}
            >
              Go back to order list
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SuccessModal
