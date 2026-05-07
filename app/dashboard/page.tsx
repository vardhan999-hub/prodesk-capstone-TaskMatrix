'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import { LayoutDashboard, Users, Activity, LogOut, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      }
    })
  }, [])

  const handleLogout = async () => {
    try { await supabase.auth.signOut() } catch { }
    logout()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', background: '#6c63ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '16px', margin: '0 auto 16px' }}>TM</div>
          <p style={{ color: '#888', fontSize: '14px' }}>Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const initials = user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Board', path: '/dashboard', active: true },
    { icon: <Users size={18} />, label: 'Team', path: '/team', active: false },
    { icon: <Activity size={18} />, label: 'Activity', path: '/activity', active: false },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{ width: '220px', minWidth: '220px', background: '#1a1a2e', display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: '#6c63ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '13px' }}>TM</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>TaskMatrix</div>
              <div style={{ color: '#8888aa', fontSize: '11px' }}>Project Management</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>
              {initials}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: '#6c63ff', fontSize: '11px' }}>Member</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{ fontSize: '10px', color: '#555577', fontWeight: 600, letterSpacing: '0.08em', padding: '0 8px', marginBottom: '8px' }}>NAVIGATION</div>
          {navItems.map((item) => (
            <button key={item.label} onClick={() => router.push(item.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '2px', background: item.active ? 'rgba(108,99,255,0.15)' : 'transparent', color: item.active ? '#a09af5' : '#8888aa', fontSize: '14px', fontWeight: item.active ? 600 : 400, textAlign: 'left' }}
              onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white' } }}
              onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8888aa' } }}>
              {item.icon}
              {item.label}
              {item.active && <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#6c63ff' }} />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#8888aa', fontSize: '14px', textAlign: 'left' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8888aa' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f5f6fa' }}>

        {/* Header */}
        <div style={{ height: '56px', minHeight: '56px', background: 'white', borderBottom: '1px solid #e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '15px' }}>Project Alpha</span>
            <span style={{ color: '#ccc' }}>/</span>
            <span style={{ color: '#888', fontSize: '14px' }}>Sprint 3</span>
            <span style={{ fontSize: '11px', background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>Logged in as</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>{user.name}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700 }}>
              {initials}
            </div>
          </div>
        </div>

        {/* Board */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <KanbanBoard />
        </div>
      </div>
    </div>
  )
}