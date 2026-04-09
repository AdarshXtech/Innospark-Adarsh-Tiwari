'use client'

import { useState } from 'react'

const TICKETS = [
  { type: 'Early Bird',        price: '₹499',   amount: 499,  note: 'Limited' },
  { type: 'General Admission', price: '₹799',   amount: 799,  note: '' },
  { type: 'VIP Lounge',        price: '₹1,999', amount: 1999, note: 'Includes F&B' },
]

export default function EventDetailsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedTicket = TICKETS.find((t) => t.type === selected)
  return (
    <div className="min-h-screen bg-surface">
      {/* Glass nav */}
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <a href="/explore" className="label-micro text-on_surface_variant hover:text-on_surface transition-colors">← Back to Explore</a>
      </nav>

      {/* Hero image area — real photo */}
      <div className="relative h-[60vh] overflow-hidden img-zoom">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80"
          alt="Monsoon Beats Festival"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        {/* Floating tags */}
        <div className="absolute top-6 left-8 flex gap-2 animate-fade-in">
          <span className="ai-pulse-chip active px-3 py-1.5 rounded-full label-micro text-primary">✦ 96% Match</span>
          <span className="label-micro text-on_surface_variant bg-surface_container_low/80 backdrop-blur px-3 py-1.5 rounded-full">Music · Live</span>
        </div>
        {/* Overlap title */}
        <div className="absolute bottom-0 left-0 right-0 px-8 lg:px-20 pb-10 animate-fade-up">
          <p className="label-micro text-primary mb-2">APR 20, 2026 · 7:00 PM</p>
          <h1 className="font-editorial text-display-md text-on_surface leading-tight max-w-2xl">
            Monsoon Beats Festival
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 lg:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Meta row */}
            <div className="flex flex-wrap gap-6 animate-fade-up">
              {[
                ['Venue', 'Bandra Amphitheatre, Mumbai'],
                ['Duration', '4 hours'],
                ['Audience', '2,000 expected'],
              ].map(([key, val]) => (
                <div key={key} className="skeuo-raised rounded-xl px-4 py-3">
                  <p className="label-micro text-on_surface_variant mb-1">{key}</p>
                  <p className="text-on_surface text-sm font-medium">{val}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="animate-fade-up delay-100">
              <h2 className="font-editorial text-2xl text-on_surface mb-4">About the event</h2>
              <p className="text-on_surface_variant leading-relaxed text-base">
                Monsoon Beats is an immersive open-air music festival celebrating the vibrancy of
                Indian contemporary music. Set against the backdrop of Mumbai's iconic skyline,
                the night features curated sets from indie artists, live percussion, and ambient
                light installations that pulse with the rhythm of the crowd.
              </p>
              <p className="text-on_surface_variant leading-relaxed text-base mt-4">
                Doors open at 6:30 PM. Food and beverages available on site. Rain-or-shine event.
              </p>
            </div>

            {/* Artists */}
            <div className="animate-fade-up delay-200">
              <h2 className="font-editorial text-2xl text-on_surface mb-5">Performing Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Prateek Kuhad', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80' },
                  { name: 'When Chai Met Toast', img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&q=80' },
                  { name: 'Naezy', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&q=80' },
                  { name: 'Ritviz', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100&q=80' },
                  { name: 'Seedhe Maut', img: 'https://images.unsplash.com/photo-1501386761578-eaa54b6103c0?w=100&q=80' },
                ].map((artist, idx) => (
                  <div
                    key={artist.name}
                    className={`skeuo-raised rounded-xl px-4 py-3 flex items-center gap-3 group cursor-pointer animate-fade-up delay-${(idx + 1) * 100}`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-on_surface text-sm font-medium group-hover:text-primary_container transition-colors">{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue image */}
            <div className="animate-fade-up delay-300">
              <h2 className="font-editorial text-2xl text-on_surface mb-4">Venue</h2>
              <div className="w-full h-52 rounded-2xl overflow-hidden img-zoom relative">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80"
                  alt="Bandra Amphitheatre"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-on_surface text-sm font-medium">Bandra Amphitheatre</p>
                  <p className="label-micro text-on_surface_variant mt-0.5">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket sidebar */}
          <div className="lg:col-span-1">
            <div className="skeuo-raised rounded-2xl p-6 sticky top-24 animate-scale-in delay-200">
              <p className="label-micro text-on_surface_variant mb-4">Select tickets</p>
              <div className="space-y-3">
                {TICKETS.map((ticket) => {
                  const isSelected = selected === ticket.type
                  return (
                    <div
                      key={ticket.type}
                      onClick={() => setSelected(ticket.type)}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{
                        background: isSelected ? 'rgba(124,106,247,0.12)' : 'var(--surface-mid)',
                        outline: isSelected ? '1.5px solid rgba(124,106,247,0.6)' : '1px solid rgba(124,106,247,0.08)',
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* Radio indicator */}
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                            style={{
                              border: isSelected ? '2px solid #7c6af7' : '2px solid rgba(255,255,255,0.2)',
                              background: isSelected ? '#7c6af7' : 'transparent',
                            }}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className="text-on_surface text-sm font-medium">{ticket.type}</p>
                            {ticket.note && (
                              <p className="label-micro text-primary mt-0.5">{ticket.note}</p>
                            )}
                          </div>
                        </div>
                        <p className="font-editorial text-lg" style={{ color: isSelected ? '#7c6af7' : 'var(--text)' }}>
                          {ticket.price}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(124,106,247,0.12)' }}>
                {selectedTicket ? (
                  <div className="flex items-center justify-between mb-4">
                    <span className="label-micro text-on_surface_variant">Selected</span>
                    <span className="text-sm font-semibold text-primary">{selectedTicket.type} · {selectedTicket.price}</span>
                  </div>
                ) : (
                  <p className="label-micro text-on_surface_variant text-center mb-4">Pick a ticket tier above</p>
                )}
                <a
                  href={selected ? '/checkout/1' : '#'}
                  onClick={(e) => { if (!selected) e.preventDefault() }}
                  className="btn-primary block text-center py-3.5 text-white font-semibold text-sm rounded-full transition-all"
                  style={{ opacity: selected ? 1 : 0.4, pointerEvents: selected ? 'auto' : 'none' }}
                >
                  Proceed to Checkout
                </a>
                <p className="label-micro text-on_surface_variant text-center mt-3">
                  Secure payment · Instant confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
