'use client'

import { useState, useRef } from 'react'
import { useTheme } from '../../../components/ThemeProvider'

const THEMES_LIST = [
  { id: 'minimal', label: 'Minimal', preview: '#1e2438' },
  { id: 'vibrant', label: 'Vibrant', preview: 'linear-gradient(135deg,#7c6af7,#4f3fe0)' },
  { id: 'neon', label: 'Neon', preview: 'linear-gradient(135deg,#00f5a0,#00d9f5)' },
  { id: 'warm', label: 'Warm', preview: 'linear-gradient(135deg,#f7956a,#e07c4f)' },
]

const CALENDARS = [
  { id: 'personal', label: 'Personal Calendar', color: '#b8a4e4' },
  { id: 'work', label: 'Work Calendar', color: '#7c6af7' },
]

const CATEGORIES = ['Music', 'Tech', 'Food', 'Comedy', 'Wellness', 'Art', 'Sports', 'University Fest', 'Film', 'Workshop']
const TIMEZONES = ['GMT+5:30 · Calcutta', 'GMT+0:00 · UTC', 'GMT+5:30 · Mumbai', 'GMT+1:00 · London']
const VISIBILITY = ['Public', 'Private', 'Unlisted']

export default function CreateEventPage() {
  const { mode } = useTheme()
  const isNight = mode === 'night'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Music')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('14:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('15:00')
  const [timezone, setTimezone] = useState(TIMEZONES[0])
  const [location, setLocation] = useState('')
  const [visibility, setVisibility] = useState('Public')
  const [selectedCalendar, setSelectedCalendar] = useState('personal')
  const [showCalendarMenu, setShowCalendarMenu] = useState(false)
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
  const [theme, setTheme] = useState('minimal')
  const [ticketPrice, setTicketPrice] = useState('')
  const [requireApproval, setRequireApproval] = useState(false)
  const [capacity, setCapacity] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const cal = CALENDARS.find((c) => c.id === selectedCalendar)!

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCoverImage(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !startDate) return
    setSubmitting(true)

    try {
      const eventDatetime = `${startDate}T${startTime}:00`

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          event_date: eventDatetime,
          location: location,
          status: 'published',
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error) || 'Failed to create event')

      // Always create a default ticket tier
      if (data.id) {
        await fetch('/api/events/' + data.id + '/tiers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: data.id,
            name: 'General Admission',
            price: ticketPrice ? parseFloat(ticketPrice) : 0,
            capacity: capacity ? parseInt(capacity) : null,
          }),
        })
      }

      window.location.href = '/explore'
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // Shared style tokens
  const surface = isNight
    ? 'rgba(30,36,56,0.7)'
    : 'rgba(255,255,255,0.7)'
  const border = isNight
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(0,0,0,0.08)'
  const inputBg = isNight
    ? 'rgba(14,17,23,0.6)'
    : 'rgba(255,255,255,0.8)'
  const inputBorder = isNight
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(0,0,0,0.1)'
  const textPrimary = isNight ? '#e2e4f0' : '#1a1a2e'
  const textMuted = isNight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const menuBg = isNight ? '#1e2438' : '#ffffff'
  const menuBorder = isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const menuHover = isNight ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  const inputClass: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: textPrimary,
    borderRadius: '12px',
    padding: '10px 14px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelClass: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: textMuted,
    marginBottom: '6px',
    display: 'block',
  }

  const sectionCard: React.CSSProperties = {
    background: surface,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${border}`,
    borderRadius: '20px',
    padding: '24px',
    transition: 'background 0.4s ease',
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: 'var(--bg)', transition: 'background 0.4s ease' }}
      onClick={() => { setShowCalendarMenu(false); setShowVisibilityMenu(false) }}
    >
      {/* Nav */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <div className="flex items-center gap-6">
          <a href="/explore" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">Explore</a>
          <a href="/dashboard" className="text-on_surface_variant hover:text-on_surface text-sm font-medium transition-colors">Dashboard</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Page header */}
        <div className="mb-8">
          <p className="label-micro text-primary mb-2">Organizer · New</p>
          <h1 className="font-editorial text-display-sm text-on_surface">Create Event</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* LEFT: cover + theme */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Cover image */}
              <div style={sectionCard}>
                <label style={labelClass}>Cover Image</label>
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    height: '260px',
                    background: coverImage ? 'transparent' : (isNight ? '#0e1117' : '#e4e8f2'),
                    border: `2px dashed ${coverImage ? 'transparent' : inputBorder}`,
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  {coverImage ? (
                    <>
                      <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.45)' }}
                      >
                        <span className="text-white text-sm font-medium">Change photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: isNight ? 'rgba(124,106,247,0.15)' : 'rgba(124,106,247,0.1)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium" style={{ color: textMuted }}>Click to upload</p>
                      <p className="text-xs" style={{ color: textMuted }}>PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Theme picker */}
              <div style={sectionCard}>
                <label style={labelClass}>Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES_LIST.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: theme === t.id
                          ? (isNight ? 'rgba(124,106,247,0.15)' : 'rgba(124,106,247,0.1)')
                          : inputBg,
                        border: `1px solid ${theme === t.id ? 'rgba(124,106,247,0.4)' : inputBorder}`,
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-md flex-shrink-0"
                        style={{ background: t.preview, border: `1px solid ${border}` }}
                      />
                      <span className="text-xs font-medium" style={{ color: theme === t.id ? '#7c6af7' : textPrimary }}>
                        {t.label}
                      </span>
                      {theme === t.id && (
                        <svg className="ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Options */}
              <div style={sectionCard}>
                <label style={labelClass}>Event Options</label>
                <div className="space-y-1">

                  {/* Ticket Price */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                      <span className="text-sm font-medium" style={{ color: textPrimary }}>Ticket Price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Free"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        className="text-right text-sm w-20 bg-transparent outline-none"
                        style={{ color: ticketPrice ? '#7c6af7' : textMuted }}
                        min="0"
                      />
                      {ticketPrice && <span className="text-xs" style={{ color: textMuted }}>₹</span>}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Require Approval */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span className="text-sm font-medium" style={{ color: textPrimary }}>Require Approval</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRequireApproval((v) => !v)}
                      className="relative w-10 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{ background: requireApproval ? '#7c6af7' : (isNight ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                        style={{ left: requireApproval ? '18px' : '2px' }}
                      />
                    </button>
                  </div>

                  {/* Capacity */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span className="text-sm font-medium" style={{ color: textPrimary }}>Capacity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Unlimited"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="text-right text-sm w-24 bg-transparent outline-none"
                        style={{ color: capacity ? '#7c6af7' : textMuted }}
                        min="1"
                      />
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: main form */}
            <div className="lg:col-span-3 flex flex-col gap-5">

              {/* Top bar: Calendar + Visibility */}
              <div className="flex items-center gap-3">

                {/* Calendar selector */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => { setShowCalendarMenu((v) => !v); setShowVisibilityMenu(false) }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all"
                    style={{
                      background: surface,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${border}`,
                      color: textPrimary,
                    }}
                  >
                    <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: cal.color }} />
                    {cal.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {showCalendarMenu && (
                    <div
                      className="absolute top-full left-0 mt-2 w-72 rounded-2xl py-3 z-50 shadow-xl"
                      style={{ background: menuBg, border: `1px solid ${menuBorder}` }}
                    >
                      <p className="px-4 py-1 text-xs font-semibold" style={{ color: textMuted }}>
                        Choose the calendar of the event:
                      </p>
                      {CALENDARS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => { setSelectedCalendar(c.id); setShowCalendarMenu(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left"
                          style={{
                            color: textPrimary,
                            background: selectedCalendar === c.id ? menuHover : 'transparent',
                          }}
                        >
                          <span className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                          {c.label}
                          {selectedCalendar === c.id && (
                            <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      ))}
                      <div style={{ borderTop: `1px solid ${menuBorder}`, margin: '4px 0' }} />
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left"
                        style={{ color: '#7c6af7' }}
                      >
                        <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ border: `1.5px solid #7c6af7` }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="3">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </span>
                        Create Calendar
                      </button>
                      <div
                        className="mx-3 mt-2 p-3 rounded-xl flex gap-2 items-start"
                        style={{ background: isNight ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${menuBorder}` }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" className="flex-shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p className="text-xs" style={{ color: textMuted }}>
                          Creating the event under a calendar grants its admins manage access.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visibility selector */}
                <div className="relative ml-auto" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => { setShowVisibilityMenu((v) => !v); setShowCalendarMenu(false) }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium"
                    style={{
                      background: surface,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${border}`,
                      color: textPrimary,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    {visibility}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {showVisibilityMenu && (
                    <div
                      className="absolute top-full right-0 mt-2 w-36 rounded-2xl py-2 z-50 shadow-xl"
                      style={{ background: menuBg, border: `1px solid ${menuBorder}` }}
                    >
                      {VISIBILITY.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => { setVisibility(v); setShowVisibilityMenu(false) }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left"
                          style={{ color: visibility === v ? '#7c6af7' : textPrimary, background: visibility === v ? menuHover : 'transparent' }}
                        >
                          {v}
                          {visibility === v && (
                            <svg className="ml-auto" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div style={sectionCard}>
                <label style={labelClass}>Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="Give your event a name…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ ...inputClass, fontSize: '18px', fontWeight: 600, padding: '12px 16px' }}
                />
              </div>

              {/* Date & Time */}
              <div style={sectionCard}>
                <label style={labelClass}>Date &amp; Time</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Start */}
                  <div className="sm:col-span-1 space-y-2">
                    <p className="text-xs font-medium" style={{ color: textMuted }}>Start date</p>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1 space-y-2">
                    <p className="text-xs font-medium" style={{ color: textMuted }}>Start time</p>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      style={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1 space-y-2">
                    <p className="text-xs font-medium" style={{ color: textMuted }}>Timezone</p>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={{ ...inputClass, appearance: 'none' as const }}
                    >
                      {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
                    </select>
                  </div>

                  {/* End */}
                  <div className="sm:col-span-1 space-y-2">
                    <p className="text-xs font-medium" style={{ color: textMuted }}>End date</p>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1 space-y-2">
                    <p className="text-xs font-medium" style={{ color: textMuted }}>End time</p>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      style={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={sectionCard}>
                <label style={labelClass}>Event Location</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Add Event Location — offline location or virtual link"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ ...inputClass, paddingLeft: '36px' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={sectionCard}>
                <label style={labelClass}>Description</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3"
                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round"
                  >
                    <line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>
                  </svg>
                  <textarea
                    rows={4}
                    placeholder="Tell attendees what to expect…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputClass, paddingLeft: '36px', resize: 'vertical' as const }}
                  />
                </div>
              </div>

              {/* Category */}
              <div style={sectionCard}>
                <label style={labelClass}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: category === cat
                          ? 'linear-gradient(135deg, #7c6af7, #4f3fe0)'
                          : inputBg,
                        border: `1px solid ${category === cat ? 'transparent' : inputBorder}`,
                        color: category === cat ? '#fff' : textMuted,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
                style={{
                  background: submitting
                    ? 'rgba(124,106,247,0.5)'
                    : 'linear-gradient(135deg, #7c6af7 0%, #4f3fe0 100%)',
                  boxShadow: submitting ? 'none' : '0 4px 24px rgba(124,106,247,0.35)',
                }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating event…
                  </span>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
