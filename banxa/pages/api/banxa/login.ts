import { collection, getDoc, doc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from '../../../utils/hash'
import bcrypt from 'bcrypt'
import { setCookie } from 'cookies-next'

const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()
  const docSnap = await getDoc(doc(accountRef, account_reference))
  if (docSnap.exists()) {
    const data = docSnap.data()
    const { password } = data
    const validPassword = await bcrypt.compare(req.body.params.password, password)
    if (validPassword) {
      setCookie('banxa', 'true', {
        req,
        res,
        maxAge: 60 * 60 * 24,
      })
      setCookie('account_reference', account_reference, {
        req,
        res,
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
      })
      res.status(200).json({ account_reference })
    } else {
      res.status(400).json({ error: 'password' })
    }
  } else {
    res.status(401).json({ error: 'user' })
  }
}
