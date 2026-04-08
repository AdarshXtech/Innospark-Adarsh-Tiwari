import { supabase } from '@/lib/supabase'
import { verifyPayment } from '@/lib/razorpay'
import { sendBookingConfirmation } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Verify payment signature
    const isValid = await verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Find booking by payment_id
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, users(email, full_name), events(title)')
      .eq('payment_id', razorpay_order_id)
      .single()

    if (bookingError) throw bookingError

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(booking.id)

    // Update booking with confirmed status and QR code
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'confirmed',
        qr_code: qrCodeData,
      })
      .eq('id', booking.id)
      .select()

    if (updateError) throw updateError

    // Send confirmation email
    await sendBookingConfirmation(
      booking.users.email,
      booking.users.full_name,
      booking.events.title,
      qrCodeData
    )

    return NextResponse.json(updatedBooking[0])
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
