import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteCookie } from 'cookies-next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie('account_reference', { req, res })

  deleteCookie('banxa', { req, res })

  res.status(200).send('logout success')
}
