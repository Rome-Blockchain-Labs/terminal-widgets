import React, { useState } from 'react'

export default function Select(props:any) {
  const {selectedOption, setSelectedOption, possibleOptions} = props
  const [isOpen, setIsOpen] = useState(false)
  const options = possibleOptions

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
      {/*todo overlay the UI so it appears on top*/}
      {isOpen && options.map((option:any)=>
        <div key={option} /**className="w-[118px] absolute mt-[27px]"**/>
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
