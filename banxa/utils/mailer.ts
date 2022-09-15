import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
})
