import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import axios from 'axios'
import OrderStatus from 'components/OrderStatus'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { ORDER_STATUS } from '../components/Transaction'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import ErrorModal from 'components/Error'

const oneYearAgo = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
const today = dayjs().add(1, 'day').format('YYYY-MM-DD')

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const closeModal = () => {
    setError(undefined)
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)

      const res = await axios
        .post('/api/banxa/get-orders', {
          params: {
            start_date: oneYearAgo,
            end_date: today,
            per_page: 50,
          },
        })
        .catch(() => setError('Unable to fetch orders. Please try again later'))
      setLoading(false)
      if (res) {
        setOrders(res.data.data.orders)
      }
    }
    fetchOrders()
  }, [])

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

        <section className="mt-2 grow bg-white rounded-md py-4 overflow-auto flex justify-center scrollbar-thin scrollbar-thumb-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 max-w-6xl w-full">
            <button onClick={() => router.push('/create-order')} className="flex items-center -mx-4 text-sm">
              <ChevronLeftIcon className="w-5 h-5 ml-2" />
              <div>Back</div>
            </button>
            <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Trade
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                    >
                      Source
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                    >
                      Target
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Expand</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders && orders.length > 0 ? (
                    orders.map((order, id) => {
                      const displayText =
                        order.order_type === 'CRYPTO-BUY'
                          ? {
                              trade: `${order.fiat_code} TO ${order.coin_code}`,
                              source: `${order.fiat_amount} ${order.fiat_code}`,
                              target: `${order.coin_amount} ${order.coin_code}`,
                              origin: order.fiat_code,
                              end: order.coin_code,
                            }
                          : {
                              trade: `${order.coin_code} TO ${order.fiat_code}`,
                              target: `${order.fiat_amount} ${order.fiat_code}`,
                              source: `${order.coin_amount} ${order.coin_code}`,
                              origin: order.coin_code,
                              end: order.fiat_code,
                            }
                      return (
                        <tr className="cursor-pointer" key={id} onClick={() => router.push(`/order/${order.id}`)}>
                          <td className="w-2/5 max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                            {displayText.trade}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">Source</dt>
                              <dd className="mt-1 truncate text-gray-700 sm:hidden">
                                {`${parseFloat(displayText.source).toFixed(2)} ${displayText.origin}`}
                              </dd>
                              <dt className="sr-only sm:hidden">Email</dt>
                              <dd className="mt-1 truncate text-gray-700 sm:hidden">
                                {`${parseFloat(displayText.target).toFixed(3)} ${displayText.end}`}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{displayText.source}</td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{displayText.target}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <OrderStatus orderStatus={order.status as ORDER_STATUS} />
                          </td>
                          <td>
                            <ChevronRightIcon className="w-5 h-5 text-blue-600" />
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr className="text-center text-base p-4">
                      <td colSpan={4} className="p-4">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export interface Order {
  account_id: string
  account_reference: string
  blockchain: {
    code: string
    description: string
  }
  coin_amount: number
  coin_code: string
  commission: number
  completed_at: string | null
  country: string
  created_at: string
  created_date: string
  fee: number
  fee_tax: number
  fiat_amount: number
  fiat_code: string
  id: string
  merchant_commission: number
  merchant_fee: number
  order_type: string
  payment_fee: number
  payment_fee_tax: number
  payment_type: string
  status: string
  tx_hash: string
  wallet_address: string
  finalize_status: string
}
