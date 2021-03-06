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
        'items-center relative inline-flex flex-shrink-0 h-[30px] w-[60px] sm:h-[4.7vw] sm:w-[9.2vw] lg:h-[46px] lg:w-[91px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled
            ? 'translate-x-7 sm:translate-x-[4.5vw] lg:translate-x-11 bg-secondary'
            : 'translate-x-0 bg-gray-500',
          'z-50 pointer-events-none inline-block w-[24px] h-[24px]  sm:h-[3.9vw] sm:w-[3.9vw] lg:w-[39px] lg:h-[39px]  mt-[1.5%] rounded-full  shadow transform ring-0 transition ease-in-out duration-200'
        )}
      />
      <span
        className={classNames(
          !enabled
            ? 'hidden'
            : 'absolute  text-xs sm:text-[1.7vw] lg:text-lg  lg:top-[20%]  text-secondary left-[10%] font-bold'
        )}
      >
        ON
      </span>

      <span
        className={classNames(
          enabled
            ? 'hidden'
            : 'absolute left-[60%] text-xs sm:text-[1.7vw] lg:text-lg lg:top-[20%] font-bold'
        )}
      >
        OFF
      </span>
    </Switch>
  )
}
