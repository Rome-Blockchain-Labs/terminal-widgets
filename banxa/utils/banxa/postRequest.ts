import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import generateHmac from './generateHmac'
import type { NextApiResponse } from 'next'
import { PATH } from './types'

export function postRequest(query: PATH, res: NextApiResponse, payload: Record<string, string>) {
  const nonce = Date.now()
  const method = 'POST'
  const stringifiedPayload = JSON.stringify(payload)
  const data = method + '\n' + query + '\n' + nonce + '\n' + stringifiedPayload

  const hmac = generateHmac(data, nonce)
  const options: AxiosRequestConfig = {
    baseURL: process.env.BANXA_DOMAIN,
    url: query,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + hmac,
    },
    data: payload,
  }
  return options
}
