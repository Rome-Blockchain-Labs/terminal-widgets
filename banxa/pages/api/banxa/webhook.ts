import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'
import axios, { AxiosRequestConfig } from 'axios'
import generateHmac from 'utils/banxa/generateHmac'
import { PATH } from 'utils/banxa/types'
import { collection, doc, getDoc } from 'firebase/firestore'
import { db } from 'utils/firebase'

const accountRef = collection(db, 'accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderID = req.body.order_id

  const nonce = Date.now()
  const method = 'GET'

  const data = method + '\n' + '/api/orders/' + orderID + '\n' + nonce

  const hmac = generateHmac(data, nonce)
  const options: AxiosRequestConfig = {
    baseURL: process.env.BANXA_DOMAIN,
    url: '/api/orders/' + orderID,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + hmac,
    },
  }
  const response = await axios(options)
  const { account_reference } = response.data.data.order

  const docSnap = await getDoc(doc(accountRef, account_reference))

  const account = docSnap.data()

  if (!account) {
    return res.status(400).send('invalid  account')
  }

  const APIKey = process.env.SENDGRID_API_KEY
  if (!APIKey) throw new Error('SENDGRID_API_KEY not found')
  sgMail.setApiKey(APIKey)
  const msg = {
    to: account.email, // Change to your recipient
    from: 'ian@romeblockchain.com', // Change to your verified sender
    subject: 'Order Ready For Payment',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  try {
    await sgMail.send(msg)
  } catch {
    res.status(400).send('Unable to send email')
  }

  res.status(200).send('User successfully notified')
}

export function generateSignature(query: PATH, payload: Record<string, string>) {
  const nonce = Date.now()
  const method = 'POST'
  const stringifiedPayload = JSON.stringify(payload)
  const data = method + '\n' + query + '\n' + nonce + '\n' + stringifiedPayload

  return generateHmac(data, nonce)
}
