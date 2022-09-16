import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from 'utils/hash'
import bcrypt from 'bcrypt'
import { setCookie } from 'cookies-next'

const accountRef = db.collection('accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()
  const docSnap = await accountRef.doc(account_reference).get()
  if (docSnap.exists) {
    res.status(400).send('Account already exists.')
  } else {
    const salt = await bcrypt.genSalt(10)
    // now we set user password to hashed password
    const password = await bcrypt.hash(req.body.params.password, salt)
    await accountRef.doc(account_reference).create({
      email: req.body.params.email,
      password,
      banxaPromotion: req.body.params.banxaPromotion,
      RBLPromotion: req.body.params.RBLPromotion,
    })

    // used as a check that the user is logged in because account_refrence isnt acccessible using client side js
    setCookie('banxa', 'true', {
      req,
      res,
      maxAge: 60 * 60 * 24,
    })
    //makes sure the account_reference can only be used within romterminal domain
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
