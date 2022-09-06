import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequest } from 'utils/banxa/getRequest'
import { PATH } from 'utils/banxa/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await getRequest(PATH.GET_ORDERS, res, req.body.params)
  // get all orders for account reference in banxa
  // get all orders for account reference in firebase
  // map through all orders from banxa and add status property
  // return new array
}
