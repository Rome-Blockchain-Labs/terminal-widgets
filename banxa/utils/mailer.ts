import sgMail from '@sendgrid/mail'

const APIKey = process.env.SENDGRID_API_KEY
console.log(APIKey)
if (!APIKey) throw new Error('SENDGRID_API_KEY not found')

sgMail.setApiKey(APIKey)
export const transporter = sgMail
