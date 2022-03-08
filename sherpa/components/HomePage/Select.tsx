import React, { useState } from 'react'

const options = ['Sherpa Relayer - 1%', 'Local Test Relayer - 1%']

export default function Select() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const option = selectedOption === options[0] ? options[1] : options[0]

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (value: string) => () => {
    setSelectedOption(value)
    setIsOpen(false)
  }

  return (
    <div className=" rounded-sm w-[118px] bg-primary text-secondary font-bold text-[9px] flex flex-col">
      <div
        className="flex items-center w-full my-auto h-[26px] px-1 "
        onClick={toggling}
      >
        <span>{selectedOption}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3 ml-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="w-[118px] absolute mt-[27px]">
          <ul className="bg-primary text-secondary">
            <li
              className="h-[26px] flex items-center pl-1 "
              onClick={onOptionClicked(option)}
            >
              {option}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
