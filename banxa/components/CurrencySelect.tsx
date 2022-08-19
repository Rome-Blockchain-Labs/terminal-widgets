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
  currencyList: Currency[]
  closeModal: () => void
}

export const list = [
  { code: 'ETH', name: 'Ethereum' },
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'AVAX', name: 'Avalanche' },
  { code: 'USDC', name: 'USDC' },
  { code: 'ETHA', name: 'EthereumA' },
  { code: 'BTCA', name: 'BitcoinA' },
  { code: 'AVAXA', name: 'AvalancheA' },
  { code: 'USDCA', name: 'USDCA' },
]
const type = 'CRYPTO'

const CurrencySelect = ({ closeModal }: Props) => {
  const [searchText, setSearchText] = useState<string>('')
  const [displayList, setDisplayList] = useState<Currency[]>(list)
  const debouncedValue = useDebounce<string>(searchText, 500)
  const [selectedCurrency, setSelectedCurrency] = useState<string>()
  const ref = useRef<HTMLDivElement>(null)

  const fuse = useMemo(() => new Fuse(list, { keys: ['code', 'name'] }), [])
  useOnClickOutside(ref, closeModal)

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
              {displayList.map((currency, index) => (
                <div
                  key={index}
                  className={classNames(
                    selectedCurrency === currency.code ? 'bg-gray-100' : '',
                    'relative flex  justify-end wg:justify-start items-center'
                  )}
                >
                  <div className="flex items-center h-5 order-2 wg:order-1">
                    <input
                      checked={selectedCurrency === currency.code}
                      onChange={() => setSelectedCurrency(currency.code)}
                      name="currency"
                      type="radio"
                      className="focus:ring-[#0472c0] h-4 w-4 text-[#0472c0] border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm md:text-xl wg:order-2 mr-2 wg:mr-0">
                    <label className="font-medium text-gray-700">{currency.code}</label>
                    <span className="text-gray-500 ml-2">{currency.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="bg-white  absolute h-16 md:h-24 left-0 bottom-0 w-full grid place-items-center">
            <div className="w-full border-t border-gray-200 " />
            <button className="btn-primary text-white px-2 py-3 w-2/5 wg:w-1/5 md:w-2/5 md:h-20 min-w-[138px] rounded-full md:text-2xl ">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CurrencySelect
