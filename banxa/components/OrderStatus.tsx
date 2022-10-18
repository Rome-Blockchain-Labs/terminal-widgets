import React from 'react'
import { ORDER_STATUS } from './Transaction'
import { classNames } from '../utils/style'

interface OrderStatusProps {
  orderStatus: ORDER_STATUS
}
const OrderStatus = ({ orderStatus }: OrderStatusProps) => {
  const status = StatusMapping.find((s) => s.status === orderStatus)
  if (!status) {
    return null
  }
  const background =
    status.color === 'warning'
      ? 'bg-warning-bg border-warning-border'
      : status.color === 'info'
      ? 'bg-info-bg border-info-border'
      : status.color === 'success'
      ? 'bg-success-bg border-success-border'
      : 'bg-error-bg border-error-border'
  return (
    <div
      className={classNames(
        background,
        'bg-success-bg border-success-border border w-fit  min-w-[140px] px-3 py-1 text-center'
      )}
    >
      {status.text}
    </div>
  )
}

export default OrderStatus

export const StatusMapping = [
  { status: ORDER_STATUS.PENDING_PAYMENT, color: 'warning', text: 'Pending Payment' },
  { status: ORDER_STATUS.WAITING_PAYMENT, color: 'warning', text: 'Waiting Payment' },
  { status: ORDER_STATUS.PAYMENT_RECEIVED, color: 'info', text: 'Payment Received' },
  { status: ORDER_STATUS.IN_PROGRESS, color: 'info', text: 'In Progress' },
  { status: ORDER_STATUS.COIN_TRANSFERRED, color: 'info', text: 'Coin Transferred' },
  { status: ORDER_STATUS.CANCELLED, color: 'error', text: 'Cancelled' },
  { status: ORDER_STATUS.DECLINED, color: 'error', text: 'Declined' },
  { status: ORDER_STATUS.EXPIRED, color: 'error', text: 'Expired' },
  { status: ORDER_STATUS.COMPLETE, color: 'success', text: 'Complete' },
  { status: ORDER_STATUS.REFUNDED, color: 'success', text: 'Refunded' },
]
