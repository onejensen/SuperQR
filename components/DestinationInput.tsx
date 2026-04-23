'use client'
import { DESTINATION_LABELS } from '@/lib/qr/destinations'
import type { DestinationType } from '@/lib/types'

const DESTINATION_TYPES: DestinationType[] = [
  'url', 'phone', 'whatsapp', 'email',
  'instagram', 'twitter', 'linkedin',
  'tiktok', 'facebook', 'youtube',
]

interface DestinationInputProps {
  type: DestinationType
  value: string
  onTypeChange: (type: DestinationType) => void
  onValueChange: (value: string) => void
}

export function DestinationInput({ type, value, onTypeChange, onValueChange }: DestinationInputProps) {
  const current = DESTINATION_LABELS[type]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        {DESTINATION_TYPES.map(t => {
          const info = DESTINATION_LABELS[t]
          const selected = t === type
          return (
            <button
              key={t}
              type="button"
              onClick={() => onTypeChange(t)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                padding: '8px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: selected ? 600 : 400,
                border: `1px solid ${selected ? 'var(--text)' : 'var(--border)'}`,
                background: selected ? 'var(--text)' : 'var(--surface)',
                color: selected ? '#fff' : 'var(--text-2)',
                cursor: 'pointer', transition: 'all 0.1s', fontFamily: 'inherit'
              }}
            >
              <span style={{ fontSize: '14px' }}>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          )
        })}
      </div>
      <input
        type={type === 'email' ? 'email' : type === 'phone' || type === 'whatsapp' ? 'tel' : 'text'}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder={current.placeholder}
        required
        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface)', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
        onFocus={e => e.target.style.borderColor = 'var(--text)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}
