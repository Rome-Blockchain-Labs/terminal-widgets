import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteCookie } from 'cookies-next'
import { ACCOUNT_REFERENCE_COOKIE } from 'constants/cookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie(ACCOUNT_REFERENCE_COOKIE, { req, res })

  deleteCookie('banxa', { req, res })

  res.status(200).send('logout success')
}
