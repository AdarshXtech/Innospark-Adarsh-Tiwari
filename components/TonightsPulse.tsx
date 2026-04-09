'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from './ThemeProvider'

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

// Day/night theme tokens
const THEMES = {
  night: {
    mapBg: '#1c1c1e',
    mapBorder: 'rgba(255,255,255,0.08)',
    gridStroke: 'rgba(255,255,255,0.04)',
    highwayStroke: 'rgba(255,255,255,0.03)',
    indiaFill: 'rgba(255,255,255,0.03)',
    indiaStroke: 'rgba(255,255,255,0.1)',
    glowColor: 'rgba(124,106,247,0.08)',
    barBg: 'rgba(44,44,46,0.88)',
    barBorder: 'rgba(255,255,255,0.08)',
    tooltipBg: 'rgba(44,44,46,0.95)',
    tooltipBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.4)',
    dotAvailable: '#3a4060',
    dotStroke: 'rgba(255,255,255,0.9)',
    labelFill: 'white',
    panelBg: 'linear-gradient(155deg, #1e2438 0%, #141821 100%)',
    panelBorder: 'rgba(255,255,255,0.06)',
  },
  day: {
    mapBg: '#e8eaf0',
    mapBorder: 'rgba(0,0,0,0.1)',
    gridStroke: 'rgba(0,0,0,0.06)',
    highwayStroke: 'rgba(0,0,0,0.04)',
    indiaFill: 'rgba(124,106,247,0.06)',
    indiaStroke: 'rgba(124,106,247,0.25)',
    glowColor: 'rgba(124,106,247,0.06)',
    barBg: 'rgba(255,255,255,0.88)',
    barBorder: 'rgba(0,0,0,0.08)',
    tooltipBg: 'rgba(255,255,255,0.96)',
    tooltipBorder: 'rgba(0,0,0,0.1)',
    textPrimary: '#1a1a2e',
    textSecondary: 'rgba(0,0,0,0.45)',
    dotAvailable: '#a0aabf',
    dotStroke: 'rgba(255,255,255,1)',
    labelFill: '#1a1a2e',
    panelBg: 'linear-gradient(155deg, #f0f2f8 0%, #e4e8f2 100%)',
    panelBorder: 'rgba(0,0,0,0.08)',
  },
}

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

function PulseNode({
  event, isHovered, onHover, zoom, theme,
}: {
  event: typeof EVENTS[0]
  isHovered: boolean
  onHover: (id: number | null) => void
  zoom: number
  theme: typeof THEMES['night']
}) {
  useLiveCount(event.tickets, event.selling)
  // Dots shrink as zoom increases so they don't overwhelm
  const dot = (isHovered ? 4.5 : 3) / Math.sqrt(zoom)

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
    >
      {event.selling && (
        <circle
          cx={`${event.x}%`}
          cy={`${event.y}%`}
          r={dot + 5 / zoom}
          fill="none"
          stroke="rgba(124,106,247,0.35)"
          strokeWidth={0.8 / zoom}
          style={{
            animation: 'pulse-ring 2.4s ease-out infinite',
            transformOrigin: `${event.x}% ${event.y}%`,
          }}
        />
      )}
      <circle
        cx={`${event.x}%`}
        cy={`${event.y}%`}
        r={dot + 1.5 / zoom}
        fill={isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}
        style={{ transition: 'all 0.2s ease' }}
      />
      <circle
        cx={`${event.x}%`}
        cy={`${event.y}%`}
        r={dot}
        fill={event.selling ? '#7c6af7' : theme.dotAvailable}
        stroke={theme.dotStroke}
        strokeWidth={(isHovered ? 1.5 : 1) / zoom}
        style={{
          transition: 'all 0.2s ease',
          filter: event.selling ? `drop-shadow(0 0 ${isHovered ? 8 : 4}px rgba(124,106,247,0.9))` : 'none',
        }}
      />
      {isHovered && (
        <text
          x={`${event.x}%`}
          y={`${event.y - 5 / zoom}%`}
          textAnchor="middle"
          fill={theme.labelFill}
          fontSize={3 / zoom}
          fontWeight="600"
          style={{ letterSpacing: '0.02em', userSelect: 'none' }}
        >
          {event.city}
        </text>
      )}
    </g>
  )
}

type LayerId = 'default' | 'terrain' | 'traffic' | 'transit' | 'biking'

const MAP_LAYERS: { id: LayerId; label: string; icon: string }[] = [
  { id: 'default',  label: 'Map',     icon: '🗺' },
  { id: 'terrain',  label: 'Terrain', icon: '⛰' },
  { id: 'traffic',  label: 'Traffic', icon: '🚦' },
  { id: 'transit',  label: 'Transit', icon: '🚇' },
  { id: 'biking',   label: 'Biking',  icon: '🚴' },
]

// Per-layer visual overrides applied on top of base theme
const LAYER_OVERRIDES: Record<LayerId, Partial<typeof THEMES['night']>> = {
  default: {},
  terrain: {
    indiaFill: 'rgba(120,160,80,0.18)',
    indiaStroke: 'rgba(80,130,60,0.5)',
    gridStroke: 'rgba(100,140,70,0.12)',
    highwayStroke: 'rgba(160,120,60,0.18)',
    mapBg: '#1a2418',
  },
  traffic: {
    indiaFill: 'rgba(220,60,60,0.08)',
    indiaStroke: 'rgba(220,60,60,0.3)',
    highwayStroke: 'rgba(240,80,40,0.35)',
    gridStroke: 'rgba(220,60,60,0.06)',
  },
  transit: {
    indiaFill: 'rgba(30,120,220,0.1)',
    indiaStroke: 'rgba(30,120,220,0.3)',
    gridStroke: 'rgba(30,120,220,0.07)',
    highwayStroke: 'rgba(30,120,220,0.2)',
    mapBg: '#141c2a',
  },
  biking: {
    indiaFill: 'rgba(60,200,140,0.08)',
    indiaStroke: 'rgba(60,200,140,0.3)',
    gridStroke: 'rgba(60,200,140,0.07)',
    highwayStroke: 'rgba(60,200,140,0.18)',
  },
}

export default function TonightsPulse() {
  const { mode, isAuto, toggle, resetAuto } = useTheme()
  const isNight = mode === 'night'

  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [totalBooked, setTotalBooked] = useState(3847)
  const [activeLayer, setActiveLayer] = useState<LayerId>('default')
  const [showLayerMenu, setShowLayerMenu] = useState(false)

  // Pan & zoom state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const baseTheme = isNight ? THEMES.night : THEMES.day
  const theme = { ...baseTheme, ...LAYER_OVERRIDES[activeLayer] }
  const hoveredEvent = EVENTS.find((e) => e.id === hoveredId)

  // Ticker
  useEffect(() => {
    const id = setInterval(() => setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length), 3000)
    return () => clearInterval(id)
  }, [])

  // Global count
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.4) setTotalBooked((n) => n + Math.floor(Math.random() * 4) + 1)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  // --- Pan handlers ---
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const dx = ((e.clientX - lastPos.current.x) / rect.width) * 100
    const dy = ((e.clientY - lastPos.current.y) / rect.height) * 100
    lastPos.current = { x: e.clientX, y: e.clientY }
    setPan((p) => ({
      x: Math.max(-40 * (zoom - 1), Math.min(40 * (zoom - 1), p.x + dx / zoom)),
      y: Math.max(-40 * (zoom - 1), Math.min(40 * (zoom - 1), p.y + dy / zoom)),
    }))
  }, [zoom])

  const onMouseUp = useCallback(() => { isDragging.current = false }, [])

  // --- Scroll to zoom (non-passive to allow preventDefault) ---
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      setZoom((z) => Math.max(1, Math.min(4, z - e.deltaY * 0.003)))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  // Reset view
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const current = TICKER_ITEMS[tickerIndex]

  // Clamp pan when zoom resets
  useEffect(() => {
    if (zoom === 1) setPan({ x: 0, y: 0 })
  }, [zoom])

  return (
    <section className="px-8 lg:px-20 py-20" onClick={() => setShowLayerMenu(false)}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0; }
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
          <div className="text-right">
            <p className="font-editorial text-3xl text-on_surface tabular-nums">{totalBooked.toLocaleString()}</p>
            <p className="label-micro text-on_surface_variant mt-1">tickets booked tonight</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* MAP */}
          <div
            ref={mapRef}
            className="lg:col-span-3 rounded-3xl overflow-hidden relative select-none"
            style={{
              background: theme.mapBg,
              outline: `1px solid ${theme.mapBorder}`,
              minHeight: '420px',
              transition: 'background 0.6s ease',
              cursor: zoom > 1 ? 'grab' : 'default',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ transition: 'background 0.6s ease' }}
            >
              <defs>
                <radialGradient id="mapGlow" cx="35%" cy="55%" r="50%">
                  <stop offset="0%" stopColor={theme.glowColor} />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: '50% 50%' }}>
                <rect x={-100 / zoom} y={-100 / zoom} width={300 / zoom} height={300 / zoom} fill="url(#mapGlow)" />

                {/* Grid */}
                {[15, 28, 42, 57, 72, 86].map((v) => (
                  <g key={v}>
                    <line x1={v} y1="0" x2={v} y2="100" stroke={theme.gridStroke} strokeWidth={0.6 / zoom} />
                    <line x1="0" y1={v} x2="100" y2={v} stroke={theme.gridStroke} strokeWidth={0.6 / zoom} />
                  </g>
                ))}

                {/* Highways */}
                <line x1="0" y1="30" x2="100" y2="70" stroke={theme.highwayStroke} strokeWidth={1.2 / zoom} />
                <line x1="0" y1="60" x2="100" y2="20" stroke={theme.highwayStroke} strokeWidth={1.2 / zoom} />
                <line x1="20" y1="0" x2="60" y2="100" stroke={theme.highwayStroke} strokeWidth={0.8 / zoom} />

                {/* India outline */}
                <path
                  d="M30,20 L35,18 L42,20 L48,18 L55,20 L60,22 L65,25 L68,30 L66,35 L70,40 L68,45 L65,50 L62,55 L58,60 L55,65 L52,72 L48,78 L45,84 L42,88 L40,85 L38,80 L36,75 L32,70 L28,65 L24,60 L20,55 L18,50 L20,45 L18,40 L20,35 L22,30 L26,25 Z"
                  fill={theme.indiaFill}
                  stroke={theme.indiaStroke}
                  strokeWidth={0.4 / zoom}
                  style={{ transition: 'fill 0.6s ease, stroke 0.6s ease' }}
                />

                {/* Terrain: elevation contours */}
                {activeLayer === 'terrain' && (
                  <g opacity="0.35">
                    <ellipse cx="30" cy="45" rx="12" ry="8" fill="none" stroke="rgba(120,160,80,0.6)" strokeWidth={0.5/zoom} />
                    <ellipse cx="30" cy="45" rx="8" ry="5" fill="none" stroke="rgba(100,140,60,0.5)" strokeWidth={0.4/zoom} />
                    <ellipse cx="45" cy="30" rx="10" ry="7" fill="none" stroke="rgba(120,160,80,0.5)" strokeWidth={0.5/zoom} />
                    <ellipse cx="55" cy="60" rx="9" ry="6" fill="none" stroke="rgba(140,180,80,0.4)" strokeWidth={0.4/zoom} />
                  </g>
                )}

                {/* Traffic: colored road highlights */}
                {activeLayer === 'traffic' && (
                  <g>
                    <line x1="0" y1="30" x2="100" y2="70" stroke="rgba(240,80,40,0.55)" strokeWidth={2.5/zoom} strokeLinecap="round" />
                    <line x1="0" y1="60" x2="100" y2="20" stroke="rgba(240,200,40,0.5)" strokeWidth={2/zoom} strokeLinecap="round" />
                    <line x1="20" y1="0" x2="60" y2="100" stroke="rgba(60,200,60,0.45)" strokeWidth={1.5/zoom} strokeLinecap="round" />
                  </g>
                )}

                {/* Transit: metro/bus lines */}
                {activeLayer === 'transit' && (
                  <g>
                    <line x1="22" y1="62" x2="38" y2="28" stroke="rgba(30,120,220,0.7)" strokeWidth={1.8/zoom} strokeLinecap="round" strokeDasharray={`${3/zoom} ${1.5/zoom}`} />
                    <line x1="38" y1="28" x2="62" y2="48" stroke="rgba(180,30,220,0.6)" strokeWidth={1.8/zoom} strokeLinecap="round" strokeDasharray={`${3/zoom} ${1.5/zoom}`} />
                    <line x1="22" y1="62" x2="34" y2="78" stroke="rgba(30,180,220,0.6)" strokeWidth={1.6/zoom} strokeLinecap="round" strokeDasharray={`${3/zoom} ${1.5/zoom}`} />
                    <line x1="30" y1="72" x2="32" y2="65" stroke="rgba(30,120,220,0.5)" strokeWidth={1.4/zoom} strokeLinecap="round" />
                    {/* Station dots */}
                    {[[22,62],[38,28],[62,48],[34,78],[30,72],[32,65]].map(([cx,cy],i) => (
                      <circle key={i} cx={cx} cy={cy} r={1.8/zoom} fill="rgba(30,120,220,0.9)" stroke="white" strokeWidth={0.6/zoom} />
                    ))}
                  </g>
                )}

                {/* Biking: cycle paths */}
                {activeLayer === 'biking' && (
                  <g>
                    <path d={`M22,62 Q30,55 38,28`} fill="none" stroke="rgba(60,200,140,0.65)" strokeWidth={1.5/zoom} strokeLinecap="round" strokeDasharray={`${2/zoom} ${1/zoom}`} />
                    <path d={`M38,28 Q50,40 62,48`} fill="none" stroke="rgba(60,200,140,0.65)" strokeWidth={1.5/zoom} strokeLinecap="round" strokeDasharray={`${2/zoom} ${1/zoom}`} />
                    <path d={`M34,78 Q33,72 32,65`} fill="none" stroke="rgba(60,200,140,0.55)" strokeWidth={1.3/zoom} strokeLinecap="round" strokeDasharray={`${2/zoom} ${1/zoom}`} />
                  </g>
                )}

                {/* Event nodes */}
                {EVENTS.map((event) => (
                  <PulseNode
                    key={event.id}
                    event={event}
                    isHovered={hoveredId === event.id}
                    onHover={setHoveredId}
                    zoom={zoom}
                    theme={theme}
                  />
                ))}
              </g>
            </svg>

            {/* Top bar */}
            <div
              className="absolute top-3 left-3 right-3 rounded-2xl px-4 py-2.5 flex items-center gap-3"
              style={{
                background: theme.barBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                outline: `1px solid ${theme.barBorder}`,
                transition: 'background 0.6s ease',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>Events across India</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="label-micro text-primary">Live</span>
              </div>
            </div>

            {/* Day/Night toggle */}
            <button
              onClick={toggle}
              className="absolute rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition-all"
              style={{
                background: theme.barBg,
                backdropFilter: 'blur(20px)',
                outline: `1px solid ${theme.barBorder}`,
                top: '52px',
                right: '12px',
              }}
              title={isAuto ? 'Auto-changes with time' : 'Manually set'}
            >
              <span style={{ fontSize: '13px' }}>{isNight ? '🌙' : '☀️'}</span>
              <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                {isNight ? 'Night' : 'Day'}
              </span>
            </button>

            {/* Map layers button + panel */}
            <div className="absolute" style={{ top: '88px', right: '12px' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowLayerMenu((v) => !v)}
                className="rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition-all"
                style={{
                  background: showLayerMenu ? 'rgba(124,106,247,0.25)' : theme.barBg,
                  backdropFilter: 'blur(20px)',
                  outline: `1px solid ${showLayerMenu ? 'rgba(124,106,247,0.5)' : theme.barBorder}`,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={showLayerMenu ? '#7c6af7' : theme.textSecondary} strokeWidth="2" strokeLinecap="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                <span className="text-xs font-medium" style={{ color: showLayerMenu ? '#7c6af7' : theme.textSecondary }}>Layers</span>
              </button>

              {showLayerMenu && (
                <div
                  className="absolute right-0 mt-1.5 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: theme.tooltipBg,
                    backdropFilter: 'blur(24px)',
                    outline: `1px solid ${theme.tooltipBorder}`,
                    minWidth: '160px',
                  }}
                >
                  {/* Header row like Google Maps */}
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-xs font-semibold" style={{ color: theme.textSecondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Map type
                    </p>
                  </div>
                  {MAP_LAYERS.map((layer) => {
                    const isActive = activeLayer === layer.id
                    return (
                      <button
                        key={layer.id}
                        onClick={() => { setActiveLayer(layer.id); setShowLayerMenu(false) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left"
                        style={{
                          background: isActive
                            ? 'rgba(124,106,247,0.12)'
                            : 'transparent',
                        }}
                      >
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                          style={{
                            background: isActive ? 'rgba(124,106,247,0.2)' : (isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                            outline: isActive ? '1.5px solid rgba(124,106,247,0.5)' : `1px solid ${theme.barBorder}`,
                          }}
                        >
                          {layer.icon}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: isActive ? '#7c6af7' : theme.textPrimary }}>
                          {layer.label}
                        </span>
                        {isActive && (
                          <svg className="ml-auto" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    )
                  })}
                  <div className="px-3 pb-3 pt-1">
                    <p className="text-xs" style={{ color: theme.textSecondary, opacity: 0.6 }}>
                      {activeLayer === 'terrain' && 'Showing elevation & topography'}
                      {activeLayer === 'traffic' && 'Live traffic conditions'}
                      {activeLayer === 'transit' && 'Metro & bus routes'}
                      {activeLayer === 'biking' && 'Cycling lanes & paths'}
                      {activeLayer === 'default' && 'Standard map view'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Zoom controls */}
            <div
              className="absolute flex flex-col gap-1"
              style={{ bottom: '12px', left: '12px' }}
            >
              <button
                onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-light transition-all hover:scale-105 active:scale-95"
                style={{ background: theme.barBg, backdropFilter: 'blur(20px)', outline: `1px solid ${theme.barBorder}`, color: theme.textPrimary }}
              >+</button>
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-light transition-all hover:scale-105 active:scale-95"
                style={{ background: theme.barBg, backdropFilter: 'blur(20px)', outline: `1px solid ${theme.barBorder}`, color: theme.textPrimary }}
              >−</button>
              {zoom > 1 && (
                <button
                  onClick={resetView}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ background: theme.barBg, backdropFilter: 'blur(20px)', outline: `1px solid ${theme.barBorder}`, color: theme.textSecondary, fontSize: '11px' }}
                  title="Reset view"
                >⊙</button>
              )}
            </div>

            {/* Zoom indicator */}
            {zoom > 1 && (
              <div
                className="absolute text-xs font-medium px-2 py-1 rounded-lg"
                style={{ bottom: '12px', left: '52px', background: theme.barBg, color: theme.textSecondary, backdropFilter: 'blur(20px)' }}
              >
                {zoom.toFixed(1)}×
              </div>
            )}

            {/* Hover tooltip */}
            <div
              className="absolute rounded-2xl p-4"
              style={{
                bottom: '12px',
                left: zoom > 1 ? '80px' : '12px',
                right: '12px',
                background: theme.tooltipBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                outline: `1px solid ${theme.tooltipBorder}`,
                opacity: hoveredEvent ? 1 : 0,
                transform: hoveredEvent ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.98)',
                transition: 'opacity 0.2s ease, transform 0.2s ease, background 0.6s ease, left 0.2s ease',
                pointerEvents: hoveredEvent ? 'auto' : 'none',
              }}
            >
              {hoveredEvent && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-editorial text-base leading-tight" style={{ color: theme.textPrimary }}>{hoveredEvent.name}</p>
                    <p className="label-micro mt-1" style={{ color: theme.textSecondary }}>{hoveredEvent.city} · {hoveredEvent.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-editorial text-xl text-primary">{hoveredEvent.tickets.toLocaleString()}</p>
                    <p className="label-micro" style={{ color: hoveredEvent.selling ? '#9580ff' : theme.textSecondary }}>
                      {hoveredEvent.selling ? '🔥 selling fast' : 'tickets left'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Legend — only when no hover */}
            {!hoveredEvent && (
              <div className="absolute flex flex-col gap-1.5" style={{ bottom: '12px', right: '12px' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 5px rgba(124,106,247,0.8)' }} />
                  <span className="label-micro" style={{ color: theme.textSecondary }}>Selling fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: theme.dotAvailable }} />
                  <span className="label-micro" style={{ color: theme.textSecondary }}>Available</span>
                </div>
              </div>
            )}

            {/* Scroll hint — disappears after first zoom */}
            {zoom === 1 && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ opacity: 0.25 }}
              >
                <p className="label-micro text-center" style={{ color: theme.textPrimary }}>Scroll to zoom · Drag to pan</p>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Live ticker */}
            <div
              className="rounded-2xl p-5 flex-shrink-0"
              style={{ background: theme.panelBg, outline: `1px solid ${theme.panelBorder}`, transition: 'background 0.6s ease' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="label-micro text-primary">Live bookings</p>
              </div>
              <div className="h-12 overflow-hidden relative">
                <div key={tickerIndex} style={{ animation: 'ticker-slide 3s ease-in-out forwards' }}>
                  <p className="font-editorial text-base text-on_surface leading-tight">{current.name}</p>
                  <p className="label-micro text-on_surface_variant mt-0.5">just booked · {current.event}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {['#7c6af7', '#4f3fe0', '#9580ff', '#b8b0ff', '#2c334f'].map((bg, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-surface_container_low" style={{ background: bg }} />
                  ))}
                </div>
                <p className="label-micro text-on_surface_variant">+{(totalBooked % 200 + 40)} booking now</p>
              </div>
            </div>

            {/* Hot events */}
            <div
              className="rounded-2xl p-5 flex-1"
              style={{ background: theme.panelBg, outline: `1px solid ${theme.panelBorder}`, transition: 'background 0.6s ease' }}
            >
              <p className="label-micro text-on_surface_variant mb-4">Hottest right now</p>
              <div className="space-y-4">
                {EVENTS.filter((e) => e.selling)
                  .sort((a, b) => b.tickets - a.tickets)
                  .slice(0, 4)
                  .map((event, i) => (
                    <a key={event.id} href="/explore" className="flex items-center gap-3 group">
                      <span className="font-editorial text-2xl text-surface_container_highest w-6 text-center leading-none group-hover:text-primary transition-colors">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on_surface text-sm font-medium truncate group-hover:text-primary_container transition-colors">
                          {event.name}
                        </p>
                        <p className="label-micro text-on_surface_variant truncate">{event.city} · {event.tag}</p>
                      </div>
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

            {/* Time indicator */}
            <div
              className="rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ background: theme.panelBg, outline: `1px solid ${theme.panelBorder}`, transition: 'background 0.6s ease' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '14px' }}>{isNight ? '🌙' : '☀️'}</span>
                <span className="label-micro text-on_surface_variant">
                  {isNight ? 'Night mode' : 'Day mode'} {isAuto ? '(auto)' : '(manual)'}
                </span>
              </div>
              {!isAuto && (
                <button
                  onClick={resetAuto}
                  className="label-micro text-primary hover:underline"
                >
                  Reset to auto
                </button>
              )}
            </div>

            {/* CTA */}
            <a href="/explore" className="btn-primary block text-center py-3.5 text-white font-semibold text-sm rounded-full">
              Catch tonight's events →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
