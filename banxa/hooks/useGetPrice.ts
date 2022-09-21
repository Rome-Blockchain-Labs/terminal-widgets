import axios from 'axios'
import { FormValues } from 'pages/create-order'
import { useCallback, useEffect } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import useDebounce from './debounce'

const useGetPrice = (
  setValue: UseFormSetValue<FormValues>,
  priceLoading: boolean,
  setPriceLoading: (val: boolean) => void,
  source: string | undefined,
  target: string | undefined,
  setError: (val: string | undefined) => void,
  order: string,
  setAmountInput: (val: 'SOURCE' | 'TARGET' | undefined) => void,
  amountInput: 'SOURCE' | 'TARGET' | undefined,
  sourceAmount: number | undefined,
  targetAmount: number | undefined,
  currencyChange: boolean,
  setCurrencyChange: (val: boolean) => void
) => {
  const debouncedSourceAmount = useDebounce(sourceAmount, 500)
  const debouncedTargetAmount = useDebounce(targetAmount, 500)

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
      const params: {
        source: string | undefined
        target: string | undefined
        source_amount?: number
        target_amount?: number
      } = {
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
          if (order === 'BUY') {
            setSourceAmount(Math.trunc(res.data.fiat_amount))
            setTargetAmount(res.data.coin_amount)
          } else {
            setTargetAmount(Math.trunc(res.data.fiat_amount))

            setSourceAmount(res.data.coin_amount)
          }
        }
      }

      setPriceLoading(false)
      setAmountInput(undefined)
    },
    [order, priceLoading, setAmountInput, setError, setPriceLoading, setValue, source, target]
  )

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
  }, [currencyChange, debouncedSourceAmount, debouncedTargetAmount, getPrices, setCurrencyChange, source, target])
}

export default useGetPrice
