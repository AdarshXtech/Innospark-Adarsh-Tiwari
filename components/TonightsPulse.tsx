'use client'

import { useState, useEffect } from 'react'

const EVENTS = [
  { id: 1, name: 'Monsoon Beats Festival', city: 'Mumbai', x: 22, y: 62, tickets: 847, selling: true, tag: 'Music' },
  { id: 2, name: 'Jazz Under the Stars', city: 'Delhi', x: 38, y: 28, tickets: 312, selling: true, tag: 'Jazz' },
  { id: 3, name: 'Tech Summit 2026', city: 'Pune', x: 24, y: 58, tickets: 203, selling: false, tag: 'Tech' },
  { id: 4, name: 'Indie Film Showcase', city: 'Bangalore', x: 30, y: 72, tickets: 99, selling: true, tag: 'Film' },
  { id: 5, name: 'Stand-Up Collective', city: 'Hyderabad', x: 32, y: 65, tickets: 441, selling: true, tag: 'Comedy' },
  { id: 6, name: 'Sunrise Yoga Retreat', city: 'Jaipur', x: 30, y: 35, tickets: 58, selling: false, tag: 'Wellness' },
  { id: 7, name: 'Street Food Carnival', city: 'Chennai', x: 34, y: 78, tickets: 1203, selling: true, tag: 'Food' },
  { id: 8, name: 'Classical Evening', city: 'Kolkata', x: 62, y: 48, tickets: 175, selling: false, tag: 'Music' },
]

const TICKER_ITEMS = [
  { name: 'Aarav B.', event: 'Monsoon Beats Festival', time: '2s ago' },
  { name: 'Priya M.', event: 'Jazz Under the Stars', time: '11s ago' },
  { name: 'Rohan S.', event: 'Street Food Carnival', time: '23s ago' },
  { name: 'Kavya R.', event: 'Indie Film Showcase', time: '34s ago' },
  { name: 'Arjun K.', event: 'Stand-Up Collective', time: '47s ago' },
  { name: 'Meera P.', event: 'Tech Summit 2026', time: '1m ago' },
  { name: 'Vikram N.', event: 'Monsoon Beats Festival', time: '1m ago' },
  { name: 'Ananya T.', event: 'Classical Evening', time: '2m ago' },
]

function useLiveCount(base: number, active: boolean) {
  const [count, setCount] = useState(base)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      if (Math.random() < 0.3) setCount((c) => c + Math.floor(Math.random() * 3) + 1)
    }, 2800)
    return () => clearInterval(id)
  }, [active])
  return count
}

function PulseNode({ event, isHovered, onHover }: {
  event: typeof EVENTS[0]
  isHovered: boolean
  onHover: (id: number | null) => void
}) {
  const count = useLiveCount(event.tickets, event.selling)
  const size = Math.max(8, Math.min(20, 8 + Math.log(count) * 1.6))

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Ripple rings — only on hot events */}
      {event.selling && (
        <>
          <circle
            cx={`${event.x}%`}
            cy={`${event.y}%`}
            r={size + 6}
            fill="none"
            stroke="rgba(124,106,247,0.4)"
            strokeWidth="1"
            style={{
              animation: 'pulse-ring 2s ease-out infinite',
              transformOrigin: `${event.x}% ${event.y}%`,
            }}
          />
          <circle
            cx={`${event.x}%`}
            cy={`${event.y}%`}
            r={size + 12}
            fill="none"
            stroke="rgba(124,106,247,0.2)"
            strokeWidth="1"
            style={{
              animation: 'pulse-ring 2s ease-out infinite 0.7s',
              transformOrigin: `${event.x}% ${event.y}%`,
            }}
          />
        </>
      )}

      {/* Glow halo */}
      <circle
        cx={`${event.x}%`}
        cy={`${event.y}%`}
        r={size + 4}
        fill={isHovered ? 'rgba(124,106,247,0.15)' : 'rgba(124,106,247,0.06)'}
        style={{ transition: 'fill 0.3s ease' }}
      />

      {/* Core dot */}
      <circle
        cx={`${event.x}%`}
        cy={`${event.y}%`}
        r={size / 2}
        fill={event.selling ? (isHovered ? '#7c6af7' : '#9580ff') : '#2c334f'}
        stroke={isHovered ? 'rgba(184,176,255,0.8)' : 'rgba(124,106,247,0.4)'}
        strokeWidth="1.5"
        style={{ transition: 'all 0.3s ease', filter: event.selling ? 'drop-shadow(0 0 6px rgba(124,106,247,0.7))' : 'none' }}
      />
    </g>
  )
}

export default function TonightsPulse() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [totalBooked, setTotalBooked] = useState(3847)
  // const _tickerRef = useRef<HTMLDivElement>(null)

  const hoveredEvent = EVENTS.find((e) => e.id === hoveredId)

  // Roll the ticker
  useEffect(() => {
    const id = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Slowly increment the global booking count
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.4) setTotalBooked((n) => n + Math.floor(Math.random() * 4) + 1)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const current = TICKER_ITEMS[tickerIndex]

  return (
    <section className="px-8 lg:px-20 py-20">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes ticker-slide {
          0% { opacity: 0; transform: translateY(8px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="label-micro text-primary">Live activity</p>
            </div>
            <h2 className="font-editorial text-display-sm text-on_surface">
              Tonight's<br />
              <em className="text-on_surface_variant not-italic">Pulse</em>
            </h2>
          </div>

          {/* Global counter */}
          <div className="text-right">
            <p className="font-editorial text-3xl text-on_surface tabular-nums">{totalBooked.toLocaleString()}</p>
            <p className="label-micro text-on_surface_variant mt-1">tickets booked tonight</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map */}
          <div
            className="lg:col-span-3 rounded-3xl overflow-hidden relative"
            style={{
              background: 'radial-gradient(ellipse at 30% 60%, rgba(124,106,247,0.06) 0%, transparent 60%), #0e1117',
              outline: '1px solid rgba(255,255,255,0.06)',
              minHeight: '380px',
            }}
          >
            {/* India silhouette — simplified path */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Subtle grid lines */}
              {[20, 40, 60, 80].map((v) => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </g>
              ))}

              {/* India outline — approximate */}
              <path
                d="M30,20 L35,18 L42,20 L48,18 L55,20 L60,22 L65,25 L68,30 L66,35 L70,40 L68,45 L65,50 L62,55 L58,60 L55,65 L52,72 L48,78 L45,84 L42,88 L40,85 L38,80 L36,75 L32,70 L28,65 L24,60 L20,55 L18,50 L20,45 L18,40 L20,35 L22,30 L26,25 Z"
                fill="rgba(255,255,255,0.025)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />

              {/* Event pulse nodes */}
              {EVENTS.map((event) => (
                <PulseNode
                  key={event.id}
                  event={event}
                  isHovered={hoveredId === event.id}
                  onHover={setHoveredId}
                />
              ))}
            </svg>

            {/* Hover tooltip */}
            <div
              className="absolute bottom-5 left-5 right-5 rounded-2xl p-4 transition-all duration-300"
              style={{
                background: 'rgba(28,27,27,0.92)',
                backdropFilter: 'blur(16px)',
                outline: '1px solid rgba(255,255,255,0.08)',
                opacity: hoveredEvent ? 1 : 0,
                transform: hoveredEvent ? 'translateY(0)' : 'translateY(6px)',
              }}
            >
              {hoveredEvent && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-editorial text-base text-on_surface leading-tight">{hoveredEvent.name}</p>
                    <p className="label-micro text-on_surface_variant mt-1">{hoveredEvent.city} · {hoveredEvent.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-editorial text-xl text-primary">{hoveredEvent.tickets.toLocaleString()}</p>
                    <p className="label-micro text-on_surface_variant">
                      {hoveredEvent.selling ? 'selling fast' : 'tickets left'}
                    </p>
                  </div>
                </div>
              )}
              {!hoveredEvent && (
                <p className="label-micro text-on_surface_variant text-center">Hover a dot to see live activity</p>
              )}
            </div>

            {/* Legend */}
            <div className="absolute top-5 right-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 6px rgba(124,106,247,0.7)' }} />
                <span className="label-micro text-on_surface_variant">Selling fast</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface_container_highest" />
                <span className="label-micro text-on_surface_variant">Available</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Live ticker */}
            <div
              className="rounded-2xl p-5 flex-shrink-0"
              style={{
                background: 'linear-gradient(155deg, #1e2438 0%, #141821 100%)',
                outline: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="label-micro text-primary">Live bookings</p>
              </div>

              {/* Animated single ticker row */}
              <div className="h-12 overflow-hidden relative">
                <div
                  key={tickerIndex}
                  style={{ animation: 'ticker-slide 3s ease-in-out forwards' }}
                >
                  <p className="font-editorial text-base text-on_surface leading-tight">{current.name}</p>
                  <p className="label-micro text-on_surface_variant mt-0.5">just booked · {current.event}</p>
                </div>
              </div>

              {/* Stacked avatars simulation */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {['#7c6af7', '#4f3fe0', '#9580ff', '#b8b0ff', '#2c334f'].map((bg, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-surface_container_low"
                      style={{ background: bg }}
                    />
                  ))}
                </div>
                <p className="label-micro text-on_surface_variant">+{(totalBooked % 200 + 40)} booking now</p>
              </div>
            </div>

            {/* Hot events list */}
            <div
              className="rounded-2xl p-5 flex-1"
              style={{
                background: 'linear-gradient(155deg, #1e2438 0%, #141821 100%)',
                outline: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="label-micro text-on_surface_variant mb-4">Hottest right now</p>
              <div className="space-y-4">
                {EVENTS.filter((e) => e.selling)
                  .sort((a, b) => b.tickets - a.tickets)
                  .slice(0, 4)
                  .map((event, i) => (
                    <a
                      key={event.id}
                      href="/explore"
                      className="flex items-center gap-3 group"
                    >
                      {/* Rank */}
                      <span className="font-editorial text-2xl text-surface_container_highest w-6 text-center leading-none group-hover:text-primary transition-colors">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on_surface text-sm font-medium truncate group-hover:text-primary_container transition-colors">
                          {event.name}
                        </p>
                        <p className="label-micro text-on_surface_variant truncate">{event.city} · {event.tag}</p>
                      </div>
                      {/* Heat bar */}
                      <div className="w-16 h-1 rounded-full bg-surface_container_high overflow-hidden flex-shrink-0">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (event.tickets / 1300) * 100)}%`,
                            background: 'linear-gradient(90deg, #7c6af7, #b8b0ff)',
                          }}
                        />
                      </div>
                    </a>
                  ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href="/explore"
              className="btn-primary block text-center py-3.5 text-white font-semibold text-sm rounded-full"
            >
              Catch tonight's events →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
