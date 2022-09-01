import React from 'react'
import { classNames } from '../utils/style'

interface TransactionProps {
  orderStatus: ORDER_STATUS
  fiatCode: string
  fiatAmount: number
  coinCode: string
  coinAmount: number
  orderType: 'BUY' | 'SELL'
}
const Transaction = ({ orderStatus, fiatCode, fiatAmount, coinCode, coinAmount, orderType }: TransactionProps) => {
  const statusEl = StatusMapping.find((s) => s.status === orderStatus)
  const trade =
    orderType === 'BUY'
      ? `${coinAmount} ${coinCode} W/ ${fiatAmount} ${fiatCode}`
      : `${fiatAmount} ${fiatCode} FOR ${coinAmount} ${coinCode}`
  if (!statusEl) {
    return null
  }
  return (
    <div className="w-full flex text-sm  md:text-2xl">
      <div>
        <div
          className={classNames(
            statusEl.color === 'warning'
              ? 'text-yellow-200'
              : statusEl.color === 'error'
              ? 'text-red-300'
              : 'text-green-300',
            'text-base font-bold'
          )}
        >
          {statusEl.text}
        </div>
        <div className="text-bold">{trade}</div>
      </div>
    </div>
  )
}

export default Transaction

export enum ORDER_STATUS {
  PENDING_PAYMENT = 'pendingPayment',
  WAITING_PAYMENT = 'waitingPayment',
  PAYMENT_RECEIVED = 'paymentReceived',
  IN_PROGRESS = 'inProgress',
  COIN_TRANSFERRED = 'coinTransferred',
  CANCELLED = 'cancelled',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  COMPLETE = 'complete',
  REFUNDED = 'refunded',
}

const StatusMapping = [
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
