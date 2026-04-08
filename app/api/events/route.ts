import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const radius = searchParams.get('radius')
  const dateFrom = searchParams.get('dateFrom')

  try {
    let query = supabase.from('events').select('*').eq('status', 'published')

    if (category) query = query.eq('category', category)
    if (dateFrom) query = query.gte('event_date', dateFrom)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          ...body,
          status: 'draft',
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
