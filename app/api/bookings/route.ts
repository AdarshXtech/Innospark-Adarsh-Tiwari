import { createServerClient } from '@supabase/ssr'
import { createRazorpayOrder } from '@/lib/razorpay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ticketTierId, eventId, quantity } = body
    const userId = user.id

    // Get ticket tier details
    const { data: tier, error: tierError } = await supabase
      .from('ticket_tiers')
      .select('*')
      .eq('id', ticketTierId)
      .single()

    if (tierError) throw tierError

    const amount = tier.price * quantity

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      amount,
      `booking_${Date.now()}`
    )

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: userId,
          ticket_tier_id: ticketTierId,
          event_id: eventId,
          qr_code: '', // Will be generated after payment confirmation
          payment_id: razorpayOrder.id,
          payment_status: 'pending',
        },
      ])
      .select()

    if (bookingError) throw bookingError

    return NextResponse.json({
      booking: booking[0],
      razorpayOrder,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
