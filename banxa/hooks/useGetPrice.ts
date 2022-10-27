import axios from 'axios'
import { FormValues } from 'pages/create-order'
import { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import useDebounce from './debounce'
import { useRef } from 'react'

const useGetPrice = (
  setValue: UseFormSetValue<FormValues>,
  setError: (val: string | undefined) => void,
  order: string,
  watch: UseFormWatch<FormValues>
) => {
  const latestSourceAmount = useRef<any>()
  const source = watch('source')
  const sourceAmount = watch('source_amount')
  const targetAmount = watch('target_amount')
  const target = watch('target')

  const [currencyChange, setCurrencyChange] = useState<boolean>(false)

  const [amountInput, setAmountInput] = useState<'SOURCE' | 'TARGET'>()
  const [priceLoading, setPriceLoading] = useState(false)
  const debouncedSourceAmount = useDebounce(sourceAmount, 500)
  const debouncedTargetAmount = useDebounce(targetAmount, 500)

  const getPrices = useCallback(
    async ({ source_amount, target_amount }: { source_amount?: number; target_amount?: number }) => {
      console.log('get price start',source_amount)
      const setSourceAmount = (value: number) => {
        setValue('source_amount', value)
      }
      const setTargetAmount = (value: number) => {
        setValue('target_amount', value)
      }

      //if block is called whenever the form inputs are cleared
      if (!!source_amount === false && !!target_amount === false) {
        setValue('source_amount', undefined)
        setValue('target_amount', undefined)
        return
      }
      // if (priceLoading === true) {
      //   return
      // }
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
      console.log('fetching')
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
        console.log(res.data)
        const sourceAmount = Math.trunc(res.data.fiat_amount)
        const targetAmount = Number(Number(res.data.coin_amount).toFixed(4))
        if (order === 'BUY') {
          if (Number(latestSourceAmount.current) === Number(source_amount)) {
            console.log('match buy')
            setSourceAmount(sourceAmount)
            setTargetAmount(targetAmount)
          }else{
            console.log('no match buy',Number(latestSourceAmount.current), Number(source_amount))
          }

        } else {
          setTargetAmount(sourceAmount)
          setSourceAmount(targetAmount)
        }
      }

      setPriceLoading(false)
      setAmountInput(undefined)
    },
    [order, priceLoading, setAmountInput, setError, setPriceLoading, setValue, source, target]
  )

  useEffect(() => {
    if (amountInput === 'SOURCE') {
      latestSourceAmount.current = sourceAmount
      console.log('getting prices')

      getPrices({ source_amount: sourceAmount })
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
  return { setCurrencyChange, priceLoading, setPriceLoading, amountInput, setAmountInput }
}

export default useGetPrice
