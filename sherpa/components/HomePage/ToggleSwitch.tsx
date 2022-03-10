/* This example requires Tailwind CSS v2.0+ */
import { Switch } from '@headlessui/react'
import { classNames } from '../../utils/twUtils'

export default function ToggleSwitch(props: any) {
  const { enabled, toggle } = props

  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className={classNames(
        enabled ? 'bg-primary' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-[4.7vw] w-[9.2vw] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled
            ? 'translate-x-[4vw] bg-secondary'
            : 'translate-x-0 bg-gray-500',
          'z-50 pointer-events-none inline-block h-[3.9vw] w-[3.9vw] mt-[1.5%] rounded-full  shadow transform ring-0 transition ease-in-out duration-200'
        )}
      />
      <span
        className={classNames(
          !enabled
            ? 'hidden'
            : 'absolute text-[1.7vw] top-[20%] text-secondary left-[10%] font-bold'
        )}
      >
        ON
      </span>

      <span
        className={classNames(
          enabled
            ? 'hidden'
            : 'absolute left-[60%] text-[1.7vw] top-[20%] font-bold'
        )}
      >
        OFF
      </span>
    </Switch>
  )
}
