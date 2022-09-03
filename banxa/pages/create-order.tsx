import { useCallback, useEffect, useState } from 'react'
import { classNames } from '../utils/style'
import React from 'react'
import { useForm } from 'react-hook-form'

import { ChevronDownIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useResponsive } from '../hooks/useMediaQuery'
import useDebounce from '../hooks/debounce'
import { useWeb3React } from '@romeblockchain/wallet'
import { useAppContext } from 'context/AppProvider'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import CurrencySelect from 'components/CurrencySelect'
import ErrorModal from 'components/Error'
import Loader from 'components/Loader'
import RedirectModal from 'components/RedirectModal'
import WalletModal from 'components/WalletModal'

interface FormValues {
  sourceAmount: number
  targetAmount: number
  wallet_address: string
  source: string
  target: string
  source_amount: number | undefined
  target_amount: number | undefined
}

export default function CreateOrder() {
  const { data: fiatBuyList, error: fiatBuyListError } = useQuery(['fiatBuyData'], async () => {
    const res = await axios.get('/api/banxa/fiat-buy')

    return res.data.data.fiats.map((fiat: any) => ({
      code: fiat.fiat_code,
      name: fiat.fiat_name,
    }))
  })
  const { data: tokenBuyList, error: tokenBuyListError } = useQuery(['tokenBuyData'], async () => {
    const tokenBuyRes = await axios.get('api/banxa/crypto-buy')
    return tokenBuyRes.data.data.coins.map((coin: any) => ({
      code: coin.coin_code,
      name: coin.coin_name,
    }))
  })
  const {
    mutate: createOrder,
    data: createOrderData,
    error: createOrderError,
    isLoading: createOrderLoading,
  } = useMutation((data: any) => {
    return axios.post('/api/banxa/create-order', {
      params: {
        ...data,
        account_reference: accountReference?.toString(),
        return_url_on_success: process.env.NEXT_PUBLIC_RETURN_URL_ON_SUCCESS,
      },
    })
  })
  const { wg } = useResponsive()
  const router = useRouter()
  // const [order] = useState('BUY')
  const { accountReference } = useAppContext()
  const [walletVisibility, setWalletVisibility] = useState(false)
  const [currencyChange, setCurrencyChange] = useState(false)
  const { account } = useWeb3React()
  const {
    register,
    handleSubmit,
    // formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      source: 'USD',
      target: 'ETH',
      source_amount: undefined,
      target_amount: undefined,
    },
  })
  const [error, setError] = useState<string>()
  const resetForm = () => {
    reset()
    setError(undefined)
  }
  const onSubmit = async (data: any) => {
    createOrder(data)
  }
  const target = watch('target')
  const setTarget = (value: string) => {
    setValue('target', value)
  }
  const source = watch('source')
  const sourceAmount = watch('source_amount')
  const targetAmount = watch('target_amount')
  const setSource = (value: string) => {
    setValue('source', value)
  }
  const debouncedSourceAmount = useDebounce(sourceAmount, 500)
  const debouncedTargetAmount = useDebounce(targetAmount, 500)

  const [amountInput, setAmountInput] = useState<'SOURCE' | 'TARGET'>()
  const [selectCurrencyType, setSelectCurrencyType] = useState<'FIAT' | 'CRYPTO'>()

  const currencyList = selectCurrencyType === 'FIAT' ? fiatBuyList : tokenBuyList
  const setCurrency = selectCurrencyType === 'FIAT' ? setSource : setTarget
  const selectedCurrency = selectCurrencyType === 'FIAT' ? source : target
  const closeCurrencyModal = () => {
    setSelectCurrencyType(undefined)
  }
  const [buttonText, setButtonText] = useState('')
  const [priceLoading, setPriceLoading] = useState(false)
  const [checkoutURL, setCheckoutURL] = useState<string>()

  const getPrices = useCallback(
    async ({ source_amount, target_amount }: { source_amount?: number; target_amount?: number }) => {
      const setSourceAmount = (value: number) => {
        setValue('source_amount', value)
      }
      const setTargetAmount = (value: number) => {
        setValue('target_amount', value)
      }
      if (!!source_amount === false && !!target_amount === false) {
        setValue('source_amount', undefined)
        setValue('target_amount', undefined)
        return
      }
      if (priceLoading === true) {
        return
      }
      setPriceLoading(true)
      const params: { source: string; target: string; source_amount?: number; target_amount?: number } = {
        source,
        target,
      }
      if (source_amount) {
        params.source_amount = source_amount
      }
      if (target_amount) {
        params.target_amount = target_amount
      }

      const res = await axios
        .post('/api/banxa/get-price', {
          params,
        })
        .catch(() => {
          setError(
            'Unable to process your order at this time. Please proceed to www.banxa.com to redo your transaction.'
          )
        })

      if (res) {
        if (source_amount) {
          setTargetAmount(res.data.data.prices[0].coin_amount)
        }

        if (target_amount) {
          setSourceAmount(res.data.data.prices[0].fiat_amount)
        }
      }

      setPriceLoading(false)
      setAmountInput(undefined)
    },
    [priceLoading, setValue, source, target]
  )
  useEffect(() => {
    if (createOrderError) {
      setError('Unable to create an order. Please try again later or visit www.banxa.com')
    }
    if (fiatBuyListError || tokenBuyListError) {
      setError('Unable to get currency lists. Please try again later')
    }
  }, [createOrderError, fiatBuyListError, tokenBuyListError])

  useEffect(() => {
    if (createOrderData) {
      setCheckoutURL(createOrderData?.data.data.order.checkout_url)
    }
  }, [createOrderData])

  useEffect(() => {
    if (amountInput === 'SOURCE' && debouncedSourceAmount === sourceAmount) {
      getPrices({ source_amount: debouncedSourceAmount })
    }

    if (amountInput === 'TARGET' && debouncedTargetAmount === targetAmount) {
      getPrices({ target_amount: debouncedTargetAmount })
    }
  }, [amountInput, debouncedSourceAmount, debouncedTargetAmount, getPrices, sourceAmount, targetAmount])

  useEffect(() => {
    if (currencyChange && debouncedSourceAmount && debouncedTargetAmount && (source || target)) {
      getPrices({ source_amount: debouncedSourceAmount })
      setCurrencyChange(false)
    }
  }, [currencyChange, debouncedSourceAmount, debouncedTargetAmount, getPrices, source, target])

  useEffect(() => {
    if (wg) {
      setButtonText('Connect Wallet')
    } else {
      setButtonText('Connect')
    }
  }, [wg])
  useEffect(() => {
    if (account) {
      setValue('wallet_address', account)
    }
  }, [account, setValue])

  useEffect(() => {
    if (!accountReference) {
      router.push('/')
    }
  }, [accountReference, router])

  return (
    <>
      {checkoutURL && <RedirectModal setCheckoutURL={setCheckoutURL} checkoutURL={checkoutURL} />}
      {error && <ErrorModal message={error} closeModal={resetForm} />}
      {createOrderLoading && <Loader />}
      {walletVisibility && <WalletModal setWalletVisibility={setWalletVisibility} />}
      {selectCurrencyType && (
        <CurrencySelect
          setCurrencyChange={setCurrencyChange}
          selectedCurrency={selectedCurrency}
          setCurrency={setCurrency}
          currencyList={currencyList}
          type={selectCurrencyType}
          closeModal={closeCurrencyModal}
        />
      )}
      <div className="flex flex-col bg-black h-full w-full px-2 py-3 md:text-4xl">
        <div className="flex w-full md:h-[5%] items-center">
          <img src="/logo.svg" className="h-5 w-auto  md:h-full " alt="banxa_logo" />
          <div className="text-white text-sm  ml-5 md:text-lg ">Leading global Web3 on-and-off ramp solution</div>
        </div>

        <section className="mt-2 grow bg-white rounded-md p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-700">
          <div className="flex text-[#1D3E52] ">
            {/* <div className="h-8 w-3/5 rounded-lg border-[#0CF5F1] border  mx-auto flex max-w-lg md:text-4xl md:h-11">
              <button className={classNames(order === 'BUY' ? 'bg-gray-200 rounded-lg' : '', 'grow')}>BUY</button>
              <button className={classNames(order === 'SELL' ? 'bg-gray-200 rounded-lg' : '', 'grow')}>SELL</button>
            </div> */}
            <button className="bg-gray-200 rounded-lg px-3 md:text-3xl ml-auto" onClick={() => router.push('/orders')}>
              History
            </button>
          </div>
          <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="source" className="block  font-medium text-black ">
                You Pay
              </label>

              <div
                className={classNames(priceLoading ? 'border-b-animate' : 'border-b-gray-300 border-b', 'mt-1 flex')}
              >
                <input
                  className="text-sm shadow-sm block w-full border-0  rounded-md md:text-2xl"
                  type="number"
                  placeholder="Enter amount"
                  step="any"
                  {...register('source_amount', {
                    maxLength: 80,
                    onChange: () => {
                      setAmountInput('SOURCE')
                    },
                  })}
                />
                <button className="flex  items-center" onClick={() => setSelectCurrencyType('FIAT')}>
                  {source}
                  <ChevronDownIcon className="h-5 w-5 md:h-10 md:w-10 text-current" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="source" className="block  font-medium text-black  ">
                You Receive
              </label>
              <div
                className={classNames(priceLoading ? 'border-b-animate' : 'border-b-gray-300 border-b', 'mt-1 flex')}
              >
                <input
                  className="text-sm shadow-sm block w-full border-0  rounded-md md:text-2xl"
                  type="number"
                  placeholder="Enter amount"
                  step="any"
                  {...register('target_amount', {
                    maxLength: 100,
                    onChange: () => {
                      setAmountInput('TARGET')
                    },
                  })}
                />

                <button className="flex items-center" onClick={() => setSelectCurrencyType('CRYPTO')}>
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
                  {...register('wallet_address', { required: true, maxLength: 100 })}
                />
              </div>
            </div>

            <div className="flex h-8 justify-center gap-x-2 mt-2 md:h-20 md:mt-6">
              <button
                type="button"
                onClick={() => setWalletVisibility(true)}
                className="rounded-full h-full text-sm wg:text-base px-2 w-1/3 max-w-sm text-white bg-gradient-to-r from-[#0573C1]  to-[#01C2C1] md:text-2xl"
              >
                {buttonText}
              </button>

              <button
                type="submit"
                disabled={priceLoading}
                className={classNames(
                  priceLoading
                    ? 'border-gray-300 text-gray-600 font-light '
                    : 'border-[#01C2C1]   text-black font-bold',
                  'text-sm wg:text-base rounded-full border  h-full px-2 w-1/3 max-w-sm md:text-2xl'
                )}
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
