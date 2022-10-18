import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import generateHmac from './generateHmac'
import type { NextApiResponse } from 'next'
import { db } from 'utils/firebase'

const orderRef = db.collection('orders')

export async function getOrderRequest(res: NextApiResponse, orderID: string) {
  const docSnap = await orderRef.doc(orderID).get()

  const order = docSnap.data()
  if (!order) {
    return res.status(400).send('No order found')
  }

  const nonce = Date.now()
  const method = 'GET'

  const data = method + '\n' + '/api/orders/' + orderID + '\n' + nonce

  const hmac = generateHmac(data, nonce)
  const options: AxiosRequestConfig = {
    baseURL: process.env.BANXA_DOMAIN,
    url: '/api/orders/' + orderID,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + hmac,
    },
  }
  try {
    const response = await axios(options)
    const data = response.data.data
    if (order.status) {
      data.order.finalize_status = order.status
    }
    return res.status(200).json({ data })
  } catch (error) {
    const err = error as AxiosError
    if (err.response) {
      return res.status(err.response.status).json({ data: err.response.data })
    }
    return res.status(400)
  }
}
