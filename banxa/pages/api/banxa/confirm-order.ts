import axios, { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { postRequest } from 'utils/banxa/postRequest'
import { PATH } from 'utils/banxa/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const CONFIRM_ORDER = `/api/orders/${req.body.params.order_id}/confirm` as PATH
  const { params } = req.body
  delete params.order_id
  const options = postRequest(CONFIRM_ORDER, req.body.params)
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
