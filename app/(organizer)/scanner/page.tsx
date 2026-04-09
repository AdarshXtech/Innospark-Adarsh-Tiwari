'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../../../components/ThemeProvider'

type ScanResult = {
  id: string
  attendee: string
  event?: string
  tier?: string
  time: string
  status: 'success' | 'already_used' | 'invalid'
}

type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'already_used' | 'invalid'

export default function ScannerPage() {
  const { mode } = useTheme()
  const isNight = mode === 'night'

  const [scanState, setScanState] = useState<ScanState>('idle')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [totalToday, setTotalToday] = useState(0)
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const processingRef = useRef(false)
  const lastScannedRef = useRef<string>('')
  const cooldownRef = useRef(false)

  // Theme tokens
  const surface = isNight ? 'rgba(30,36,56,0.8)' : 'rgba(255,255,255,0.8)'
  const surfaceLow = isNight ? 'rgba(14,17,23,0.6)' : 'rgba(240,242,248,0.7)'
  const border = isNight ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const textPrimary = isNight ? '#e2e4f0' : '#1a1a2e'
  const textMuted = isNight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'

  const statusConfig = {
    idle:        { color: '#7c6af7', bg: 'rgba(124,106,247,0.12)', icon: '📷', label: 'Ready to scan' },
    scanning:    { color: '#7c6af7', bg: 'rgba(124,106,247,0.12)', icon: '🔍', label: 'Scanning…' },
    processing:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '⏳', label: 'Verifying ticket…' },
    success:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '✓',  label: 'Check-in successful!' },
    already_used:{ color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '⚠', label: 'Already checked in' },
    invalid:     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '✕',  label: 'Invalid ticket' },
  }

  // Process QR code value via API
  const processQR = useCallback(async (code: string) => {
    if (processingRef.current || cooldownRef.current) return
    if (code === lastScannedRef.current) return
    processingRef.current = true
    lastScannedRef.current = code
    setScanState('processing')

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: code }),
      })
      const data = await res.json()

      let status: ScanResult['status']
      let attendee = 'Unknown'

      if (res.ok && data.success) {
        status = 'success'
        attendee = data.attendee ?? 'Attendee'
        setTotalToday((n) => n + 1)
      } else if (data.error?.includes('already')) {
        status = 'already_used'
        attendee = data.attendee ?? 'Attendee'
      } else {
        status = 'invalid'
      }

      const result: ScanResult = {
        id: crypto.randomUUID(),
        attendee,
        event: data.event,
        tier: data.tier,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status,
      }

      setScanResult(result)
      setScanState(status)
      setRecentScans((prev) => [result, ...prev].slice(0, 20))

      // Auto-reset after 3s, with 2s cooldown before next scan
      cooldownRef.current = true
      setTimeout(() => {
        setScanState('scanning')
        setScanResult(null)
        processingRef.current = false
        setTimeout(() => { cooldownRef.current = false; lastScannedRef.current = '' }, 1000)
      }, 3000)
    } catch {
      setScanState('invalid')
      setTimeout(() => { setScanState('scanning'); processingRef.current = false; cooldownRef.current = false }, 2000)
    }
  }, [])

  // jsQR-based QR detection loop on canvas
  const tick = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Dynamically import jsQR to avoid SSR issues
    const { default: jsQR } = await import('jsqr')
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' })
    if (code?.data) {
      processQR(code.data)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [processQR])

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsActive(true)
      setScanState('scanning')
      rafRef.current = requestAnimationFrame(tick)
    } catch (err) {
      setCameraError(String(err).includes('NotAllowed') ? 'Camera permission denied. Please allow camera access.' : 'Could not access camera.')
    }
  }, [tick])

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setIsActive(false)
    setScanState('idle')
    processingRef.current = false
    cooldownRef.current = false
    lastScannedRef.current = ''
  }, [])

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); streamRef.current?.getTracks().forEach((t) => t.stop()) }, [])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      processQR(manualCode.trim())
      setManualCode('')
      setShowManual(false)
    }
  }

  const status = statusConfig[scanState]

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', transition: 'background 0.4s' }}>
      {/* Nav */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <div className="flex items-center gap-3">
          <span className="label-micro text-on_surface_variant">Organizer · Scanner</span>
          <a href="/dashboard" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">Dashboard</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-surface_container_highest'}`} />
              <p className="label-micro" style={{ color: isActive ? '#10b981' : textMuted }}>
                {isActive ? 'Camera active' : 'Camera off'}
              </p>
            </div>
            <h1 className="font-editorial text-display-sm text-on_surface">QR Check-in<br /><em className="not-italic text-on_surface_variant">Scanner</em></h1>
          </div>
          <div className="text-right">
            <p className="font-editorial text-4xl text-on_surface tabular-nums">{totalToday}</p>
            <p className="label-micro text-on_surface_variant mt-1">checked in today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* SCANNER PANEL */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Camera viewport */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: '#000',
                aspectRatio: '4/3',
                outline: `1px solid ${border}`,
                transition: 'outline-color 0.3s',
                outlineColor: scanState === 'success' ? 'rgba(16,185,129,0.5)'
                  : scanState === 'invalid' ? 'rgba(239,68,68,0.5)'
                  : scanState === 'already_used' ? 'rgba(245,158,11,0.5)'
                  : border,
              }}
            >
              {/* Video element */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
                style={{ display: isActive ? 'block' : 'none' }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Idle state */}
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                    style={{ background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.2)' }}
                  >
                    📷
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white mb-1">Camera not started</p>
                    <p className="text-sm text-gray-500">Click Start Scanner below</p>
                  </div>
                  {cameraError && (
                    <p className="text-sm text-red-400 text-center max-w-xs px-4">{cameraError}</p>
                  )}
                </div>
              )}

              {/* Scanning overlay — corner brackets */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Dim overlay with hole */}
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
                  {/* Scan frame */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: '55%', aspectRatio: '1' }}
                  >
                    {/* Clear centre */}
                    <div className="absolute inset-0" style={{ background: 'transparent', boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)', borderRadius: '12px' }} />
                    {/* Corners */}
                    {[
                      'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                      'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                      'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                      'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
                    ].map((cls, i) => (
                      <div
                        key={i}
                        className={`absolute w-8 h-8 ${cls}`}
                        style={{
                          borderColor: scanState === 'success' ? '#10b981'
                            : scanState === 'invalid' ? '#ef4444'
                            : scanState === 'already_used' ? '#f59e0b'
                            : '#7c6af7',
                          transition: 'border-color 0.3s',
                        }}
                      />
                    ))}
                    {/* Scan line animation */}
                    {(scanState === 'scanning' || scanState === 'idle') && (
                      <div
                        className="absolute left-2 right-2 h-px"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #7c6af7, transparent)',
                          animation: 'scan-line 2s ease-in-out infinite',
                          top: '50%',
                        }}
                      />
                    )}
                  </div>

                  {/* Status badge */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl flex items-center gap-2.5"
                    style={{
                      background: status.bg,
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${status.color}33`,
                      transition: 'all 0.3s',
                    }}
                  >
                    <span className="text-base leading-none">{status.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: status.color }}>{status.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Scan line keyframe */}
            <style>{`
              @keyframes scan-line {
                0%   { top: 10%; opacity: 0; }
                10%  { opacity: 1; }
                90%  { opacity: 1; }
                100% { top: 90%; opacity: 0; }
              }
            `}</style>

            {/* Result card */}
            {scanResult && (
              <div
                className="rounded-2xl p-5 flex items-center gap-4 transition-all"
                style={{
                  background: surface,
                  border: `1px solid ${
                    scanResult.status === 'success' ? 'rgba(16,185,129,0.3)'
                    : scanResult.status === 'already_used' ? 'rgba(245,158,11,0.3)'
                    : 'rgba(239,68,68,0.3)'
                  }`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: statusConfig[scanResult.status].bg }}
                >
                  {statusConfig[scanResult.status].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-editorial text-lg leading-tight" style={{ color: textPrimary }}>{scanResult.attendee}</p>
                  {scanResult.event && <p className="label-micro mt-0.5" style={{ color: textMuted }}>{scanResult.event}{scanResult.tier ? ` · ${scanResult.tier}` : ''}</p>}
                  <p className="label-micro mt-0.5" style={{ color: textMuted }}>{scanResult.time}</p>
                </div>
                <div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: statusConfig[scanResult.status].bg, color: statusConfig[scanResult.status].color }}
                  >
                    {scanResult.status === 'success' ? 'Checked In' : scanResult.status === 'already_used' ? 'Used' : 'Invalid'}
                  </span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              {!isActive ? (
                <button
                  onClick={startCamera}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#7c6af7,#4f3fe0)', boxShadow: '0 4px 20px rgba(124,106,247,0.35)' }}
                >
                  Start Scanner
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98]"
                  style={{ background: surfaceLow, border: `1px solid ${border}`, color: textPrimary }}
                >
                  Stop Scanner
                </button>
              )}
              <button
                onClick={() => setShowManual((v) => !v)}
                className="px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: showManual ? 'rgba(124,106,247,0.15)' : surfaceLow,
                  border: `1px solid ${showManual ? 'rgba(124,106,247,0.4)' : border}`,
                  color: showManual ? '#7c6af7' : textMuted,
                }}
              >
                Manual
              </button>
            </div>

            {/* Manual entry */}
            {showManual && (
              <form
                onSubmit={handleManualSubmit}
                className="rounded-2xl p-4 flex gap-3"
                style={{ background: surfaceLow, border: `1px solid ${border}` }}
              >
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Paste booking ID or QR code data…"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: textPrimary }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c6af7,#4f3fe0)' }}
                >
                  Verify
                </button>
              </form>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-3 rounded-2xl p-4"
              style={{ background: surface, border: `1px solid ${border}`, backdropFilter: 'blur(20px)' }}
            >
              {[
                { label: 'Checked In', value: totalToday, color: '#10b981' },
                { label: 'Failed', value: recentScans.filter(s => s.status === 'invalid').length, color: '#ef4444' },
                { label: 'Duplicate', value: recentScans.filter(s => s.status === 'already_used').length, color: '#f59e0b' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className="font-editorial text-2xl tabular-nums" style={{ color }}>{value}</p>
                  <p className="label-micro mt-1" style={{ color: textMuted }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Recent scans list */}
            <div
              className="rounded-2xl flex-1 overflow-hidden"
              style={{ background: surface, border: `1px solid ${border}`, backdropFilter: 'blur(20px)' }}
            >
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${border}` }}>
                <p className="label-micro text-on_surface_variant">Recent scans</p>
                {recentScans.length > 0 && (
                  <button onClick={() => setRecentScans([])} className="label-micro" style={{ color: textMuted }}>Clear</button>
                )}
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
                {recentScans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="text-3xl opacity-30">🎫</div>
                    <p className="text-sm" style={{ color: textMuted }}>No scans yet</p>
                  </div>
                ) : (
                  recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center gap-3 px-5 py-3.5"
                      style={{ borderBottom: `1px solid ${border}` }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: statusConfig[scan.status].bg }}
                      >
                        {statusConfig[scan.status].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>{scan.attendee}</p>
                        <p className="label-micro truncate" style={{ color: textMuted }}>{scan.time}</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: statusConfig[scan.status].bg, color: statusConfig[scan.status].color }}
                      >
                        {scan.status === 'success' ? '✓' : scan.status === 'already_used' ? '⚠' : '✕'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div
              className="rounded-2xl p-4"
              style={{ background: surfaceLow, border: `1px solid ${border}` }}
            >
              <p className="label-micro mb-3" style={{ color: textMuted }}>How to use</p>
              <div className="space-y-2.5">
                {[
                  ['1', 'Click Start Scanner to activate camera'],
                  ['2', 'Point camera at attendee\'s QR ticket'],
                  ['3', 'Green = valid, Orange = already used, Red = invalid'],
                  ['4', 'Use Manual entry to type a code instead'],
                ].map(([n, text]) => (
                  <div key={n} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(124,106,247,0.15)', color: '#7c6af7' }}
                    >
                      {n}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
