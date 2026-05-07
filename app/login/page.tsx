'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)
  const router = useRouter()

  const validate = () => {
    let valid = true
    setEmailError('')
    setPasswordError('')
    if (!email) { setEmailError('Email is required'); valid = false }
    else if (!validateEmail(email)) { setEmailError('Enter a valid email address'); valid = false }
    if (!password) { setPasswordError('Password is required'); valid = false }
    else if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); valid = false }
    return valid
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    setGeneralError('')
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setGeneralError(authError.message); setLoading(false); return }
      if (data.user) {
        setToast(true)
        router.push('/dashboard')
      } else {
        setGeneralError('Login failed. Please confirm your email or check your credentials.')
        setLoading(false)
      }
    } catch {
      setGeneralError('Network error. Please check your connection.')
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0 }}>
      {toast && (
        <div style={{ position: 'fixed', top: '16px', right: '16px', background: '#4caf50', color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, zIndex: 9999 }}>
          ✅ Login successful! Redirecting...
        </div>
      )}

      {/* Left Panel */}
      <div style={{ width: '45%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ width: '44px', height: '44px', background: '#6c63ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '16px' }}>TM</div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>TaskMatrix</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: '1.2', margin: '0 0 16px' }}>
          Manage projects.<br /><span style={{ color: '#6c63ff' }}>Ship faster.</span><br />Together.
        </h1>
        <p style={{ color: '#8888aa', fontSize: '15px', lineHeight: '1.7', margin: '0 0 40px' }}>
          The all-in-one project management tool for modern software teams.
        </p>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[['500+', 'Teams'], ['10K+', 'Tasks'], ['99%', 'Uptime']].map(([num, label]) => (
            <div key={label}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>{num}</p>
              <p style={{ fontSize: '12px', color: '#8888aa', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>Welcome back</h2>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 28px' }}>Sign in to your workspace</p>

          {generalError && (
            <div style={{ background: '#fce4e4', border: '1px solid #f5c6c6', color: '#c62828', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {generalError}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Email address</label>
            <input type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="you@taskmatrix.com"
              style={{ width: '100%', border: `1.5px solid ${emailError ? '#e53935' : '#e8eaed'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }}
              onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
              onBlur={(e) => e.target.style.borderColor = emailError ? '#e53935' : '#e8eaed'} />
            {emailError && <p style={{ color: '#e53935', fontSize: '12px', margin: '4px 0 0' }}>{emailError}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••••"
              style={{ width: '100%', border: `1.5px solid ${passwordError ? '#e53935' : '#e8eaed'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }}
              onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
              onBlur={(e) => e.target.style.borderColor = passwordError ? '#e53935' : '#e8eaed'} />
            {passwordError && <p style={{ color: '#e53935', fontSize: '12px', margin: '4px 0 0' }}>{passwordError}</p>}
          </div>

          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', background: loading ? '#aaa' : '#1a1a2e', color: 'white', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px', fontFamily: 'Segoe UI, sans-serif' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#6c63ff' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1a1a2e' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}