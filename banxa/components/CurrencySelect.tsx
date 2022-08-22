import { SearchIcon, XIcon } from '@heroicons/react/solid'
import Fuse from 'fuse.js'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import useDebounce from '../hooks/debounce'
import { classNames } from '../utils/style'

interface Currency {
  code: string
  name: string
}

interface Props {
  type: 'FIAT' | 'CRYPTO'
  currencyList: Currency[] | undefined
  closeModal: () => void
  setCurrency: (val: string) => void
  selectedCurrency: string
  setCurrencyChange: (val: boolean) => void
}

const type = 'CRYPTO'

const CurrencySelect = ({ selectedCurrency, setCurrency, closeModal, currencyList, setCurrencyChange }: Props) => {
  const [searchText, setSearchText] = useState<string>('')
  const [displayList, setDisplayList] = useState<Currency[]>()
  const debouncedValue = useDebounce<string>(searchText, 500)
  const ref = useRef<HTMLDivElement>(null)

  const fuse = useMemo(() => {
    if (currencyList) {
      return new Fuse(currencyList, { keys: ['code', 'name'] })
    }
  }, [currencyList])
  useOnClickOutside(ref, closeModal)

  useEffect(() => {
    if (debouncedValue !== '' && fuse) {
      const result = fuse.search(debouncedValue)
      if (result.length > 0) {
        const parsedList = result.map((ele) => ele.item)
        setDisplayList(parsedList)
      }
    } else {
      setDisplayList(currencyList)
    }
  }, [currencyList, debouncedValue, fuse])
  if (!displayList || displayList?.length === 0) {
    return (
      <>
        <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
        <div className="fixed top-0 w-full h-full z-30 flex justify-center items-center">
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div
          ref={ref}
          className="wg:rounded-lg w-full  wg:w-4/5 bg-white h-full wg:h-4/5  py-2 px-4 relative flex flex-col max-w-4xl"
        >
          <XIcon className="wg:hidden absolute top-0 right-0 mr-2 mt-2 h-4 w-4" onClick={() => closeModal()} />
          <div className="text-xl text-[#3171CA] md:text-4xl">
            Select a {type === 'CRYPTO' ? 'Cryptocurrency' : 'Fiat Currency'}{' '}
          </div>
          <div className="my-2 relative rounded-md shadow-sm">
            <input
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 md:text-xl border-gray-300 rounded-md pl-10"
              type="text"
              value={searchText}
              placeholder="Search a Currency"
              onChange={(event) => {
                setSearchText(event.target.value)
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 md:h-[65%] md:w-[65s%]" aria-hidden="true" />
            </div>
          </div>

          <fieldset className="pb-16 pl-1 pr-3 wg:pr-0 flex-grow overflow-scroll scrollbar-thin scrollbar-thumb-gray-700 ">
            <div className="space-y-2">
              {displayList &&
                displayList.map((currency, index) => (
                  <>
                    <hr />
                    <button
                      key={index}
                      onClick={() => {
                        setCurrency(currency.code)
                        setCurrencyChange(true)
                        closeModal()
                      }}
                      className={classNames(
                        selectedCurrency === currency.code ? 'bg-gray-200' : '',
                        'relative flex  justify-end wg:justify-start items-center w-full p-2'
                      )}
                    >
                      <div className="flex items-center h-5 order-2 wg:order-1">
                        <input
                          checked={selectedCurrency === currency.code}
                          name="currency"
                          type="radio"
                          className="focus:ring-[#0472c0] h-4 w-4 text-[#0472c0] border-gray-300"
                        />
                      </div>
                      <div className="ml-3 text-sm md:text-xl wg:order-2 mr-2 wg:mr-0">
                        <label className="font-medium text-gray-700">{currency.code}</label>
                        <span className="text-gray-500 ml-2">{currency.name}</span>
                      </div>
                    </button>
                  </>
                ))}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  )
}

export default CurrencySelect
