import type { NextApiRequest, NextApiResponse } from 'next'
import { stringToHash } from '../../../utils/hash'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email)
  return res.status(200).json({ account_reference })
}
