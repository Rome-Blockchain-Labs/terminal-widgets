import { ChevronLeftIcon } from '@heroicons/react/solid'
import axios from 'axios'
import ErrorModal from 'components/Error'
import Loader from 'components/Loader'
import OrderStatus from 'components/OrderStatus'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ORDER_STATUS } from '../../components/Transaction'
import { Order as IOrder } from '../orders'

const Order = () => {
  const router = useRouter()
  const { orderID } = router.query
  const [order, setOrder] = useState<IOrder>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const closeModal = () => {
    setError(undefined)
  }

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      const res = await axios
        .post('/api/banxa/get-order', {
          orderID,
        })
        .catch(() => setError('Unable to fetch order. Please try again later'))
      if (res) {
        setOrder(res.data.data.order)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [orderID])
  if (loading) {
    return <Loader />
  }

  return (
    <>
      {error && <ErrorModal message={error} closeModal={closeModal} />}
      <div className="flex flex-col bg-black h-full w-full px-2 py-3 md:text-4xl">
        <div className="flex w-full md:h-[5%] items-center">
          <img src="/logo.svg" className="h-5 w-auto  md:h-full " alt="banxa_logo" />
          <div className="text-white text-sm  ml-5 md:text-lg ">Leading global Web3 on-and-off ramp solution</div>
        </div>

        <section className="mt-2 grow bg-white rounded-md sm:pt-4 overflow-auto flex justify-center scrollbar-thin scrollbar-thumb-gray-700">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-6xl w-full flex flex-col pt-4">
            <button onClick={() => router.push('/orders')} className="flex items-center text-sm pb-2">
              <ChevronLeftIcon className="w-5 h-5 ml-2" />
              <div>Back</div>
            </button>
            {order ? (
              <div className="border-t border-gray-200 px-4 sm:py-5 sm:p-0 overflow-auto">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.id}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.created_at}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Order Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.order_type}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Fiat Code</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.fiat_code}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Fiat Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.fiat_amount}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Crypto Code</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.coin_code}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Crypto Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.coin_amount}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Blockchain</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.blockchain.description}</dd>
                  </div>

                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Fee</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.fee}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Commission</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.commission}</dd>
                  </div>
                  <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <OrderStatus orderStatus={order.status as ORDER_STATUS} />
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="grid h-full w-full place-items-center">Order not found</div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Order
