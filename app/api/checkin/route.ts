import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCode } = body

    // Find booking by QR code
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, users(full_name)')
      .eq('qr_code', qrCode)
      .single()

    if (bookingError) throw bookingError

    if (booking.checked_in) {
      return NextResponse.json(
        { error: 'Ticket already checked in' },
        { status: 400 }
      )
    }

    // Mark as checked in
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', booking.id)
      .select('*, users(full_name)')

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      attendee: updatedBooking[0].users.full_name,
      timestamp: updatedBooking[0].checked_in_at,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
