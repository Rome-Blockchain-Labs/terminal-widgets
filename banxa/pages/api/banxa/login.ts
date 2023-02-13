import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from '../../../utils/hash'
import bcrypt from 'bcrypt'
import { setCookie } from 'cookies-next'
import { ACCOUNT_REFERENCE_COOKIE, AUTH_COOKIES_MAX_AGE } from 'constants/cookies'

const accountRef = db.collection('accounts')
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()

  const docSnap = await accountRef.doc(account_reference).get()
  if (docSnap.exists) {
    const data = docSnap.data()
    if (!data) {
      return res.status(400).json({ error: 'no data found' })
    }
    const { password } = data
    const validPassword = await bcrypt.compare(req.body.params.password, password)
    if (validPassword) {
      setCookie(ACCOUNT_REFERENCE_COOKIE, account_reference, {
        req,
        res,
        httpOnly: true,
        maxAge: AUTH_COOKIES_MAX_AGE,
        sameSite: 'none',
        secure: true,
      })
      res.status(200).send('login success')
    } else {
      res.status(400).json({ error: 'password' })
    }
  } else {
    res.status(401).json({ error: 'user' })
  }
}
