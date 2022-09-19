import { useCallback, useEffect, useState } from 'react'
import { classNames } from '../utils/style'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDownIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useResponsive } from '../hooks/useMediaQuery'
import { useWeb3React } from '@romeblockchain/wallet'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import CurrencySelect from 'components/CurrencySelect'
import ErrorModal from 'components/Error'
import Loader from 'components/Loader'
import RedirectModal from 'components/RedirectModal'
import WalletModal from 'components/WalletModal'
import useCurrencyLists from '../hooks/useCurrencyList'
import useSelectReducer from '../hooks/useSelectReducer'
import useGetPrice from 'hooks/useGetPrice'

export interface FormValues {
  sourceAmount: number
  targetAmount: number
  wallet_address?: string
  refund_address?: string
  source: string | undefined
  target: string | undefined
  source_amount: number | undefined
  target_amount: number | undefined
}

export default function CreateOrder() {
  const [order, setOrder] = useState('BUY')

  //Requests for list of token and fiat currencies tradeable in Banxa
  const {
    fiatBuyList,
    fiatBuyListError,
    fiatSellList,
    fiatSellListError,
    tokenBuyList,
    tokenBuyListError,
    tokenSellList,
    tokenSellListError,
  } = useCurrencyLists()

  const {
    mutate: createOrder,
    data: createOrderData,
    error: createOrderError,
    isLoading: createOrderLoading,
  } = useMutation((data: any) => {
    return axios.post('/api/banxa/create-order', {
      params: {
        ...data,
        return_url_on_success: process.env.NEXT_PUBLIC_RETURN_URL_ON_SUCCESS,
      },
    })
  })

  const {
    mutate: logout,
    data: logoutData,
    isLoading: logoutLoading,
  } = useMutation(() => {
    return axios.post('/api/logout')
  })

  const { wg } = useResponsive()
  const router = useRouter()
  // const [order] = useState('BUY')
  const [walletVisibility, setWalletVisibility] = useState(false)
  const [currencyChange, setCurrencyChange] = useState(false)
  const { account } = useWeb3React()
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: {
      source: undefined,
      target: undefined,
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
    if (order === 'BUY') delete data.refund_address
    if (order === 'SELL') delete data.wallet_address
    createOrder(data)
  }
  const target = watch('target')
  const setTarget = useCallback(
    (value: string) => {
      setValue('target', value)
    },
    [setValue]
  )
  const source = watch('source')
  const sourceAmount = watch('source_amount')
  const targetAmount = watch('target_amount')
  const setSource = useCallback(
    (value: string) => {
      setValue('source', value)
    },
    [setValue]
  )
  const [amountInput, setAmountInput] = useState<'SOURCE' | 'TARGET'>()

  const closeCurrencyModal = () => {
    dispatch({ type: 'CLOSE_SELECT' })
  }
  const [buttonText, setButtonText] = useState('')
  const [priceLoading, setPriceLoading] = useState(false)
  const [checkoutURL, setCheckoutURL] = useState<string>()

  //Enables selecting of a token or fiat from the drop down selections
  const [{ currencyList, setCurrency, selectedCurrency, visible, selectCurrencyType }, dispatch] = useSelectReducer(
    tokenBuyList,
    tokenSellList,
    fiatBuyList,
    fiatSellList,
    setTarget,
    target,
    setSource,
    source
  )

  // fetches the price for source amount and target from banxa whenever the debounce value of the input fields changes
  useGetPrice(
    setValue,
    priceLoading,
    setPriceLoading,
    source,
    target,
    setError,
    order,
    setAmountInput,
    amountInput,
    sourceAmount,
    targetAmount,
    currencyChange,
    setCurrencyChange
  )

  useEffect(() => {
    if (createOrderError) {
      setError('Unable to create an order. Please try again later or visit www.banxa.com')
    }
    if (fiatBuyListError || tokenBuyListError || fiatSellListError || tokenSellListError) {
      setError('Unable to get currency lists. Please try again later')
    }
  }, [createOrderError, fiatBuyListError, fiatSellListError, tokenBuyListError, tokenSellListError])

  useEffect(() => {
    if (createOrderData) {
      setCheckoutURL(createOrderData?.data.data.order.checkout_url)
    }
  }, [createOrderData])

  useEffect(() => {
    if (wg) {
      setButtonText('Connect Wallet')
    } else {
      setButtonText('Connect')
    }
  }, [wg])
  useEffect(() => {
    console.log(account)
    if (account) {
      if (order === 'BUY') {
        setValue('wallet_address', account)
      }
      if (order === 'SELL') {
        setValue('refund_address', account)
      }
    }
  }, [account, order, setValue])

  useEffect(() => {
    if (logoutData) {
      router.push('/')
    }
  }, [logoutData, router])

  useEffect(() => {
    if (!source && !target && tokenBuyList && fiatBuyList) {
      setSource(fiatBuyList[0].code)
      setTarget(tokenBuyList[0].code)
    }
  }, [fiatBuyList, setSource, setTarget, source, target, tokenBuyList])

  if (!tokenBuyList || !tokenSellList || !fiatBuyList || !fiatSellList) {
    return <Loader />
  }
  return (
    <>
      {checkoutURL && <RedirectModal setCheckoutURL={setCheckoutURL} checkoutURL={checkoutURL} />}
      {error && <ErrorModal message={error} closeModal={resetForm} />}
      {(createOrderLoading || logoutLoading) && <Loader />}
      {walletVisibility && <WalletModal setWalletVisibility={setWalletVisibility} />}
      {visible && (
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

        <section className="mt-2 grow bg-white rounded-md p-4 overflow-auto">
          <div className="flex  text-[#1D3E52] relative items-stretch">
            <div className="grow text-base text-medium">
              {tokenSellList.length > 0 && (
                <div className="h-full rounded-md  border  mx-auto flex max-w-lg ">
                  <button
                    onClick={() => {
                      reset()
                      setOrder('BUY')
                      setSource(fiatBuyList[0].code)
                      setTarget(tokenBuyList[0].code)
                    }}
                    className={classNames(order === 'BUY' ? 'bg-gray-200 rounded-lg' : '', 'grow')}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => {
                      reset()
                      setOrder('SELL')
                      setSource(tokenSellList[0].code)
                      setTarget(fiatSellList[0].code)
                    }}
                    className={classNames(order === 'SELL' ? 'bg-gray-200 rounded-lg' : '', 'grow')}
                  >
                    SELL
                  </button>
                </div>
              )}
            </div>
            <div className=" flex flex-shrink-1 md:mt-0 md:ml-4 justify-center items-cente ml-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => router.push('/orders')}
              >
                Transactions
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
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
                <button
                  type="button"
                  className="flex  items-center"
                  onClick={() => {
                    if (order === 'BUY') {
                      dispatch({ type: 'OPEN_BUY_LIST', selectCurrencyType: 'FIAT' })
                    } else {
                      dispatch({ type: 'OPEN_SELL_LIST', selectCurrencyType: 'CRYPTO' })
                    }
                  }}
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

                <button
                  type="button"
                  className="flex items-center"
                  onClick={() => {
                    if (order === 'BUY') {
                      dispatch({ type: 'OPEN_BUY_LIST', selectCurrencyType: 'CRYPTO' })
                    } else {
                      dispatch({ type: 'OPEN_SELL_LIST', selectCurrencyType: 'FIAT' })
                    }
                  }}
                >
                  {target}
                  <ChevronDownIcon className="h-5 w-5 md:h-10 md:w-10 text-current" />
                </button>
              </div>
            </div>

            {order === 'BUY' && (
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
            )}

            {order === 'SELL' && (
              <div className="mt-3">
                <label htmlFor="source" className="block  font-medium text-gray-400  ">
                  Refund Address
                </label>
                <div className="mt-1">
                  <input
                    className="text-sm shadow-sm block w-full border-b border-t-0 border-x-0 border-gray-300 rounded-md md:text-2xl"
                    type="text"
                    placeholder="Click the connect wallet button below"
                    {...register('refund_address', { required: true, maxLength: 100 })}
                  />
                </div>
              </div>
            )}

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
