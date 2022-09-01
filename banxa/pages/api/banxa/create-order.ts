import type { NextApiRequest, NextApiResponse } from 'next'
import { postRequest } from 'utils/banxa/postRequest'
import { PATH } from 'utils/banxa/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await postRequest(PATH.CREATE_ORDER, res, req.body.params)
}
