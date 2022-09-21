import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ErrorModal from 'components/Error'
import Loader from 'components/Loader'
import OrderStatus from 'components/OrderStatus'
import SellOrderModal from 'components/SellOrderModal'
import TransactionHashModal from 'components/TransactionHashModal'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ORDER_STATUS } from '../../components/Transaction'
import { Order as IOrder } from '../orders'

const Order = () => {
  const router = useRouter()
  const { orderID } = router.query
  const [error, setError] = useState<string>()
  const [modalVisibility, setModalVisibility] = useState(false)
  const [transactionModalVisibility, setTransactionModalVisibility] = useState(false)

  const fetchOrder = async (): Promise<IOrder> => {
    const res = await axios.post('/api/banxa/get-order', {
      orderID,
    })

    return res.data.data.order
  }
  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery(['order'], fetchOrder, {
    enabled: !!orderID,
    staleTime: Infinity,
  })

  const closeModal = () => {
    setError(undefined)
  }

  useEffect(() => {
    if (orderError) {
      setError('Order is invalid')
    }
  }, [orderError])

  if (orderLoading) {
    return <Loader />
  }

  return (
    <>
      {error && <ErrorModal message={error} closeModal={closeModal} />}
      {modalVisibility && order && <SellOrderModal order={order} setModalVisibility={setModalVisibility} />}
      {/* {order?.finalize_status === 'active' && order.status === 'waitingPayment' && <div>oh god</div>} */}
      {transactionModalVisibility && order && (
        <TransactionHashModal
          order={order}
          setModalVisibility={setModalVisibility}
          setTransactionModalVisibility={setTransactionModalVisibility}
        />
      )}
      <div className="flex flex-col bg-black h-full w-full px-2 py-3 md:text-4xl relative">
        <div className="flex w-full md:h-[5%] items-center">
          <img src="/logo.svg" className="h-5 w-auto  md:h-full " alt="banxa_logo" />
          <div className="text-white text-sm  ml-5 md:text-lg ">Leading global Web3 on-and-off ramp solution</div>
        </div>

        <section className="mt-2 grow bg-white rounded-md sm:pt-4 overflow-auto flex justify-center relative ">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-6xl w-full flex flex-col pt-4">
            <button onClick={() => router.push('/orders')} className="flex items-center text-sm pb-2">
              <ChevronLeftIcon className="w-5 h-5 ml-2" />
              <div>Back</div>
            </button>
            {order ? (
              <div className="border-t border-gray-200 px-4 sm:pt-5 sm:p-0 overflow-auto relative">
                <dl className="sm:divide-y sm:divide-gray-200 ">
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

                {order.status === 'waitingPayment' && (
                  <div className="sticky bottom-0 left-0 w-full h-14 bg-white grid place-items-center">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        if (order.finalize_status === 'active') {
                          setTransactionModalVisibility(true)
                        } else {
                          setModalVisibility(true)
                        }
                      }}
                    >
                      Finalize Transaction
                    </button>
                  </div>
                )}
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
