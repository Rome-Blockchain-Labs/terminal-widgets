// import axios from 'axios'
import { useEffect, useState } from 'react'
import { classNames } from '../utils/style'
import React from 'react'
import { useForm } from 'react-hook-form'
import CurrencySelect from './CurrencySelect'

import { ChevronDownIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useResponsive } from '../hooks/useMediaQuery'

interface FormValues {
  sourceAmount: number
  targetAmount: number
  address: string
  source: string
  target: string
}

export default function Example() {
  const { wg } = useResponsive()
  const [order] = useState('BUY')
  const {
    register,
    handleSubmit,
    // formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      source: 'USD',
      target: 'ETH',
    },
  })
  const onSubmit = (data: any) => console.log(data)
  const target = watch('target')
  const setTarget = (value: string) => {
    setValue('target', value)
  }
  const source = watch('source')
  const setSource = (value: string) => {
    setValue('source', value)
  }
  const [selectCurrencyType, setSelectCurrencyType] = useState<'FIAT' | 'CRYPTO'>()
  const [fiatBuyList, setBuyFiatList] = useState()
  const [tokenBuyList, setTokenBuyList] = useState()

  // const currencySelector = selectCurrencyType === 'FIAT' ? setTarget : setSource
  const currencyList = selectCurrencyType === 'FIAT' ? fiatBuyList : tokenBuyList
  const setCurrency = selectCurrencyType === 'FIAT' ? setSource : setTarget
  const selectedCurrency = selectCurrencyType === 'FIAT' ? source : target
  const closeModal = () => {
    setSelectCurrencyType(undefined)
  }
  const [buttonText, setButtonText] = useState('')
  useEffect(() => {
    if (wg) {
      setButtonText('Connect Wallet')
    } else {
      setButtonText('Connect')
    }
  }, [wg])

  useEffect(() => {
    const fetchCurrencyLists = async () => {
      const fiatBuyRes = await axios.get('/api/banxa/fiat-buy')
      const parsedFiatBuyList = fiatBuyRes.data.data.fiats.map((fiat: any) => ({
        code: fiat.fiat_code,
        name: fiat.fiat_name,
      }))
      setBuyFiatList(parsedFiatBuyList)

      const tokenBuyRes = await axios.get('api/banxa/crypto-buy')
      const parsedTokenBuyList = tokenBuyRes.data.data.coins.map((coin: any) => ({
        code: coin.coin_code,
        name: coin.coin_name,
      }))
      setTokenBuyList(parsedTokenBuyList)
    }
    fetchCurrencyLists()
  }, [selectCurrencyType])

  return (
    <>
      {selectCurrencyType && (
        <CurrencySelect
          selectedCurrency={selectedCurrency}
          setCurrency={setCurrency}
          currencyList={currencyList}
          type={selectCurrencyType}
          closeModal={closeModal}
        />
      )}
      <div className="flex flex-col bg-black h-full w-full px-2 py-3 md:text-4xl">
        <div className="flex w-full md:h-[5%] items-center">
          <img src="/logo.svg" className="h-5 w-auto  md:h-full " alt="banxa_logo" />
          <div className="text-white text-sm  ml-5 md:text-lg ">Leading global Web3 on-and-off ramp solution</div>
        </div>
        <section className="mt-2 grow bg-white rounded-md p-4 overflow-auto">
          <div className="flex text-[#1D3E52] ">
            <div className="h-8 w-3/5 rounded-lg border-[#0CF5F1] border  mx-auto flex max-w-lg md:text-4xl md:h-11">
              <button className={classNames(order === 'BUY' ? 'bg-gray-200 rounded-lg' : '', 'grow')}>BUY</button>
              <button className={classNames(order === 'SELL' ? 'bg-gray-200 rounded-lg' : '', 'grow')}>SELL</button>
            </div>
            <button className="bg-gray-200 rounded-lg px-3 md:text-3xl">History</button>
          </div>

          <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="source" className="block  font-medium text-black ">
                You Pay
              </label>
              <div className="mt-1 flex">
                <input
                  className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md md:text-2xl"
                  type="number"
                  placeholder="Enter amount"
                  {...register('source', { required: true, maxLength: 80 })}
                />
                <button
                  className="flex border-b border-gray-300 items-center"
                  onClick={() => setSelectCurrencyType('FIAT')}
                >
                  {source}
                  <ChevronDownIcon className="h-5 w-5 md:h-10 md:w-10 text-current" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="source" className="block  font-medium text-black  ">
                You Receive
              </label>
              <div className="mt-1 flex">
                <input
                  className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md md:text-2xl"
                  type="number"
                  placeholder="Enter amount"
                  {...register('target', { required: true, maxLength: 100 })}
                />

                <button
                  className="flex border-b border-gray-300 items-center"
                  onClick={() => setSelectCurrencyType('CRYPTO')}
                >
                  {target}
                  <ChevronDownIcon className="h-5 w-5 md:h-10 md:w-10 text-current" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="source" className="block  font-medium text-gray-400  ">
                Selected Address
              </label>
              <div className="mt-1">
                <input
                  className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md md:text-2xl"
                  type="text"
                  placeholder="Click the connect wallet button below"
                  {...register('address', { required: true, maxLength: 100 })}
                />
              </div>
            </div>

            <div className="flex h-8 justify-center gap-x-2 mt-2 md:h-20 md:mt-6">
              <button className="rounded-full h-full text-sm wg:text-base px-2 w-1/3 max-w-sm text-white bg-gradient-to-r from-[#0573C1]  to-[#01C2C1] md:text-2xl">
                {buttonText}
              </button>

              <button
                type="submit"
                className="text-sm wg:text-base rounded-full border-gray-300 border  h-full px-2 w-1/3 max-w-sm md:text-2xl"
              >
                Create Order
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
