import { SearchIcon, XIcon } from '@heroicons/react/solid'
import Fuse from 'fuse.js'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import useDebounce from '../hooks/debounce'
import { classNames } from '../utils/style'
import Loader from './Loader'

interface Currency {
  code: string
  name: string
}

interface Props {
  type: 'FIAT' | 'CRYPTO'
  currencyList: Currency[] | undefined
  closeModal: () => void
  setCurrency: (val: string) => void
  selectedCurrency: string | undefined
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
    return <Loader />
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
