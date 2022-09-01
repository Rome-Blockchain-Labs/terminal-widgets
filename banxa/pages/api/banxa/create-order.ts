import axios, { AxiosError } from 'axios'
import { collection } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { postRequest } from 'utils/banxa/postRequest'
import { PATH } from 'utils/banxa/types'
import { db } from 'utils/firebase'

const orderRef = collection(db, 'orders')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const options = postRequest(PATH.CREATE_ORDER, res, req.body.params)
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
