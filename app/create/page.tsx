import Link from 'next/link'
import { QREditor } from '@/components/QREditor'

export default function CreatePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ fontSize: '13px', color: 'var(--text-2)', textDecoration: 'none' }}>← Dashboard</Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Nuevo QR</span>
        </div>
      </nav>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        <QREditor baseUrl={baseUrl} />
      </div>
    </div>
  )
}
