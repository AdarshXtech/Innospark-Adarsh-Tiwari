export const runtime = 'edge'
import { supabase } from '@/lib/supabase'
import { verifyPayment } from '@/lib/razorpay'
import { sendBookingConfirmation } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    // ✅ Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      )
    }

    // ✅ Verify payment signature
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

    // ✅ Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, users(email, full_name), events(title)')
      .eq('payment_id', razorpay_order_id)
      .single()

    if (bookingError || !booking) {
      throw new Error('Booking not found')
    }

    // ✅ Generate QR code safely
    const qrCodeData = await QRCode.toDataURL(booking.id)

    // ✅ Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'confirmed',
        qr_code: qrCodeData,
      })
      .eq('id', booking.id)
      .select()

    if (updateError || !updatedBooking?.[0]) {
      throw new Error('Failed to update booking')
    }

    // ✅ Send email (safe — runs only at runtime)
    try {
      await sendBookingConfirmation(
        booking.users.email,
        booking.users.full_name,
        booking.events.title,
        qrCodeData
      )
    } catch (emailError) {
      console.error('Email failed:', emailError)
      // Don't block success if email fails
    }

    // ✅ Return response
    return NextResponse.json(updatedBooking[0])
  } catch (error) {
    console.error('Booking verify error:', error)

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}