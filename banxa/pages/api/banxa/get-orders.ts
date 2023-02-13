import { ACCOUNT_REFERENCE_COOKIE } from 'constants/cookies'
import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequest } from 'utils/banxa/getRequest'
import { PATH } from 'utils/banxa/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params } = req.body
  const account_reference = getCookie(ACCOUNT_REFERENCE_COOKIE, { req, res })
  params.account_reference = account_reference

  await getRequest(PATH.GET_ORDERS, res, params)
}
