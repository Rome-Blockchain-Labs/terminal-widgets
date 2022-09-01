import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import 'firebase/firestore'

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
export const db = getFirestore(app)
