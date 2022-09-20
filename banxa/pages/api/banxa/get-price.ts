import type { NextApiRequest, NextApiResponse } from 'next'
import { getPriceRequest } from 'utils/banxa/getPriceRequest'
import { PATH } from 'utils/banxa/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await getPriceRequest(PATH.GET_PRICES, res, req.body.params)
}
