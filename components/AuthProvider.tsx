'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setLoading(false)
        return
      }
      if (!data.user) {
        setLoading(false)
        return
      }
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        })
      } else {
        if (_event === 'SIGNED_OUT') logout()
        else setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}