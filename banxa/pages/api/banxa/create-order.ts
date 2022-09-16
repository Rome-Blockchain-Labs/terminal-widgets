import axios, { AxiosError } from 'axios'
import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { postRequest } from 'utils/banxa/postRequest'
import { PATH } from 'utils/banxa/types'
import { db } from 'utils/firebase'

const orderRef = db.collection('orders')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params } = req.body
  const account_reference = getCookie('account_reference', { req, res })
  params.account_reference = account_reference

  const options = postRequest(PATH.CREATE_ORDER, params)
  try {
    const response = await axios(options)
    const { order } = response.data.data
    await orderRef.doc(order.id).create({
      account_reference: order.account_reference,
    })

    return res.status(200).json({ data: response.data.data })
  } catch (error) {
    const err = error as AxiosError
    if (err.response) {
      return res.status(err.response.status).json({ data: err.response.data })
    }
    return res.status(400)
  }
}
