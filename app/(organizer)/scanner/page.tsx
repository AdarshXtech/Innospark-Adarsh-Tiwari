'use client'

import { useState } from 'react'

export default function ScannerPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [lastScanned, setLastScanned] = useState<Array<{ name: string; time: string }>>([])

  const handleScan = (result: string) => {
    setScannedCode(result)
    setLastScanned([
      { name: 'Attendee Name', time: new Date().toLocaleTimeString() },
      ...lastScanned,
    ].slice(0, 10))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Check-in Scanner</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera/Scanner area */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg aspect-square flex items-center justify-center text-white text-center">
              <div>
                <p className="text-lg mb-2">📷 QR Scanner</p>
                <p className="text-sm text-gray-400">Camera placeholder — implement html5-qrcode here</p>
              </div>
            </div>

            {scannedCode && (
              <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-green-800 font-semibold">✓ Check-in Successful</p>
                <p className="text-gray-700">Attendee Name checked in at 10:45 AM</p>
              </div>
            )}
          </div>

          {/* Recent check-ins */}
          <div className="bg-white p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Recent Check-ins</h2>
            <div className="space-y-2">
              {lastScanned.length === 0 ? (
                <p className="text-gray-500 text-sm">No check-ins yet</p>
              ) : (
                lastScanned.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 py-2">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">{item.time}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Today's Check-ins</p>
              <p className="text-3xl font-bold text-blue-600">45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
