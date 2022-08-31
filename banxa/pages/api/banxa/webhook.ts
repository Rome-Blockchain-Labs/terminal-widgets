import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const APIKey = process.env.SENDGRID_API_KEY
  if (!APIKey) throw new Error('SENDGRID_API_KEY not found')
  sgMail.setApiKey(APIKey)
  const msg = {
    to: 'iandjx@gmail.com', // Change to your recipient
    from: 'ian@romeblockchain.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  res.send('email sent')
}
