'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

const PICKS = [
  { title: 'Monsoon Beats Festival', meta: 'TONIGHT · MUMBAI', match: 98, tag: 'Music' },
  { title: 'Jazz Under the Stars', meta: 'FRI · DELHI', match: 96, tag: 'Jazz' },
  { title: 'Indie Film Showcase', meta: 'SAT · BANGALORE', match: 91, tag: 'Film' },
]

const GREETINGS = [
  'Good evening.',
  'Welcome back.',
  'Ready for tonight?',
  'Your picks are ready.',
]

export default function AIConcierge() {
  const { mode } = useTheme()
  const isNight = mode === 'night'
  const [open, setOpen] = useState(false)
  const [greeting, setGreeting] = useState(GREETINGS[0])
  const [typing, setTyping] = useState(true)
  const [visibleText, setVisibleText] = useState('')

  const circleTrack = isNight ? '#222840' : '#d8ddef'

  const message = "I've curated three events matching your taste profile."

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning.')
    else if (hour < 17) setGreeting('Good afternoon.')
    else setGreeting('Good evening.')
  }, [])

  useEffect(() => {
    if (!open) {
      setVisibleText('')
      setTyping(true)
      return
    }
    let i = 0
    setVisibleText('')
    setTyping(true)
    const interval = setInterval(() => {
      if (i < message.length) {
        setVisibleText(message.slice(0, i + 1))
        i++
      } else {
        setTyping(false)
        clearInterval(interval)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [open])

  return (
    <>
      {/* Floating Orb */}
      <button
        onClick={() => setOpen(!open)}
        className={`concierge-orb fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          open ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open AI Concierge"
      >
        <span className="concierge-orb-core">✦</span>
        <span className="concierge-orb-ring" />
        <span className="concierge-orb-ring concierge-orb-ring-2" />
      </button>

      {/* Expanded Panel */}
      <div
        className={`fixed bottom-8 right-8 z-40 w-[380px] max-w-[calc(100vw-2rem)] concierge-panel rounded-3xl overflow-hidden transition-all duration-500 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="label-micro text-primary">The Concierge</span>
            </div>
            <p className="font-editorial text-2xl text-on_surface leading-tight">
              {greeting}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full bg-surface_container_high hover:bg-surface_bright text-on_surface_variant hover:text-on_surface text-sm transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Typing message */}
        <div className="px-6 pb-5">
          <p className="text-on_surface_variant text-sm leading-relaxed min-h-[40px]">
            {visibleText}
            {typing && <span className="concierge-caret">▎</span>}
          </p>
        </div>

        {/* Divider via spacing */}
        <div className="px-6">
          <p className="label-micro text-on_surface_variant mb-3">Concierge picks</p>
        </div>

        {/* Picks */}
        <div className="px-4 pb-4 space-y-2">
          {PICKS.map((pick, i) => (
            <a
              key={pick.title}
              href="/events/1"
              className="concierge-pick group flex items-center gap-3 rounded-2xl p-3 transition-all"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Circular match score */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke={circleTrack} strokeWidth="3" fill="none" />
                  <circle
                    cx="24" cy="24" r="20"
                    stroke="#7c6af7"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(pick.match / 100) * 125.6} 125.6`}
                    className="concierge-match-arc"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(124,106,247,0.6))' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-primary">
                  {pick.match}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-editorial text-base text-on_surface truncate group-hover:text-primary_container transition-colors">
                  {pick.title}
                </p>
                <p className="label-micro text-on_surface_variant truncate">{pick.meta}</p>
              </div>
              <span className="text-on_surface_variant text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 pt-2">
          <a
            href="/explore"
            className="btn-primary block text-center py-3 text-white font-semibold text-xs rounded-full"
          >
            Explore all picks
          </a>
        </div>
      </div>
    </>
  )
}
