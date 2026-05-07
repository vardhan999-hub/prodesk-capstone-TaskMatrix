'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getStrength(p: string) {
  if (!p) return { label: '', color: '#eee', width: '0%' }
  if (p.length < 6) return { label: 'Too short', color: '#e53935', width: '25%' }
  if (p.length < 8) return { label: 'Weak', color: '#ff9800', width: '50%' }
  if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Medium', color: '#fbc02d', width: '75%' }
  return { label: 'Strong', color: '#4caf50', width: '100%' }
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const strength = getStrength(password)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Full name is required'
    if (!email) e.email = 'Email is required'
    else if (!validateEmail(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleRegister = async () => {
    if (!validate()) return
    setLoading(true)
    setErrors({})
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { name: name.trim() } },
      })
      if (authError) { setErrors({ general: authError.message }); setLoading(false); return }
      if (data.user) {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch {
      setErrors({ general: 'Network error. Please check your connection.' })
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Left */}
      <div style={{ width: '45%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ width: '44px', height: '44px', background: '#6c63ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '16px' }}>TM</div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>TaskMatrix</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: '1.2', margin: '0 0 16px' }}>
          Join thousands of<br /><span style={{ color: '#6c63ff' }}>productive teams</span><br />today.
        </h1>
        <p style={{ color: '#8888aa', fontSize: '15px', lineHeight: '1.7', margin: '0 0 40px' }}>
          Create your free account and start managing projects like a professional.
        </p>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[['Free', 'Forever'], ['5 min', 'Setup'], ['No', 'Credit Card']].map(([num, label]) => (
            <div key={label}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>{num}</p>
              <p style={{ fontSize: '12px', color: '#8888aa', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>Create account</h2>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 28px' }}>Start your free workspace today</p>

          {errors.general && <div style={{ background: '#fce4e4', border: '1px solid #f5c6c6', color: '#c62828', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>⚠️ {errors.general}</div>}
          {success && <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', color: '#2e7d32', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>✅ {success}</div>}

          {[
            { label: 'Full Name', key: 'name', value: name, setter: setName, type: 'text', placeholder: 'Harsha Vardhan' },
            { label: 'Email address', key: 'email', value: email, setter: setEmail, type: 'email', placeholder: 'you@taskmatrix.com' },
          ].map(({ label, key, value, setter, type, placeholder }) => (
            <div key={key} style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>{label}</label>
              <input type={type} value={value}
                onChange={(e) => { setter(e.target.value); setErrors(p => ({ ...p, [key]: '' })) }}
                placeholder={placeholder}
                style={{ width: '100%', border: `1.5px solid ${errors[key] ? '#e53935' : '#e8eaed'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Segoe UI, sans-serif' }}
                onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
                onBlur={(e) => e.target.style.borderColor = errors[key] ? '#e53935' : '#e8eaed'} />
              {errors[key] && <p style={{ color: '#e53935', fontSize: '12px', margin: '4px 0 0' }}>{errors[key]}</p>}
            </div>
          ))}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
              placeholder="Min. 6 characters"
              style={{ width: '100%', border: `1.5px solid ${errors.password ? '#e53935' : '#e8eaed'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }}
              onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#e53935' : '#e8eaed'} />
            {password && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '2px', transition: 'all 0.3s' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 0' }}>Strength: <strong>{strength.label}</strong></p>
              </div>
            )}
            {errors.password && <p style={{ color: '#e53935', fontSize: '12px', margin: '4px 0 0' }}>{errors.password}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
            <input type="password" value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })) }}
              placeholder="Re-enter your password"
              style={{ width: '100%', border: `1.5px solid ${errors.confirm ? '#e53935' : '#e8eaed'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' }}
              onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
              onBlur={(e) => e.target.style.borderColor = errors.confirm ? '#e53935' : '#e8eaed'} />
            {errors.confirm && <p style={{ color: '#e53935', fontSize: '12px', margin: '4px 0 0' }}>{errors.confirm}</p>}
          </div>

          <button onClick={handleRegister} disabled={loading}
            style={{ width: '100%', background: loading ? '#aaa' : '#1a1a2e', color: 'white', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px', fontFamily: 'Segoe UI, sans-serif' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#6c63ff' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1a1a2e' }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}