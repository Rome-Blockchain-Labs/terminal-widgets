/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon, XIcon } from '@heroicons/react/solid'

export default function Success({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-md bg-green-50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="w-5 h-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-[1.6vw] lg:text-lg font-medium text-green-800">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
