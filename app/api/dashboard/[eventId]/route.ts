import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', params.eventId)
      .single()

    if (eventError) throw eventError

    // Get ticket tiers
    const { data: tiers, error: tiersError } = await supabase
      .from('ticket_tiers')
      .select('*')
      .eq('event_id', params.eventId)

    if (tiersError) throw tiersError

    // Get booking stats
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*, users(full_name)')
      .eq('event_id', params.eventId)

    if (bookingsError) throw bookingsError

    // Calculate metrics
    const totalTicketsSold = bookings.length
    const totalRevenue = bookings
      .filter((b) => b.payment_status === 'confirmed')
      .reduce((sum, b) => {
        const tier = tiers.find((t) => t.id === b.ticket_tier_id)
        return sum + (tier?.price || 0)
      }, 0)
    const checkedIn = bookings.filter((b) => b.checked_in).length
    const checkInRate =
      totalTicketsSold > 0 ? (checkedIn / totalTicketsSold) * 100 : 0

    return NextResponse.json({
      event,
      tiers,
      bookings,
      metrics: {
        totalTicketsSold,
        totalRevenue,
        checkedIn,
        checkInRate,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
