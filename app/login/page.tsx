'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>
            Super<span style={{ color: 'var(--brand)' }}>QR</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-2)', fontWeight: 400 }}>
            Códigos QR dinámicos permanentes
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📬</div>
              <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text)', marginBottom: '8px' }}>Revisa tu correo</div>
              <div style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6 }}>
                Enviamos un link de acceso a<br />
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{email}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface)', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--text)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '11px', background: loading ? 'var(--text-3)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', fontFamily: 'inherit' }}
              >
                {loading ? 'Enviando...' : 'Continuar →'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
