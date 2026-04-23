'use client'
import { useState, useTransition } from 'react'
import { QRPreview, useQRDownload } from './QRPreview'
import { DestinationInput } from './DestinationInput'
import { createQRCode, updateQRCode } from '@/lib/actions'
import type { QRCode, DestinationType, DotStyle, CornerStyle } from '@/lib/types'

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Cuadrado' },
  { value: 'rounded', label: 'Redondeado' },
  { value: 'dots', label: 'Círculos' },
]

const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: 'square', label: 'Cuadradas' },
  { value: 'rounded', label: 'Redondeadas' },
]

export function QREditor({ qr, baseUrl }: { qr?: QRCode; baseUrl: string }) {
  const [name, setName] = useState(qr?.name ?? '')
  const [destType, setDestType] = useState<DestinationType>(qr?.destination_type ?? 'url')
  const [destValue, setDestValue] = useState(qr?.destination_value ?? '')
  const [fgColor, setFgColor] = useState(qr?.fg_color ?? '#1A1917')
  const [bgColor, setBgColor] = useState(qr?.bg_color ?? '#F9F8F6')
  const [dotStyle, setDotStyle] = useState<DotStyle>(qr?.dot_style ?? 'square')
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>(qr?.corner_style ?? 'square')
  const [isPending, startTransition] = useTransition()

  const previewUrl = qr ? `${baseUrl}/r/${qr.slug}` : `${baseUrl}/r/preview`
  const { download } = useQRDownload(previewUrl, fgColor, bgColor, dotStyle, cornerStyle)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input = { name, destination_type: destType, destination_value: destValue, fg_color: fgColor, bg_color: bgColor, dot_style: dotStyle, corner_style: cornerStyle }
    startTransition(async () => {
      if (qr) await updateQRCode(qr.id, input)
      else await createQRCode(input)
    })
  }

  const section = (label: string, children: React.ReactNode) => (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{label}</div>
      {children}
    </div>
  )

  const styleBtn = (selected: boolean) => ({
    padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: selected ? 600 : 400,
    border: `1px solid ${selected ? 'var(--text)' : 'var(--border)'}`,
    background: selected ? 'var(--text)' : 'var(--surface)',
    color: selected ? '#fff' : 'var(--text-2)',
    cursor: 'pointer', transition: 'all 0.1s', fontFamily: 'inherit'
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {section('Nombre', (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Mi Instagram"
            required
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--bg)', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = 'var(--text)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        ))}

        {section('Destino', (
          <DestinationInput type={destType} value={destValue} onTypeChange={t => { setDestType(t); setDestValue('') }} onValueChange={setDestValue} />
        ))}

        {section('Colores', (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[{ label: 'Principal', value: fgColor, onChange: setFgColor }, { label: 'Fondo', value: bgColor, onChange: setBgColor }].map(({ label, value, onChange }) => (
              <div key={label}>
                <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '6px' }}>{label}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={value} onChange={e => onChange(e.target.value)}
                    style={{ width: '34px', height: '34px', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px', cursor: 'pointer', background: 'var(--surface)' }} />
                  <input value={value} onChange={e => onChange(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text)', background: 'var(--surface)' }} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {section('Módulos', (
          <div style={{ display: 'flex', gap: '6px' }}>
            {DOT_STYLES.map(s => (
              <button key={s.value} type="button" onClick={() => setDotStyle(s.value)} style={styleBtn(dotStyle === s.value)}>{s.label}</button>
            ))}
          </div>
        ))}

        {section('Esquinas', (
          <div style={{ display: 'flex', gap: '6px' }}>
            {CORNER_STYLES.map(s => (
              <button key={s.value} type="button" onClick={() => setCornerStyle(s.value)} style={styleBtn(cornerStyle === s.value)}>{s.label}</button>
            ))}
          </div>
        ))}

        <button type="submit" disabled={isPending}
          style={{ marginTop: '4px', padding: '12px', background: isPending ? 'var(--text-3)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          {isPending ? 'Guardando...' : qr ? 'Guardar cambios' : 'Crear QR'}
        </button>
      </form>

      {/* Preview */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'sticky', top: '72px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</div>
        <div style={{ padding: '16px', background: bgColor, borderRadius: '8px', border: '1px solid var(--border)' }}>
          <QRPreview url={previewUrl} fgColor={fgColor} bgColor={bgColor} dotStyle={dotStyle} cornerStyle={cornerStyle} size={180} />
        </div>

        {qr && (
          <>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{name || qr.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}>{baseUrl}/r/{qr.slug}</div>
            </div>

            <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
              {(['png', 'svg'] as const).map(fmt => (
                <button key={fmt} onClick={() => download(fmt, qr.name)}
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text)', fontFamily: 'inherit' }}>
                  ↓ {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Link corto</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <code style={{ flex: 1, fontSize: '11px', color: 'var(--brand)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{baseUrl}/r/{qr.slug}</code>
                <button onClick={() => navigator.clipboard.writeText(`${baseUrl}/r/${qr.slug}`)}
                  style={{ padding: '3px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'inherit', flexShrink: 0 }}>
                  Copiar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
