'use client'

import { useState } from 'react'

const EVENTS = [
  {
    id: 1,
    title: 'Monsoon Beats Festival',
    date: 'APR 20, 2026',
    venue: 'Bandra Amphitheatre, Mumbai',
    category: 'Music',
    tickets: { sold: 847, total: 2000 },
    revenue: 677153,
    status: 'live',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80',
  },
  {
    id: 2,
    title: 'Tech Summit 2026',
    date: 'APR 15, 2026',
    venue: 'HICC, Pune',
    category: 'Tech',
    tickets: { sold: 312, total: 500 },
    revenue: 311688,
    status: 'live',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80',
  },
  {
    id: 3,
    title: 'Jazz Under the Stars',
    date: 'APR 12, 2026',
    venue: 'India Habitat Centre, Delhi',
    category: 'Music',
    tickets: { sold: 175, total: 300 },
    revenue: 86975,
    status: 'past',
    img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&q=80',
  },
  {
    id: 4,
    title: 'Euphoria Uni Fest 2026',
    date: 'APR 25, 2026',
    venue: 'IIT Delhi Campus',
    category: 'University',
    tickets: { sold: 1203, total: 3000 },
    revenue: 360900,
    status: 'live',
    img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&q=80',
  },
  {
    id: 5,
    title: 'Indie Film Showcase',
    date: 'APR 14, 2026',
    venue: 'Inox, Bangalore',
    category: 'Film',
    tickets: { sold: 99, total: 200 },
    revenue: 29601,
    status: 'draft',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&q=80',
  },
]

const STATS = [
  { label: 'Total Revenue', value: '₹14.6L', delta: '+18%', up: true },
  { label: 'Tickets Sold', value: '2,636', delta: '+24%', up: true },
  { label: 'Active Events', value: '4', delta: '+1', up: true },
  { label: 'Avg. Fill Rate', value: '61%', delta: '-3%', up: false },
]

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  live:  { bg: 'bg-green-900/30', text: 'text-green-400', dot: 'bg-green-400' },
  draft: { bg: 'bg-surface_container_high', text: 'text-on_surface_variant', dot: 'bg-on_surface_variant' },
  past:  { bg: 'bg-surface_container', text: 'text-on_surface_variant', dot: 'bg-surface_bright' },
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'create'>('events')
  const [form, setForm] = useState({
    title: '', category: 'Music', date: '', time: '',
    venue: '', city: '', price: '', capacity: '', description: '',
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
          <span className="label-micro text-primary bg-primary/10 px-2 py-1 rounded-full">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/explore" className="text-on_surface_variant hover:text-on_surface text-sm transition-colors">View Site</a>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">A</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="label-micro text-primary mb-2">Dashboard</p>
          <h1 className="font-editorial text-display-sm text-on_surface">Event Management</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`skeuo-raised rounded-2xl p-5 animate-fade-up delay-${(i + 1) * 100}`}>
              <p className="label-micro text-on_surface_variant mb-2">{stat.label}</p>
              <p className="font-editorial text-3xl text-on_surface mb-1">{stat.value}</p>
              <span className={`label-micro ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.delta} this month
              </span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 animate-fade-up">
          {(['events', 'create'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`ai-pulse-chip px-6 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                activeTab === tab ? 'active text-primary' : 'text-on_surface_variant hover:text-on_surface'
              }`}
            >
              {tab === 'events' ? 'All Events' : 'Create Event'}
            </button>
          ))}
        </div>

        {activeTab === 'events' && (
          <div className="space-y-4 animate-fade-up">
            {EVENTS.map((event, idx) => {
              const s = STATUS_STYLE[event.status]
              const fill = Math.round((event.tickets.sold / event.tickets.total) * 100)
              return (
                <div key={event.id} className={`skeuo-leather rounded-2xl overflow-hidden animate-fade-up delay-${(idx + 1) * 100}`}>
                  <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-0">
                    {/* Image */}
                    <div className="md:col-span-1 h-28 overflow-hidden img-zoom">
                      <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2 px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`label-micro ${s.text} flex items-center gap-1 ${s.bg} px-2 py-0.5 rounded-full`}>
                          <span className={`w-1 h-1 rounded-full ${s.dot} inline-block`} />
                          {event.status}
                        </span>
                        <span className="label-micro text-on_surface_variant">{event.category}</span>
                      </div>
                      <h3 className="font-editorial text-lg text-on_surface mb-0.5">{event.title}</h3>
                      <p className="label-micro text-on_surface_variant">{event.date} · {event.venue}</p>
                    </div>

                    {/* Ticket fill */}
                    <div className="md:col-span-1 px-6 py-4">
                      <p className="label-micro text-on_surface_variant mb-2">Tickets sold</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-on_surface font-semibold text-sm">{event.tickets.sold}</span>
                        <span className="text-on_surface_variant text-xs">/ {event.tickets.total}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface_container_high overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${fill}%`,
                            background: fill > 80 ? 'linear-gradient(90deg, #7c6af7, #b8b0ff)' : fill > 50 ? '#7c6af7' : '#4f3fe0',
                          }}
                        />
                      </div>
                      <p className="label-micro text-on_surface_variant mt-1">{fill}% filled</p>
                    </div>

                    {/* Revenue + actions */}
                    <div className="md:col-span-1 px-6 py-4 flex flex-col gap-3 items-start">
                      <div>
                        <p className="label-micro text-on_surface_variant mb-1">Revenue</p>
                        <p className="font-editorial text-xl text-on_surface">
                          ₹{(event.revenue / 100000).toFixed(1)}L
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-ghost px-3 py-1.5 rounded-lg text-xs text-on_surface_variant hover:text-on_surface transition-colors">
                          Edit
                        </button>
                        <button className="btn-primary px-3 py-1.5 rounded-lg text-xs text-white">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleSave} className="animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="skeuo-leather rounded-2xl p-6 space-y-5">
                  <h2 className="font-editorial text-xl text-on_surface mb-2">Event Details</h2>

                  <div>
                    <label className="label-micro text-on_surface_variant block mb-2">Event Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Monsoon Beats Festival"
                      className="input-editorial w-full px-4 py-3 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-micro text-on_surface_variant block mb-2">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="input-editorial w-full px-4 py-3 text-sm"
                      >
                        {['Music', 'Tech', 'Food', 'Comedy', 'Wellness', 'Art', 'Sports', 'University', 'Film'].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-micro text-on_surface_variant block mb-2">Ticket Price (₹)</label>
                      <input
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="799"
                        type="number"
                        className="input-editorial w-full px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-micro text-on_surface_variant block mb-2">Date</label>
                      <input
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        type="date"
                        className="input-editorial w-full px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="label-micro text-on_surface_variant block mb-2">Time</label>
                      <input
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        type="time"
                        className="input-editorial w-full px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-micro text-on_surface_variant block mb-2">Venue</label>
                      <input
                        value={form.venue}
                        onChange={(e) => setForm({ ...form, venue: e.target.value })}
                        placeholder="Bandra Amphitheatre"
                        className="input-editorial w-full px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="label-micro text-on_surface_variant block mb-2">City</label>
                      <input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Mumbai"
                        className="input-editorial w-full px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-micro text-on_surface_variant block mb-2">Capacity</label>
                    <input
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      placeholder="2000"
                      type="number"
                      className="input-editorial w-full px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="label-micro text-on_surface_variant block mb-2">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the event experience..."
                      rows={4}
                      className="input-editorial w-full px-4 py-3 text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preview + publish */}
              <div className="lg:col-span-1 space-y-4">
                {/* Live preview card */}
                <div className="skeuo-raised rounded-2xl overflow-hidden">
                  <div className="h-36 relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80"
                      alt="preview"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface_container to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="label-micro text-on_surface_variant mb-0.5">{form.category || 'Category'}</p>
                      <p className="font-editorial text-on_surface text-base leading-tight">
                        {form.title || 'Event Title'}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <p className="label-micro text-on_surface_variant">
                      {form.date || 'Date'} · {form.city || 'City'}
                    </p>
                    <p className="font-editorial text-xl text-primary">
                      {form.price ? `₹${form.price}` : '₹ —'}
                    </p>
                  </div>
                </div>

                {/* Publish buttons */}
                <div className="skeuo-leather rounded-2xl p-5 space-y-3">
                  <p className="label-micro text-on_surface_variant mb-3">Publish settings</p>
                  <button
                    type="submit"
                    className="btn-primary w-full py-3.5 text-white font-semibold text-sm rounded-full"
                  >
                    {saved ? '✓ Saved!' : 'Publish Event'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost w-full py-3 text-on_surface_variant text-sm rounded-full"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
