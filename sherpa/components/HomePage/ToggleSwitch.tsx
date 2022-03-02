/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ToggleSwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? 'bg-primary' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-6 w-12 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-6 bg-secondary' : 'translate-x-0 bg-gray-500',
          'z-50 pointer-events-none inline-block h-5 w-5 rounded-full  shadow transform ring-0 transition ease-in-out duration-200'
        )}
      />
      <span
        className={classNames(
          !enabled
            ? 'hidden'
            : 'absolute text-[8px] top-[20%] text-secondary left-[10%] font-bold'
        )}
      >
        ON
      </span>

      <span
        className={classNames(
          enabled
            ? 'hidden'
            : 'absolute left-[60%] text-[8px] top-[20%] font-bold'
        )}
      >
        OFF
      </span>
    </Switch>
  )
}
