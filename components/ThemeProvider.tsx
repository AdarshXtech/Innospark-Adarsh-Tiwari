'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Mode = 'day' | 'night'

interface ThemeCtx {
  mode: Mode
  isAuto: boolean
  toggle: () => void
  resetAuto: () => void
}

const Ctx = createContext<ThemeCtx>({
  mode: 'night',
  isAuto: true,
  toggle: () => {},
  resetAuto: () => {},
})

export function useTheme() {
  return useContext(Ctx)
}

function getTimeMode(): Mode {
  const h = new Date().getHours()
  return h < 6 || h >= 19 ? 'night' : 'day'
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('night')
  const [isAuto, setIsAuto] = useState(true)

  // Init from localStorage or time
  useEffect(() => {
    const stored = localStorage.getItem('localtix-theme')
    if (stored === 'day' || stored === 'night') {
      setMode(stored)
      setIsAuto(false)
    } else {
      setMode(getTimeMode())
      setIsAuto(true)
    }
  }, [])

  // Auto-update every minute when in auto mode
  useEffect(() => {
    if (!isAuto) return
    const id = setInterval(() => setMode(getTimeMode()), 60_000)
    return () => clearInterval(id)
  }, [isAuto])

  // Apply data-theme attribute to <html> for CSS variable switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === 'night' ? 'day' : 'night'
      localStorage.setItem('localtix-theme', next)
      return next
    })
    setIsAuto(false)
  }, [])

  const resetAuto = useCallback(() => {
    localStorage.removeItem('localtix-theme')
    setMode(getTimeMode())
    setIsAuto(true)
  }, [])

  return (
    <Ctx.Provider value={{ mode, isAuto, toggle, resetAuto }}>
      {children}
    </Ctx.Provider>
  )
}
