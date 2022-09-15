import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { postRequest } from 'utils/banxa/postRequest'
import { PATH } from 'utils/banxa/types'

// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, getDoc, doc, setDoc } from 'firebase/firestore'
// import 'firebase/firestore'
//TODO replace firebaseConfig with production configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyAVONBlUSyKRG3JnFxkNLfLNXJaNby7f7g',
//   authDomain: 'test-bf9a8.firebaseapp.com',
//   projectId: 'test-bf9a8',
//   storageBucket: 'test-bf9a8.appspot.com',
//   messagingSenderId: '396035683518',
//   appId: '1:396035683518:web:fa2ac8adc0a496b65d1aef',
//   measurementId: 'G-D5JPSMMP3R',
// }

// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)
// const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const docSnap = await getDoc(doc(accountRef, req.body.params.email))

  // if (docSnap.exists()) {
  //   const accountReference = docSnap.data().account_reference
  //   if (accountReference !== req.body.params.account_reference) {
  //     await setDoc(doc(accountRef, req.body.params.email), {
  //       account_reference: req.body.params.account_reference,
  //     })
  //   }
  // } else {
  //   await setDoc(doc(accountRef, req.body.params.email), {
  //     account_reference: req.body.params.account_reference,
  //   })
  // }
  const { params } = req.body
  const account_reference = getCookie('account_reference', { req, res })
  params.account_reference = account_reference

  await postRequest(PATH.CREATE_ORDER, res, params)
}
