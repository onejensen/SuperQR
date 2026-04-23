import Link from 'next/link'
import { deleteQRCode } from '@/lib/actions'
import { DESTINATION_LABELS } from '@/lib/qr/destinations'
import type { QRCodeWithScanCount } from '@/lib/types'

export function QRCard({ qr, baseUrl }: { qr: QRCodeWithScanCount; baseUrl: string }) {
  const dest = DESTINATION_LABELS[qr.destination_type]

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* Color swatch */}
      <div style={{ width: '48px', height: '48px', borderRadius: '8px', flexShrink: 0, background: `repeating-conic-gradient(${qr.fg_color} 0% 25%, ${qr.bg_color} 0% 50%) 0 0 / 8px 8px`, border: '1px solid var(--border)' }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qr.name}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '2px' }}>{dest.icon} {dest.label} · {qr.destination_value}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px', fontFamily: 'monospace' }}>{baseUrl}/r/{qr.slug}</div>
      </div>

      {/* Scan count */}
      <div style={{ textAlign: 'right', flexShrink: 0, paddingRight: '8px' }}>
        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--brand)', letterSpacing: '-0.5px', lineHeight: 1 }}>{qr.scan_count}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>escaneos</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <Link href={`/qr/${qr.id}`} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--text)', textDecoration: 'none', background: 'var(--surface)' }}>
          Editar
        </Link>
        <Link href={`/qr/${qr.id}/stats`} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--text)', textDecoration: 'none', background: 'var(--surface)' }}>
          Stats
        </Link>
        <form action={deleteQRCode.bind(null, qr.id)}>
          <button type="submit" style={{ padding: '6px 10px', border: '1px solid #FCD9D0', borderRadius: '8px', fontSize: '12px', color: '#C0392B', background: '#FFF8F7', cursor: 'pointer', fontFamily: 'inherit' }}>
            ✕
          </button>
        </form>
      </div>
    </div>
  )
}
