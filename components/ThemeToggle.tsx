'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { mode, isAuto, toggle, resetAuto } = useTheme()

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <button
        onClick={toggle}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl theme-toggle-btn"
        title={mode === 'night' ? 'Switch to day mode' : 'Switch to night mode'}
      >
        <span className="text-base leading-none transition-transform duration-300" style={{ display: 'inline-block', transform: mode === 'night' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
          {mode === 'night' ? '🌙' : '☀️'}
        </span>
        <span className="text-xs font-semibold tracking-wide theme-toggle-label">
          {mode === 'night' ? 'Night' : 'Day'}
        </span>
        {isAuto && (
          <span className="text-xs theme-toggle-auto px-1.5 py-0.5 rounded-md">auto</span>
        )}
      </button>
      {!isAuto && (
        <button
          onClick={resetAuto}
          className="text-xs theme-toggle-reset px-3 py-1.5 rounded-xl"
        >
          Reset to auto
        </button>
      )}
    </div>
  )
}
