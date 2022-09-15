import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'
import { stringToHash } from 'utils/hash'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { transporter } from 'utils/mailer'

const accountRef = db.collection('accounts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const account_reference = stringToHash(req.body.params.email).toString()

  const docSnap = await accountRef.doc(account_reference).get()
  if (!docSnap.exists) {
    return res.status(400).send('Email is not associated to any account')
  }
  const expiryDate = dayjs().add(3, 'hour').toISOString()
  const resetToken = nanoid()
  await accountRef.doc(account_reference).update({
    resetToken,
    expiryDate,
  })
  const html = generateHTML(`${process.env.BASE_URL}/reset-password?resetToken=${resetToken}`)
  await transporter.sendMail({
    subject: 'Banxa - RomeTerminal Password Reset',
    to: req.body.params.email,
    from: 'noreply@rometerminal.io',
    text: "Hey RBL Trader! We have received your password reset request. Please click the link below to update your password. If you didn't request for a password reset, please disregard this email notificaiton. Happy Trading, Rome Terminal Team",
    html,
  })

  res.status(200).send('Password reset link sent')
}
const generateHTML = (passwordResetLink: string) => {
  return `
<html>
  <body>
    <table
      style="
        max-width: 600px;
        margin: auto;
        font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      "
    >
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
        <tr>
          <td>
            <div
              style="
                margin-top: 40px;
                font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              "
            >
              Hey RBL Trader!
            </div>

            <div
              style="
                margin-top: 40px;
                font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              "
            >
              We have received your password reset request. Please click the link below to update your password. If you
              didn't request for a password reset, please disregard this email notificaiton.
            </div>

            <div style="margin-top: 20px">
              <a
                href="${passwordResetLink}"
                style="font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif"
              >
                ${passwordResetLink}
              </a>
            </div>

            <div
              style="
                margin-top: 40px;
                font-weight: bold;
                font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              "
            >
              Happy Trading,
            </div>

            <div
              style="
                margin-top: 10px;
                font-family: 'Lato Extended', 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              "
            >
              Rome Terminal Team
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

  `
}
