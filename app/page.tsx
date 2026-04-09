import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import TonightsPulse from '../components/TonightsPulse'
import LiveClock from '../components/LiveClock'

const FEATURED_EVENTS = [
  {
    title: 'Jazz Under the Stars',
    meta: 'APR 12 · DELHI · ₹499',
    tag: 'Jazz · Live',
    match: '96%',
    img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
  },
  {
    title: 'Indie Film Showcase',
    meta: 'APR 14 · BANGALORE · ₹299',
    tag: 'Film · Art',
    match: '91%',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
  },
  {
    title: 'Tech Summit 2026',
    meta: 'APR 15 · PUNE · ₹999',
    tag: 'Tech · Networking',
    match: '88%',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
]

export default async function Home() {
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

  if (user) {
    redirect('/explore')
  }

  return (
    <main className="min-h-screen bg-surface overflow-hidden">
      {/* Nav */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between">
        <span className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</span>
        <div className="flex items-center gap-6">
          <LiveClock />
          <a href="/explore" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">Explore</a>
          <a href="/admin" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">Admin</a>
          {user ? (
            <a href="/my-tickets" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">{user.email}</a>
          ) : (
            <>
              <a href="/login" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">Sign In</a>
              <a href="/signup" className="btn-primary text-white text-sm font-semibold px-5 py-2 rounded-full">Get Started</a>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-8 lg:px-20 overflow-hidden">
        {/* Animated background glow */}
        <div
          className="absolute top-10 right-0 w-[700px] h-[700px] rounded-full pointer-events-none animate-hero-glow"
          style={{ background: 'radial-gradient(circle, #7c6af7 0%, transparent 70%)', opacity: 0.12 }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4f3fe0 0%, transparent 70%)', opacity: 0.07 }}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: editorial text block */}
          <div>
            <p className="label-micro text-primary mb-6 animate-fade-up">AI-Curated · Local · Immersive</p>
            <h1 className="font-editorial text-display-lg text-on_surface leading-[1.08] mb-6 animate-fade-up delay-100">
              Every great night<br />
              <em className="text-gradient not-italic">begins here.</em>
            </h1>
            <p className="text-on_surface_variant text-lg leading-relaxed max-w-md mb-10 animate-fade-up delay-200">
              LocalTix surfaces events tuned to your taste — concerts, festivals, workshops, and experiences you won't find anywhere else.
            </p>
            <div className="flex items-center gap-4 animate-fade-up delay-300">
              <a href="/explore" className="btn-primary text-white font-semibold px-8 py-3.5 rounded-full text-sm">
                Explore Events
              </a>
              <a href="/signup" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors flex items-center gap-2">
                Create account
                <span className="text-primary">→</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-14 flex gap-10 animate-fade-up delay-400">
              {[['2.4k+', 'Events listed'], ['18', 'Cities covered'], ['94%', 'Match accuracy']].map(([val, label]) => (
                <div key={label}>
                  <p className="font-editorial text-3xl text-on_surface">{val}</p>
                  <p className="label-micro text-on_surface_variant mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: featured event card stack with real image */}
          <div className="relative h-[500px] hidden lg:block animate-scale-in delay-300">
            {/* Back card */}
            <div className="absolute top-8 right-0 w-72 h-80 rounded-2xl bg-surface_container_low rotate-3 ghost-border" />
            {/* Front card */}
            <div className="absolute top-0 right-12 w-72 h-80 rounded-2xl overflow-hidden card-event cursor-pointer animate-float">
              <div className="h-44 w-full img-zoom relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80"
                  alt="Monsoon Beats Festival"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface_container_low/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="label-micro text-primary bg-surface_container_low/80 backdrop-blur px-2 py-1 rounded-full">
                    Trending · Music
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-editorial text-xl text-on_surface mb-1">Monsoon Beats Festival</h3>
                <p className="label-micro text-on_surface_variant">APR 20 · MUMBAI · ₹799</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-primary font-medium">98% Match</span>
                  <button className="btn-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full">Book</button>
                </div>
              </div>
            </div>
            {/* AI chip floating */}
            <div className="absolute bottom-16 right-0 ai-pulse-chip active px-4 py-2 rounded-full text-xs text-primary font-medium animate-fade-up delay-500">
              ✦ AI found 12 events for you
            </div>
          </div>
        </div>
      </section>

      {/* Category chips strip */}
      <section className="px-8 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <p className="label-micro text-on_surface_variant mb-6">Browse by category</p>
          <div className="flex flex-wrap gap-3">
            {['All', 'Music', 'Tech', 'Food', 'Comedy', 'Wellness', 'Art', 'Sports', 'University Fest'].map((cat, i) => (
              <a
                key={cat}
                href={cat === 'University Fest' ? '/events/uni-fest' : '/explore'}
                className={`ai-pulse-chip px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  i === 0 ? 'active text-primary' : 'text-on_surface_variant hover:text-on_surface'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tonight's Pulse — live city heatmap */}
      <TonightsPulse />

      {/* Featured section */}
      <section className="bg-surface_container_low px-8 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-editorial text-display-sm text-on_surface">
              Curated<br /><em className="text-on_surface_variant not-italic">for tonight</em>
            </h2>
            <a href="/explore" className="label-micro text-primary hover:text-primary_container transition-colors">
              View all →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_EVENTS.map((event, idx) => (
              <a
                key={event.title}
                href="/events/1"
                className={`card-event rounded-2xl overflow-hidden block group animate-fade-up delay-${(idx + 1) * 100}`}
              >
                <div className="h-48 img-zoom relative overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface_container/90 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="label-micro text-on_surface_variant bg-surface_container/80 backdrop-blur px-2 py-1 rounded-full">
                      {event.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="label-micro text-primary bg-surface_container_lowest/80 backdrop-blur px-2 py-1 rounded-full">
                      {event.match} Match
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-editorial text-xl text-on_surface mb-1 group-hover:text-primary_container transition-colors">
                    {event.title}
                  </h3>
                  <p className="label-micro text-on_surface_variant mb-3">{event.meta}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-medium">{event.match} Match</span>
                    <span className="text-on_surface_variant text-xs group-hover:text-primary transition-colors">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* University Fest banner */}
      <section className="px-8 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <a href="/events/uni-fest" className="relative rounded-3xl overflow-hidden block group img-zoom">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400&q=80"
              alt="University Fest"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/60 to-transparent" />
            <div className="absolute inset-0 flex items-center px-10">
              <div>
                <p className="label-micro text-primary mb-2 animate-slide-r">Featured · Campus</p>
                <h3 className="font-editorial text-display-sm text-on_surface mb-3 group-hover:text-gradient transition-all">
                  Euphoria Uni Fest 2026
                </h3>
                <p className="text-on_surface_variant text-sm mb-4 max-w-xs">
                  The biggest inter-college cultural extravaganza. Music, dance, drama, and more.
                </p>
                <span className="btn-primary inline-block text-white text-sm font-semibold px-6 py-2.5 rounded-full">
                  Explore Fest →
                </span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 lg:px-20 py-24 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none animate-hero-glow"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, #7c6af7 0%, transparent 60%)' }}
        />
        <p className="label-micro text-primary mb-4 animate-fade-up">Your concierge awaits</p>
        <h2 className="font-editorial text-display-md text-on_surface mb-6 mx-auto max-w-lg animate-fade-up delay-100">
          Stop scrolling.<br />Start experiencing.
        </h2>
        <a href="/signup" className="btn-primary inline-block text-white font-semibold px-10 py-4 rounded-full text-sm animate-fade-up delay-200">
          Create free account
        </a>
      </section>
    </main>
  )
}
