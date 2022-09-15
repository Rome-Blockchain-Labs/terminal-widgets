import { collection, getDoc, doc, setDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from 'utils/hash'
import bcrypt from 'bcrypt'
import { setCookie } from 'cookies-next'
const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()
  const docSnap = await getDoc(doc(accountRef, account_reference))
  if (docSnap.exists()) {
    res.status(400).send('Account already exists.')
  } else {
    const salt = await bcrypt.genSalt(10)
    // now we set user password to hashed password
    const password = await bcrypt.hash(req.body.params.password, salt)
    await setDoc(doc(accountRef, account_reference), {
      email: req.body.params.email,
      password,
      promotion: req.body.params.promotion,
    })
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
    res.status(200).send('registration success')
  }
}
