import { collection, getDoc, doc, setDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from '../../../utils/hash'

const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docSnap = await getDoc(doc(accountRef, req.body.params.email))

  if (docSnap.exists()) {
    res.status(200).json({ account_reference: docSnap.data().account_reference })
  } else {
    const account_reference = stringToHash(req.body.params.email)
    await setDoc(doc(accountRef, req.body.params.email), {
      account_reference,
    })

    res.status(200).json({ account_reference })
  }
}
