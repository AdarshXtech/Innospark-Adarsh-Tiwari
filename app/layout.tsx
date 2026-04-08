import type { Metadata } from 'next'
import './globals.css'
import AIConcierge from '../components/AIConcierge'

export const metadata: Metadata = {
  title: 'LocalTix — Discover & Book Local Events',
  description: 'Find and book tickets for nearby events, festivals, and experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-surface text-on_surface min-h-screen">
        {children}
        <AIConcierge />
      </body>
    </html>
  )
}
