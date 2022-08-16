import type { NextApiRequest, NextApiResponse } from 'next'
import { AES } from 'crypto-js'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDoc, doc, setDoc } from 'firebase/firestore'
import 'firebase/firestore'

//TODO replace firebaseConfig with production configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAVONBlUSyKRG3JnFxkNLfLNXJaNby7f7g',
  authDomain: 'test-bf9a8.firebaseapp.com',
  projectId: 'test-bf9a8',
  storageBucket: 'test-bf9a8.appspot.com',
  messagingSenderId: '396035683518',
  appId: '1:396035683518:web:fa2ac8adc0a496b65d1aef',
  measurementId: 'G-D5JPSMMP3R',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docSnap = await getDoc(doc(accountRef, req.body.params.email))
  if (docSnap.exists()) {
    const account_reference = docSnap.data().account_reference
    return res.status(200).json({ data: { account_reference } })
  } else {
    const account_reference = encryptEmail(req.body.params.email)
    await setDoc(doc(accountRef, req.body.params.email), {
      account_reference,
    })
    return res.status(200).json({ data: { account_reference } })
  }
}

const encryptEmail = (email: string) => {
  const SECRET = process.env.SECRET
  if (!SECRET) {
    throw 'process.env.SECRET not found'
  }
  return AES.encrypt(email, SECRET).toString()
}
