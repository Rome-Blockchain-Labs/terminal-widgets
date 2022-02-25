import React, { useState } from 'react'
import tw, { styled } from 'twin.macro'

const DropDownContainer = styled.div`
  ${tw`rounded-sm w-[118px] bg-primary text-secondary font-bold text-[9px] flex flex-col`}
`
const DropDownHeader = styled('div')`
  ${tw`flex items-center w-full my-auto h-[26px] px-1 `}
`

const DropDownListContainer = styled.div`
  ${tw`w-[118px] absolute mt-[27px]`}
`

const DropDownList = styled('ul')`
  ${tw`bg-primary text-secondary`}
`

const ListItem = styled.li`
  ${tw`h-[26px] flex items-center pl-1 `}
`

const options = ['Sherpa Relayer - 1%', 'Local Test Relayer - 1%']

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const option = selectedOption === options[0] ? options[1] : options[0]

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (value) => () => {
    setSelectedOption(value)
    setIsOpen(false)
  }

  return (
    <DropDownContainer>
      <DropDownHeader onClick={toggling}>
        <span>{selectedOption}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          tw="ml-auto w-3 h-3"
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
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <DropDownList>
            <ListItem onClick={onOptionClicked(option)}>{option}</ListItem>
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  )
}
