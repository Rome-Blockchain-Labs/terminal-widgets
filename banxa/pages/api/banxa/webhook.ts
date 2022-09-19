import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosRequestConfig } from 'axios'
import generateHmac from 'utils/banxa/generateHmac'
import { PATH } from 'utils/banxa/types'
import { db } from 'utils/firebase'
import { Order } from 'pages/orders'
import { transporter } from 'utils/mailer'

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
  const { account_reference, coin_code, fiat_code, blockchain }: Order = response.data.data.order
  const accountRef = await db.collection('accounts')

  const docSnap = await accountRef.doc(account_reference).get()

  const account = docSnap.data()

  if (!account) {
    return res.status(400).send('invalid  account')
  }

  const html = generateHTML({ coin_code, fiat_code, blockchain: blockchain.description })

  const msg = {
    to: account.email,
    from: 'noreply@rometerminal.io',
    subject: 'Order Ready For Payment',
    text: `Hey RBL Trader! Get ready to complete your ${coin_code} / ${fiat_code} order on Banxa. Since you have already completed your KYC and been approved by Banxa, you are only three steps away from a successful sell order on ${blockchain.description}: 1. Open your BANXA widget on https://app.rometerminal.io 2. Connect your preferred wallet to the BANXA widget 3. Click “Complete Order”.Happy Trading, Rome Terminal Team *Further transaction details are not included in this communication for your privacy and security`,
    html,
  }
  try {
    await transporter.send(msg)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Unable to send email')
  }

  return res.status(200).send('User successfully notified')
}

export function generateSignature(query: PATH, payload: Record<string, string>) {
  const nonce = Date.now()
  const method = 'POST'
  const stringifiedPayload = JSON.stringify(payload)
  const data = method + '\n' + query + '\n' + nonce + '\n' + stringifiedPayload

  return generateHmac(data, nonce)
}

const generateHTML = ({
  coin_code,
  fiat_code,
  blockchain,
}: {
  coin_code: string
  fiat_code: string
  blockchain: string
}) => {
  return `
<html>
<body>
  <table
    style="max-width: 600px; margin: auto; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <tbody>
      <tr style="background: black">
        <td align="center">
            <img
              src="https://storage.googleapis.com/rometerminal-prod-lander/assets/images/header-email.png"
              alt="RBL Logo"
              width="100%"
              height="auto"
            />
        </td>
      </tr>
      <tr >
        <td>
          <div
            style="margin-top:40px; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            Hey RBL Trader!</div>

          <div
            style="margin-top:40px; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            Get ready to complete your ${coin_code} / ${fiat_code} order on Banxa.</div>

          <div
            style="margin-top:20px; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            Since you have already completed your KYC and been approved by Banxa, you are only three steps away from a successful sell order on ${blockchain}</div>

          <div
            style="margin-top:20px; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <ol>
            <li>Open your BANXA widget on <a href="https://app.rometerminal.io">Rome Terminal</a> </li>
            <li>
              Click history
            </li>
            <li>
              Select the sell order that is waiting for payment
            </li>
            <li>
              Click "Finalize Transaction Button"
            </li>
          </ol>  
          </div>

      

          <div
            style="margin-top:40px; font-weight:bold; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            Happy Trading,</div>

          <div
            style="margin-top:10px; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            Rome Terminal Team</div>
       <div
            style="margin-top:20px; font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <i>*Further transaction details are not included in this communication for your privacy and security</i></div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  `
}
