export default function MyTicketsPage() {
  const tickets = [
    {
      id: 1,
      title: 'Tech Summit 2026',
      date: 'APR 15, 2026',
      time: '10:00 AM',
      venue: 'HICC, Pune',
      type: 'General Admission',
      status: 'confirmed',
      price: '₹999',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    },
    {
      id: 2,
      title: 'Monsoon Beats Festival',
      date: 'APR 20, 2026',
      time: '7:00 PM',
      venue: 'Bandra Amphitheatre, Mumbai',
      type: 'Early Bird',
      status: 'upcoming',
      price: '₹499',
      img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    },
    {
      id: 3,
      title: 'Jazz Under the Stars',
      date: 'APR 12, 2026',
      time: '8:00 PM',
      venue: 'India Habitat Centre, Delhi',
      type: 'VIP',
      status: 'past',
      price: '₹1,499',
      img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
    },
  ]

  const statusStyles: Record<string, { dot: string; label: string; text: string }> = {
    confirmed: { dot: 'bg-primary', label: 'Confirmed', text: 'text-primary' },
    upcoming: { dot: 'bg-on_surface_variant', label: 'Upcoming', text: 'text-on_surface_variant' },
    past: { dot: 'bg-surface_container_highest', label: 'Attended', text: 'text-surface_container_highest' },
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Glass nav */}
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <a href="/explore" className="label-micro text-primary hover:text-primary_container transition-colors">Explore Events</a>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-14">
        <p className="label-micro text-primary mb-3">Your collection</p>
        <h1 className="font-editorial text-display-sm text-on_surface mb-12 leading-tight">
          My Tickets
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-10">
          {['All', 'Upcoming', 'Confirmed', 'Past'].map((tab, i) => (
            <button
              key={tab}
              className={`ai-pulse-chip px-5 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0 ? 'active text-primary' : 'text-on_surface_variant hover:text-on_surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {tickets.map((ticket, idx) => {
            const s = statusStyles[ticket.status]
            return (
              <div key={ticket.id} className={`skeuo-raised rounded-2xl overflow-hidden animate-fade-up delay-${(idx + 1) * 100}`}>
                <div className="grid grid-cols-1 md:grid-cols-4">
                  {/* Event image strip */}
                  <div className="md:col-span-1 h-36 md:h-auto relative overflow-hidden img-zoom">
                    <img
                      src={ticket.img}
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                      style={{ filter: ticket.status === 'past' ? 'grayscale(60%) brightness(0.7)' : 'none' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className={`label-micro ${s.text} flex items-center gap-1.5 bg-surface/60 backdrop-blur px-2 py-1 rounded-full`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot} inline-block`} />
                        {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 p-6">
                    <h3 className="font-editorial text-xl text-on_surface mb-1 leading-tight">
                      {ticket.title}
                    </h3>
                    <p className="label-micro text-on_surface_variant mb-3">
                      {ticket.date} · {ticket.time}
                    </p>
                    <p className="text-on_surface_variant text-sm mb-1">{ticket.venue}</p>
                    <p className="label-micro text-on_surface_variant">{ticket.type}</p>
                  </div>

                  {/* QR + actions */}
                  <div className="md:col-span-1 p-6 flex flex-col items-center justify-center gap-4">
                    {ticket.status !== 'past' ? (
                      <>
                        {/* QR placeholder */}
                        <div className="w-20 h-20 bg-surface_container_high rounded-xl flex items-center justify-center ghost-border">
                          <div className="grid grid-cols-3 gap-0.5">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${
                                  [0, 2, 6, 8, 4].includes(i)
                                    ? 'bg-on_surface'
                                    : 'bg-surface_container_highest'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="label-micro text-on_surface_variant text-center">Show at entry</p>
                      </>
                    ) : (
                      <span className="label-micro text-on_surface_variant opacity-50">Expired</span>
                    )}
                    <a
                      href={`/events/${ticket.id}`}
                      className="label-micro text-primary hover:text-primary_container transition-colors"
                    >
                      View details →
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state hint */}
        <div className="mt-16 pt-10 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="font-editorial text-xl text-on_surface mb-2">Discover your next event</p>
          <p className="text-on_surface_variant text-sm mb-6">Our AI has curated new experiences for you.</p>
          <a href="/explore" className="btn-primary inline-block px-8 py-3.5 text-white font-semibold text-sm rounded-full">
            Explore Events
          </a>
        </div>
      </div>
    </div>
  )
}
