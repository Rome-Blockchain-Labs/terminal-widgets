import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FormValues } from 'pages/create-order'
import { UseFormSetError, UseFormClearErrors } from 'react-hook-form'

const useGetLimits = ({
  type,
  source,
  target,
  sourceAmount,
  targetAmount,
  setFormError,
  clearErrors,
}: {
  type: string
  source: string | undefined
  target: string | undefined
  sourceAmount: number | undefined
  targetAmount: number | undefined
  setFormError: UseFormSetError<FormValues>
  clearErrors: UseFormClearErrors<FormValues>
}) => {
  const { data: paymentMethods } = useQuery(
    ['paymentMethoData', source, target],
    async () => {
      const res = await axios.post('/api/banxa/payment-methods', {
        params: {
          source,
          target,
        },
      })
      return res.data.data.payment_methods[0]
    },
    {
      enabled: !!source && !!target,
      staleTime: Infinity,
    }
  )

  const lowLimit = paymentMethods && parseInt(paymentMethods.transaction_limits[0].min)
  const highLimit = paymentMethods && parseInt(paymentMethods.transaction_limits[0].max)

  useEffect(() => {
    if (lowLimit && highLimit && sourceAmount && targetAmount) {
      if (type === 'BUY') {
        if (sourceAmount > highLimit) {
          setFormError('source_amount', { type: 'custom', message: `Source amount should be less than ${highLimit}` })
        }
        if (sourceAmount < lowLimit) {
          setFormError('source_amount', { type: 'custom', message: `Source amount should be higher than ${lowLimit}` })
        }
        if (sourceAmount > lowLimit && sourceAmount < highLimit) {
          clearErrors('source_amount')
        }
      }
      if (type === 'SELL') {
        if (targetAmount > highLimit) {
          setFormError('target_amount', { type: 'custom', message: `Target amount should be less than ${highLimit}` })
        }
        if (targetAmount < lowLimit) {
          setFormError('target_amount', { type: 'custom', message: `Target amount should be higher than ${lowLimit}` })
        }
        if (targetAmount > lowLimit && targetAmount < highLimit) {
          clearErrors('target_amount')
        }
      }
    }
  }, [clearErrors, highLimit, lowLimit, setFormError, source, sourceAmount, targetAmount, type])
}
export default useGetLimits
