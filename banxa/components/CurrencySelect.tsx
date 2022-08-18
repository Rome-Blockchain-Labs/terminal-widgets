import { QuestionMarkCircleIcon, SearchIcon } from '@heroicons/react/solid'
import Fuse from 'fuse.js'
import React, { useState, useEffect, useMemo } from 'react'
import useDebounce from '../hooks/debounce'
import { Currency } from '@uniswap/sdk-core'

interface Props {
  type: 'FIAT' | 'CRYPTO'
  CurrencyList: string[]
}

const list = ['ETH', 'BTC', 'AVAX', 'USDC']
const type = 'CRYPTO'

const CurrencySelect = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [displayList, setDisplayList] = useState<string[]>(list)
  const debouncedValue = useDebounce<string>(searchText, 500)
  const [selectedCurrency, setSelectedCurrency] = useState<string>()

  const fuse = useMemo(() => new Fuse(list), [])

  // const fuse =
  console.log(searchText)
  useEffect(() => {
    if (debouncedValue !== '') {
      const result = fuse.search(debouncedValue)
      if (result.length > 0) {
        const parsedList = result.map((ele) => ele.item)
        setDisplayList(parsedList)
      }
    } else {
      setDisplayList(list)
    }
  }, [debouncedValue, fuse])

  return (
    <>
      {console.log(selectedCurrency)}
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div className="rounded-lg w-4/5 bg-white h-4/5 overflow-y-auto py-2 px-4">
          <div className="text-xl text-[#3171CA]">
            Select a {type === 'CRYPTO' ? 'Cryptocurrency' : 'Fiat Currency'}{' '}
          </div>
          <div className="mt-2 m-2 relative rounded-md shadow-sm">
            <input
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md pl-10"
              type="text"
              value={searchText}
              placeholder="Search a Currency"
              onChange={(event) => {
                setSearchText(event.target.value)
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>

          <fieldset>
            <div className="space-y-5">
              {displayList.map((currency, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      checked={selectedCurrency === currency}
                      onChange={() => setSelectedCurrency(currency)}
                      name="currency"
                      type="radio"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">{currency}</label>
                    <span className="text-gray-500"></span>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  )
}

export default CurrencySelect
