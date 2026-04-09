'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

function getTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = -new Date().getTimezoneOffset()
    const sign = offset >= 0 ? '+' : '-'
    const abs = Math.abs(offset)
    const hh = String(Math.floor(abs / 60)).padStart(2, '0')
    const mm = String(abs % 60).padStart(2, '0')
    // Shorten known timezone names to city
    const cityMap: Record<string, string> = {
      'Asia/Calcutta': 'Calcutta',
      'Asia/Kolkata': 'Calcutta',
      'Asia/Mumbai': 'Mumbai',
      'America/New_York': 'New York',
      'America/Los_Angeles': 'Los Angeles',
      'Europe/London': 'London',
      'Europe/Paris': 'Paris',
      'Asia/Tokyo': 'Tokyo',
      'Asia/Dubai': 'Dubai',
    }
    const city = cityMap[tz] ?? tz.split('/').pop()?.replace('_', ' ') ?? tz
    return `GMT${sign}${hh}:${mm} ${city}`
  } catch {
    return 'GMT+00:00'
  }
}

export default function LiveClock() {
  const { mode } = useTheme()
  const isNight = mode === 'night'
  const [now, setNow] = useState<Date | null>(null)
  const [tz] = useState(getTimezone)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  const timeStr = `${h12}:${String(m).padStart(2, '0')} ${ampm}`

  const color = isNight ? 'rgba(226,228,240,0.55)' : 'rgba(26,26,46,0.45)'

  return (
    <p
      className="select-none tabular-nums"
      style={{
        fontFamily: "'Space Grotesk', monospace",
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        color,
        transition: 'color 0.4s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {timeStr} {tz}
    </p>
  )
}
