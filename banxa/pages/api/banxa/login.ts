import { collection, getDoc, doc, setDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from '../../../utils/hash'

const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()
  const docSnap = await getDoc(doc(accountRef, account_reference))

  if (docSnap.exists()) {
    res.status(200).json({ account_reference })
  } else {
    await setDoc(doc(accountRef, account_reference), {
      email: req.body.params.email,
    })

    res.status(200).json({ account_reference })
  }
}
