import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string)
const app2 = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
export const db = getFirestore(app2)
