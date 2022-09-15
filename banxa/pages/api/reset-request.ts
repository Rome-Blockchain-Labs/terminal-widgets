import { collection, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from 'utils/hash'
import bcrypt from 'bcrypt'
import { setCookie } from 'cookies-next'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()
  const docSnap = await getDoc(doc(accountRef, account_reference))
  if (!docSnap.exists()) {
    return res.status(400).send('Email is not associated to any account')
  }
  const expiryDate = dayjs().add(3, 'hour').toISOString()
  updateDoc(doc(accountRef), account_reference, {
    resetToken: nanoid(),
    expiryDate,
  })

  res.status(200).send('Password reset link sent')
}
