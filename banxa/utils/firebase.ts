import admin from 'firebase-admin'
import { getApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string)
const app =
  getApps().length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    : getApp()
export const db = getFirestore(app)
