import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80'

export default async function ExplorePage() {
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

  const { data: { user } } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from('events')
    .select('id, title, event_date, location, category, banner_url, ticket_tiers(price)')
    .eq('status', 'published')
    .order('event_date', { ascending: true })

  const categories = ['All', 'Music', 'Tech', 'Food', 'Comedy', 'Wellness', 'Art', 'Sports']

  return (
    <div className="min-h-screen bg-surface">
      {/* Glass nav */}
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <div className="flex items-center gap-6">
          <a href="/my-tickets" className="text-on_surface_variant hover:text-on_surface text-sm transition-colors">My Tickets</a>
          <a href="/admin" className="text-on_surface_variant hover:text-on_surface text-sm transition-colors">Admin</a>
          <a href="/create-event" className="btn-primary text-white text-sm font-semibold px-5 py-2 rounded-full">+ Create Event</a>
          {user ? (
            <a href="/my-tickets" className="text-on_surface_variant hover:text-on_surface text-sm transition-colors">{user.email}</a>
          ) : (
            <a href="/login" className="label-micro text-primary hover:text-primary_container transition-colors">Sign In</a>
          )}
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative pt-32 pb-14 px-8 lg:px-20 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c6af7 0%, transparent 70%)', opacity: 0.1 }}
        />
        <div
          className="absolute bottom-0 left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4f3fe0 0%, transparent 70%)', opacity: 0.07 }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="label-micro text-primary mb-3 animate-slide-r">AI-Curated</p>
          <h1 className="font-editorial text-display-md text-on_surface leading-tight animate-fade-up">
            Explore Events
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-20 py-8">
        {/* Search bar */}
        <div className="mb-8 animate-fade-up">
          <input
            type="text"
            placeholder="Search events, artists, venues..."
            className="input-editorial w-full max-w-xl px-5 py-3.5 text-sm"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-10 animate-fade-up delay-100">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`ai-pulse-chip px-5 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0 ? 'active text-primary' : 'text-on_surface_variant hover:text-on_surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Event grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-on_surface_variant text-sm">
                <span className="text-on_surface font-semibold">{events?.length ?? 0}</span> events near you
              </p>
              <div className="flex items-center gap-2">
                <span className="label-micro text-on_surface_variant">Sort:</span>
                <select className="input-editorial text-xs px-3 py-1.5 rounded-lg">
                  <option>Date</option>
                  <option>Price</option>
                </select>
              </div>
            </div>

            {!events || events.length === 0 ? (
              <div className="col-span-3 py-20 text-center">
                <p className="text-on_surface_variant text-sm">No events found. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {events.map((event, idx) => {
                  const price = (event.ticket_tiers as any)?.[0]?.price
                  const dateStr = event.event_date
                    ? new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : ''
                  return (
                    <a
                      key={event.id}
                      href={`/checkout/${event.id}`}
                      className={`card-event rounded-2xl overflow-hidden block group animate-fade-up delay-${(idx % 6 + 1) * 100}`}
                    >
                      <div className="h-40 img-zoom relative overflow-hidden">
                        <img
                          src={event.banner_url || FALLBACK_IMAGE}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface_container/80 to-transparent" />
                        {event.category && (
                          <div className="absolute bottom-2 left-2">
                            <span className="label-micro text-on_surface_variant bg-surface_container/80 backdrop-blur px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-editorial text-lg text-on_surface mb-1 group-hover:text-primary_container transition-colors leading-tight">
                          {event.title}
                        </h3>
                        <p className="label-micro text-on_surface_variant mb-3">
                          {dateStr}{event.location ? ` · ${event.location}` : ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-on_surface font-semibold text-sm">
                            {price != null ? `₹${price}` : 'Free'}
                          </span>
                          <span className="text-on_surface_variant text-xs group-hover:text-primary transition-colors">→</span>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="skeuo-leather rounded-2xl p-5 sticky top-24 animate-fade-up delay-200">
              <p className="label-micro text-on_surface_variant mb-5">Filters</p>

              <div className="space-y-6">
                <div>
                  <label className="label-micro text-on_surface_variant block mb-3">Distance</label>
                  <input type="range" min="0" max="50" defaultValue="25" className="w-full accent-primary" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-on_surface_variant">0 km</span>
                    <span className="text-xs text-primary font-medium">25 km</span>
                    <span className="text-xs text-on_surface_variant">50 km</span>
                  </div>
                </div>

                <div>
                  <label className="label-micro text-on_surface_variant block mb-3">Price range</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Min" className="input-editorial w-full px-3 py-2 text-xs rounded-lg" />
                    <input type="text" placeholder="Max" className="input-editorial w-full px-3 py-2 text-xs rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="label-micro text-on_surface_variant block mb-3">Date</label>
                  <input type="date" className="input-editorial w-full px-3 py-2 text-xs" />
                </div>

                <button className="btn-primary w-full py-3 text-white font-semibold text-sm rounded-full">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
