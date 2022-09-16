import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'

const accountRef = db.collection('accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docSnap = await accountRef.where('resetToken', '==', req.body.params.resetToken).get()

  if (docSnap.docs.length === 0) {
    return res.status(400).send('Invalid reset token')
  }
  const document = docSnap.docs[0]
  const data = document.data()
  const { expiryDate } = data

  const expired = dayjs().isAfter(dayjs(expiryDate))
  if (expired) {
    await document.ref.update({
      resetToken: null,
      expiryDate: null,
    })

    return res.status(400).send('Token has expired')
  }

  const salt = await bcrypt.genSalt(10)
  // now we set user password to hashed password
  const password = await bcrypt.hash(req.body.params.password, salt)

  await document.ref.update({
    password,
    resetToken: null,
    expiryDate: null,
  })

  res.status(200).send('Password changed')
}
