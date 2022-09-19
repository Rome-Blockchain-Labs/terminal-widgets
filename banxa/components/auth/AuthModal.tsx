import { CheckIcon } from '@heroicons/react/solid'
import React from 'react'

const AuthModal = () => {
  return (
    <>
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="text-lg font-medium leading-6 text-gray-900">Password Reset Completed</div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please click the button below to be redirected back to Rome Terminal
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              onClick={() => {
                window.open(process.env.NEXT_PUBLIC_RETURN_URL_ON_SUCCESS)?.focus()
              }}
            >
              Return to Rome Terminal
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthModal
