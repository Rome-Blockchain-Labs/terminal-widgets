import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import generateHmac from './generateHmac'
import type { NextApiResponse } from 'next'

export async function getOrderRequest(res: NextApiResponse, orderID: string) {
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
    return res.status(200).json({ data: response.data.data })
  } catch (error) {
    const err = error as AxiosError
    if (err.response) {
      return res.status(err.response.status).json({ data: err.response.data })
    }
    return res.status(400)
  }
}
