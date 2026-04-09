import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )

    // Find booking by QR code, join user + event + ticket tier
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        users(full_name, email),
        events(title),
        ticket_tiers(name)
      `)
      .eq('qr_code', qrCode)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Invalid ticket — QR code not found' }, { status: 404 })
    }

    if (booking.payment_status !== 'confirmed') {
      return NextResponse.json({ error: 'Ticket payment not confirmed' }, { status: 400 })
    }

    if (booking.checked_in) {
      return NextResponse.json(
        {
          error: 'Ticket already checked in',
          attendee: booking.users?.full_name ?? 'Unknown',
          event: booking.events?.title,
          tier: booking.ticket_tiers?.name,
          checkedInAt: booking.checked_in_at,
        },
        { status: 400 }
      )
    }

    // Mark as checked in
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('id', booking.id)
      .select(`*, users(full_name), events(title), ticket_tiers(name)`)
      .single()

    if (updateError || !updated) throw updateError

    return NextResponse.json({
      success: true,
      attendee: updated.users?.full_name ?? 'Attendee',
      event: updated.events?.title,
      tier: updated.ticket_tiers?.name,
      timestamp: updated.checked_in_at,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
