'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

const PLATFORM_FEE = 20

interface Event {
  id: string
  title: string
  event_date: string
  venue: string
  ticket_tiers: { id: string; name: string; price: number }[]
}

export default function CheckoutPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [eventLoading, setEventLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then(r => r.json())
      .then(data => { setEvent(data); setEventLoading(false) })
      .catch(() => { setError('Failed to load event.'); setEventLoading(false) })
  }, [eventId])

  const tier = event?.ticket_tiers?.[0]
  const price = tier?.price ?? 0
  const total = price + PLATFORM_FEE

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePay = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all contact details.')
      return
    }
    if (!event) {
      setError('Event data not loaded. Please refresh.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Failed to load Razorpay SDK')

      // Create order on server
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          ticketTierId: tier?.id ?? null,
          quantity: 1,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      const { razorpayOrder } = data

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'LocalTix',
        description: event.title,
        order_id: razorpayOrder.id,
        prefill: { name, email, contact: phone },
        theme: { color: '#7c6af7' },
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch('/api/bookings/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (verifyRes.ok) {
            window.location.href = '/my-tickets'
          } else {
            setError('Payment verification failed. Contact support.')
          }
          setLoading(false)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on_surface_variant text-sm">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || 'Event not found.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <a href={`/events/${eventId}`} className="label-micro text-on_surface_variant hover:text-on_surface transition-colors">← Back</a>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-14">
        <p className="label-micro text-primary mb-3">Almost there</p>
        <h1 className="font-editorial text-display-sm text-on_surface mb-12 leading-tight">
          Complete your<br />booking.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-surface_container_low rounded-2xl p-6">
              <p className="label-micro text-on_surface_variant mb-5">Contact information</p>
              <div className="space-y-4">
                <div>
                  <label className="label-micro text-on_surface_variant block mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-editorial w-full px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="label-micro text-on_surface_variant block mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-editorial w-full px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="label-micro text-on_surface_variant block mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-editorial w-full px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface_container_low rounded-2xl p-6">
              <p className="label-micro text-on_surface_variant mb-3">Payment</p>
              <p className="text-on_surface_variant text-sm">Powered by Razorpay — UPI, Cards, Net Banking supported.</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-primary w-full py-4 text-white font-semibold text-sm rounded-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${total} & Confirm Booking`}
            </button>
            <p className="label-micro text-on_surface_variant text-center -mt-4">
              SSL secured · Your data is never stored
            </p>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-surface_container_low rounded-2xl p-6 sticky top-24">
              <p className="label-micro text-on_surface_variant mb-5">Order summary</p>

              <div className="bg-surface_container rounded-xl p-4 mb-5">
                <div
                  className="h-24 rounded-lg mb-3"
                  style={{ background: 'linear-gradient(135deg, #141821 0%, #1e2438 100%)' }}
                />
                <h3 className="font-editorial text-lg text-on_surface leading-tight mb-1">{event.title}</h3>
                <p className="label-micro text-on_surface_variant">{event.event_date}</p>
                <p className="label-micro text-on_surface_variant mt-0.5">{event.venue}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-on_surface_variant text-sm">{tier?.name ?? 'General Admission'} × 1</span>
                  <span className="text-on_surface text-sm">₹{price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on_surface_variant text-sm">Platform fee</span>
                  <span className="text-on_surface text-sm">₹{PLATFORM_FEE}</span>
                </div>
              </div>

              <div className="my-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

              <div className="flex justify-between">
                <span className="text-on_surface font-semibold">Total</span>
                <span className="font-editorial text-2xl text-on_surface">₹{total}</span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="label-micro text-on_surface_variant">Instant e-ticket on confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
