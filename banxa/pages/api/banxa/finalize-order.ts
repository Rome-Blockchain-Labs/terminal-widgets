import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'utils/firebase'

const orderRef = db.collection('orders')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await orderRef.doc(req.body.params.orderID).update({
      status: 'active',
    })
  } catch {
    return res.status(400).json({ error: 'Order is invalid' })
  }
  return res.status(200).send('Order finalized')
}
