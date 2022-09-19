import { CheckIcon } from '@heroicons/react/solid'
import React from 'react'

const ConfirmModal = () => {
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
              <div className="text-lg font-medium leading-6 text-gray-900">Password Email Sent</div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Pleae check your email for instructions to reset your password. If you do not see the email in a few
                  minutes, check your “junk mail” folder or “spam” folder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmModal
