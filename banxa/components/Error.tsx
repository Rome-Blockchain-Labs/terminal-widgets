import React from 'react'
import { ExclamationIcon } from '@heroicons/react/outline'

interface ErrorModalProps {
  message: string
  closeModal: () => void
}

const ErrorModal = ({ message, closeModal }: ErrorModalProps) => {
  return (
    <>
      <div className="fixed top-0 z-40 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-50 flex justify-center items-center">
        <div className="relative bg-white sm:rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6 l">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div className="text-lg leading-6 font-medium text-gray-900">Unable To Complete Transaction</div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => closeModal()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default ErrorModal
