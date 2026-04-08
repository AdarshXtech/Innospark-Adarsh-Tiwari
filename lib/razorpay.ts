import axios from 'axios'

const razorpayInstance = axios.create({
  baseURL: 'https://api.razorpay.com/v1',
  auth: {
    username: process.env.RAZORPAY_KEY_ID!,
    password: process.env.RAZORPAY_KEY_SECRET!,
  },
})

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export async function createRazorpayOrder(
  amount: number,
  receipt: string
): Promise<RazorpayOrder> {
  const response = await razorpayInstance.post('/orders', {
    amount,
    currency: 'INR',
    receipt,
  })
  return response.data
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const crypto = require('crypto')
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}
