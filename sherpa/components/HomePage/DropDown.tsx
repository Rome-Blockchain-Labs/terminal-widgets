import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DropDown({
  disabled,
  selectedOption,
  setSelectedOption,
  possibleOptions,
}: any) {
  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <Menu.Button
          disabled={disabled}
          className={classNames(
            disabled && 'bg-opacity-40 ',
            'inline-flex w-full min-h-[43px] sm:min-h-[5vw] lg:min-h-[50px] px-[2%] sm:text-[1.9vw] lg:text-lg font-medium bg-primary text-secondary  rounded-md shadow-sm items-center'
          )}
        >
          {selectedOption}
          <ChevronDownIcon
            className="w-[1.9vw] h-auto lg:w-[18px] ml-auto -mr-1 my-auto"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 cursor-pointer">
            {possibleOptions
              .filter((option: any) => option !== selectedOption)
              .map((option: string, index: number) => (
                <Menu.Item
                  key={index}
                  onClick={() => setSelectedOption(option)}
                >
                  <p className="cursor-pointer bg-primary text-secondary block px-4 py-2 sm:text-[1.9vw] lg:text-lg  ">
                    {option}
                  </p>
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
