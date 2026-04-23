import Link from 'next/link'
import { getQRCodes } from '@/lib/actions'
import { QRCard } from '@/components/QRCard'

export default async function DashboardPage() {
  const qrCodes = await getQRCodes()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const totalScans = qrCodes.reduce((sum, q) => sum + q.scan_count, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            Super<span style={{ color: 'var(--brand)' }}>QR</span>
          </span>
          <Link
            href="/create"
            style={{ background: 'var(--accent)', color: '#fff', padding: '7px 16px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em' }}
          >
            + Nuevo QR
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Códigos activos', value: qrCodes.length, highlight: false },
            { label: 'Total escaneos', value: totalScans.toLocaleString(), highlight: true },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: stat.highlight ? 'var(--brand)' : 'var(--text)', letterSpacing: '-1px', lineHeight: 1 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* List */}
        {qrCodes.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px' }}>No tienes códigos QR aún</div>
            <Link href="/create" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
              Crear tu primer QR →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {qrCodes.map(qr => <QRCard key={qr.id} qr={qr} baseUrl={baseUrl} />)}
          </div>
        )}
      </div>
    </div>
  )
}
