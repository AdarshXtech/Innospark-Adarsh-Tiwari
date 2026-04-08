export const runtime = 'edge'
export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Glass nav */}
      <nav className="glass-nav sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-editorial text-xl text-on_surface tracking-tight">LocalTix</a>
        <a href="/events/1" className="label-micro text-on_surface_variant hover:text-on_surface transition-colors">← Back</a>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-14">
        <p className="label-micro text-primary mb-3">Almost there</p>
        <h1 className="font-editorial text-display-sm text-on_surface mb-12 leading-tight">
          Complete your<br />booking.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact info */}
            <div className="bg-surface_container_low rounded-2xl p-6">
              <p className="label-micro text-on_surface_variant mb-5">Contact information</p>
              <div className="space-y-4">
                <div>
                  <label className="label-micro text-on_surface_variant block mb-2">Full Name</label>
                  <input type="text" placeholder="Jane Doe" className="input-editorial w-full px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="label-micro text-on_surface_variant block mb-2">Email</label>
                  <input type="email" placeholder="you@example.com" className="input-editorial w-full px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="label-micro text-on_surface_variant block mb-2">Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" className="input-editorial w-full px-4 py-3 text-sm" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-surface_container_low rounded-2xl p-6">
              <p className="label-micro text-on_surface_variant mb-5">Payment method</p>
              <div className="space-y-3">
                {['UPI', 'Credit / Debit Card', 'Net Banking'].map((method, i) => (
                  <label key={method} className="flex items-center gap-4 bg-surface_container rounded-xl px-4 py-3.5 cursor-pointer hover:bg-surface_container_high transition-colors">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-primary' : 'border-surface_container_highest'}`}>
                      {i === 0 && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-on_surface text-sm font-medium">{method}</span>
                  </label>
                ))}
              </div>

              <div className="mt-5">
                <label className="label-micro text-on_surface_variant block mb-2">UPI ID</label>
                <input type="text" placeholder="yourname@upi" className="input-editorial w-full px-4 py-3 text-sm" />
              </div>
            </div>

            <button className="btn-primary w-full py-4 text-white font-semibold text-sm rounded-full">
              Pay & Confirm Booking
            </button>
            <p className="label-micro text-on_surface_variant text-center -mt-4">
              SSL secured · Your data is never stored
            </p>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-surface_container_low rounded-2xl p-6 sticky top-24">
              <p className="label-micro text-on_surface_variant mb-5">Order summary</p>

              {/* Event info */}
              <div className="bg-surface_container rounded-xl p-4 mb-5">
                <div
                  className="h-24 rounded-lg mb-3"
                  style={{ background: 'linear-gradient(135deg, #141821 0%, #1e2438 100%)' }}
                />
                <h3 className="font-editorial text-lg text-on_surface leading-tight mb-1">
                  Monsoon Beats Festival
                </h3>
                <p className="label-micro text-on_surface_variant">APR 20, 2026 · 7:00 PM</p>
                <p className="label-micro text-on_surface_variant mt-0.5">Bandra Amphitheatre, Mumbai</p>
              </div>

              {/* Line items */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-on_surface_variant text-sm">General Admission × 1</span>
                  <span className="text-on_surface text-sm">₹799</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on_surface_variant text-sm">Platform fee</span>
                  <span className="text-on_surface text-sm">₹20</span>
                </div>
              </div>

              <div
                className="my-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              />

              <div className="flex justify-between">
                <span className="text-on_surface font-semibold">Total</span>
                <span className="font-editorial text-2xl text-on_surface">₹819</span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="label-micro text-on_surface_variant">Instant e-ticket on confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
