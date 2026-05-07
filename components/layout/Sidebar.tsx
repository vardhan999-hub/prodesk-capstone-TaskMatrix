'use client'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react'

export default function Sidebar({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="w-16 bg-[#1a1a2e] flex flex-col h-screen items-center py-4 gap-6">
      {/* Logo */}
      <div className="w-10 h-10 bg-[#6c63ff] rounded-lg flex items-center justify-center text-white font-bold text-sm">
        TM
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-4 flex-1">
        <button
          onClick={() => router.push('/dashboard')}
          title="Board"
          className="w-10 h-10 bg-[#6c63ff] rounded-lg flex items-center justify-center text-white hover:bg-[#5a52d5] transition-colors"
        >
          <LayoutDashboard size={18} />
        </button>
        <button
          onClick={() => router.push('/team')}
          title="Team"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8888aa] hover:text-white hover:bg-[#2d2d50] transition-colors"
        >
          <Users size={18} />
        </button>
        <button
          onClick={() => router.push('/activity')}
          title="Activity"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8888aa] hover:text-white hover:bg-[#2d2d50] transition-colors"
        >
          <Activity size={18} />
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8888aa] hover:text-red-400 hover:bg-[#2d2d50] transition-colors"
      >
        <LogOut size={18} />
      </button>
    </div>
  )
}