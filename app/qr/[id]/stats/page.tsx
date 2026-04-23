import Link from 'next/link'
import { getQRCode, getQRStats } from '@/lib/actions'
import { StatsChart } from '@/components/StatsChart'
import { DESTINATION_LABELS } from '@/lib/qr/destinations'

interface Props { params: Promise<{ id: string }> }

export default async function StatsPage({ params }: Props) {
  const { id } = await params
  const [qr, stats] = await Promise.all([getQRCode(id), getQRStats(id)])
  const dest = DESTINATION_LABELS[qr.destination_type as keyof typeof DESTINATION_LABELS]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ fontSize: '13px', color: 'var(--text-2)', textDecoration: 'none' }}>← Dashboard</Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <Link href={`/qr/${id}`} style={{ fontSize: '13px', color: 'var(--text-2)', textDecoration: 'none' }}>{qr.name}</Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Estadísticas</span>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Total escaneos</div>
            <div style={{ fontSize: '48px', fontWeight: 700, color: 'var(--brand)', letterSpacing: '-2px', lineHeight: 1 }}>{stats.total.toLocaleString()}</div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Destino</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{dest.icon} {dest.label}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{qr.destination_value}</div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Escaneos — últimos 30 días</div>
          <StatsChart data={stats.daily} />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Link corto</div>
          <code style={{ fontSize: '13px', color: 'var(--brand)', fontFamily: 'monospace' }}>{baseUrl}/r/{qr.slug}</code>
        </div>
      </div>
    </div>
  )
}
