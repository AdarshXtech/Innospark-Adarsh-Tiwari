export const runtime = 'edge'
const PERFORMANCES = [
  {
    time: '12:00 PM',
    name: 'Battle of the Bands',
    stage: 'Main Stage',
    type: 'Music',
    img: 'https://images.unsplash.com/photo-1501386761578-eaa54b6103c0?w=300&q=80',
  },
  {
    time: '2:00 PM',
    name: 'Flash Mob & Street Dance',
    stage: 'Courtyard',
    type: 'Dance',
    img: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=300&q=80',
  },
  {
    time: '4:00 PM',
    name: 'Hackathon Finals',
    stage: 'Tech Arena',
    type: 'Tech',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&q=80',
  },
  {
    time: '6:00 PM',
    name: 'Stand-Up Comedy Nite',
    stage: 'Amphitheatre',
    type: 'Comedy',
    img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=300&q=80',
  },
  {
    time: '8:00 PM',
    name: 'DJ Night & Laser Show',
    stage: 'Main Stage',
    type: 'Music',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80',
  },
]

const CLUBS = [
  { name: 'Rhythm Collective', type: 'Music Club', members: 240, img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&q=80' },
  { name: 'Pixel Art Society', type: 'Design Club', members: 180, img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&q=80' },
  { name: 'DevHub', type: 'Tech Club', members: 310, img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=100&q=80' },
  { name: 'Nataraj Drama', type: 'Theatre Club', members: 95, img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=100&q=80' },
]

export default function UniFestPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <div className="flex items-center gap-4">
          <a href="/explore" className="label-micro text-on_surface_variant hover:text-on_surface transition-colors">← Explore</a>
          <a href="/checkout/1" className="btn-primary text-white text-sm font-semibold px-5 py-2 rounded-full">
            Get Passes
          </a>
        </div>
      </nav>

      {/* Hero — full bleed with parallax feel */}
      <div className="relative h-[75vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&q=90"
          alt="Euphoria Uni Fest"
          className="w-full h-full object-cover scale-105"
          style={{ animation: 'subtle-zoom 20s ease-in-out infinite alternate' }}
        />
        <style>{`@keyframes subtle-zoom { from { transform: scale(1.05); } to { transform: scale(1.12); } }`}</style>

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/60 to-transparent" />

        {/* Floating badge */}
        <div className="absolute top-8 right-8 animate-float">
          <div className="skeuo-raised rounded-2xl px-5 py-3 text-center">
            <p className="font-editorial text-3xl text-primary">APR</p>
            <p className="font-editorial text-5xl text-on_surface leading-none">25</p>
            <p className="label-micro text-on_surface_variant mt-1">2026</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 lg:px-20 pb-14">
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <span className="ai-pulse-chip active px-3 py-1.5 rounded-full label-micro text-primary">✦ University Fest</span>
            <span className="label-micro text-on_surface_variant">IIT Delhi · 3 Days</span>
          </div>
          <h1 className="font-editorial text-on_surface leading-[1.0] mb-4 animate-fade-up" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            Euphoria<br />
            <em className="text-gradient not-italic">Uni Fest 2026</em>
          </h1>
          <p className="text-on_surface_variant text-lg max-w-xl mb-8 animate-fade-up delay-100">
            India's biggest inter-college cultural festival. Music, tech, art, comedy, and everything in between — all under one sky.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up delay-200">
            <a href="/checkout/1" className="btn-primary text-white font-semibold px-8 py-3.5 rounded-full text-sm">
              Book Passes — from ₹299
            </a>
            <button className="btn-ghost text-on_surface font-medium px-8 py-3.5 rounded-full text-sm">
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="skeuo-inset px-8 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ['30+', 'Events & Competitions'],
            ['3,000', 'Expected Attendees'],
            ['15', 'Colleges Participating'],
            ['₹5L', 'Prize Pool'],
          ].map(([val, label], i) => (
            <div key={label} className={`text-center animate-fade-up delay-${(i + 1) * 100}`}>
              <p className="font-editorial text-3xl text-on_surface">{val}</p>
              <p className="label-micro text-on_surface_variant mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-20 py-16 space-y-20">

        {/* Schedule */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-micro text-primary mb-2">Day 1 Highlights</p>
              <h2 className="font-editorial text-display-sm text-on_surface">Schedule</h2>
            </div>
            <span className="label-micro text-on_surface_variant">APR 25, 2026</span>
          </div>

          <div className="space-y-4">
            {PERFORMANCES.map((perf, idx) => (
              <div
                key={perf.name}
                className={`skeuo-raised rounded-2xl overflow-hidden group cursor-pointer animate-fade-up delay-${(idx + 1) * 100}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 items-center">
                  <div className="md:col-span-1 h-24 overflow-hidden img-zoom">
                    <img src={perf.img} alt={perf.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:col-span-3 px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="label-micro text-primary">{perf.time}</span>
                      <span className="w-1 h-1 rounded-full bg-on_surface_variant" />
                      <span className="label-micro text-on_surface_variant">{perf.stage}</span>
                    </div>
                    <h3 className="font-editorial text-xl text-on_surface group-hover:text-primary_container transition-colors">
                      {perf.name}
                    </h3>
                  </div>
                  <div className="md:col-span-1 px-6 py-4 flex items-center justify-end">
                    <span className="ai-pulse-chip px-3 py-1.5 rounded-full label-micro text-on_surface_variant">{perf.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clubs */}
        <section>
          <div className="mb-10">
            <p className="label-micro text-primary mb-2">Organisers</p>
            <h2 className="font-editorial text-display-sm text-on_surface">Featured Clubs</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CLUBS.map((club, idx) => (
              <div
                key={club.name}
                className={`skeuo-leather rounded-2xl p-5 text-center group cursor-pointer animate-fade-up delay-${(idx + 1) * 100}`}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 img-zoom">
                  <img src={club.img} alt={club.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-editorial text-base text-on_surface group-hover:text-primary_container transition-colors mb-0.5">
                  {club.name}
                </p>
                <p className="label-micro text-on_surface_variant mb-1">{club.type}</p>
                <p className="label-micro text-primary">{club.members} members</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery strip */}
        <section>
          <div className="mb-8">
            <p className="label-micro text-primary mb-2">Moments</p>
            <h2 className="font-editorial text-display-sm text-on_surface">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'https://images.unsplash.com/photo-1501386761578-eaa54b6103c0?w=400&q=80',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
              'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80',
              'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden img-zoom h-40 animate-scale-in delay-${(i + 1) * 100}`}>
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center relative overflow-hidden rounded-3xl skeuo-raised py-16 px-8">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none animate-hero-glow rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #7c6af7 0%, transparent 60%)' }}
          />
          <p className="label-micro text-primary mb-4 animate-fade-up">Limited Passes Available</p>
          <h2 className="font-editorial text-display-md text-on_surface mb-4 animate-fade-up delay-100">
            Be part of<br />
            <em className="text-gradient not-italic">the legend.</em>
          </h2>
          <p className="text-on_surface_variant mb-8 max-w-sm mx-auto animate-fade-up delay-200">
            3 days of music, code, art, and memories. Passes going fast.
          </p>
          <a
            href="/checkout/1"
            className="btn-primary inline-block text-white font-semibold px-10 py-4 rounded-full text-sm animate-fade-up delay-300"
          >
            Book Your Pass →
          </a>
        </section>
      </div>
    </div>
  )
}
