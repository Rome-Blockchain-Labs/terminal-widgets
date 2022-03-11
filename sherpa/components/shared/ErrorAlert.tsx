/* This example requires Tailwind CSS v2.0+ */
import { XCircleIcon } from '@heroicons/react/solid'

export default function Error({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-md bg-red-50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-[1.9vw] lg:text-xl font-medium text-red-800">
            {message}
          </h3>
        </div>
      </div>
    </div>
  )
}
