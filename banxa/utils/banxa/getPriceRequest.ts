import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import generateHmac from './generateHmac'
import type { NextApiResponse } from 'next'
import { PATH } from './types'

export async function getPriceRequest(query: PATH, res: NextApiResponse, params?: Record<string, string>) {
  const nonce = Date.now()
  const method = 'GET'
  let data: string
  let queryWithParams: string | undefined
  if (params) {
    const queryString = new URLSearchParams(params).toString()
    queryWithParams = query + '?' + queryString
    data = method + '\n' + queryWithParams + '\n' + nonce
  } else {
    data = method + '\n' + query + '\n' + nonce
  }

  const hmac = generateHmac(data, nonce)
  const options: AxiosRequestConfig = {
    baseURL: process.env.BANXA_DOMAIN,
    url: queryWithParams ? queryWithParams : query,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + hmac,
    },
  }
  try {
    const response = await axios(options)
    // const spotPrice = response.data.data.spot_price
    const order = response.data.data.prices[0]
    // const netFiatAmount = order.fiat_amount - order.fee_amount
    // const netCoinAmount = netFiatAmount / spotPrice
    // order.coin_amount = netCoinAmount
    return res.status(200).json({ ...order })
  } catch (error) {
    const err = error as AxiosError
    if (err.response) {
      return res.status(err.response.status).json({ data: err.response.data })
    }
    return res.status(400)
  }
}
