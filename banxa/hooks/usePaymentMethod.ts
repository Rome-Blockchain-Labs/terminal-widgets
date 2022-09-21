import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FormValues } from 'pages/create-order'
import { UseFormSetError, UseFormClearErrors } from 'react-hook-form'

const useGetLimits = ({
  source,
  target,
  sourceAmount,
  setFormError,
  clearErrors,
}: {
  source: string | undefined
  target: string | undefined
  sourceAmount: number | undefined
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
    if (lowLimit && highLimit && sourceAmount) {
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
  }, [clearErrors, highLimit, lowLimit, setFormError, source, sourceAmount])
}
export default useGetLimits
