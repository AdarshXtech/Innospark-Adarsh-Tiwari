'use client'

import { supabase } from '@/lib/supabase'

export default function LogoutButton({ email }: { email: string }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-on_surface_variant text-sm truncate max-w-[160px]">{email}</span>
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
      >
        Logout
      </button>
    </div>
  )
}
