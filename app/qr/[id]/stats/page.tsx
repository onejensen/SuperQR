import Link from 'next/link'
import { getQRCode, getQRStats } from '@/lib/actions'
import { StatsChart } from '@/components/StatsChart'
import { DESTINATION_LABELS } from '@/lib/qr/destinations'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StatsPage({ params }: Props) {
  const { id } = await params
  const [qr, stats] = await Promise.all([getQRCode(id), getQRStats(id)])
  const dest = DESTINATION_LABELS[qr.destination_type]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/qr/${id}`} className="text-sm text-gray-500 hover:text-gray-700">{qr.name}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-900">Estadísticas</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total escaneos</p>
            <p className="text-4xl font-bold text-indigo-600">{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Destino</p>
            <p className="text-sm font-medium text-gray-900">{dest.icon} {dest.label}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{qr.destination_value}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-4">Escaneos — últimos 30 días</p>
          <StatsChart data={stats.daily} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Link corto</p>
          <code className="text-indigo-600 text-sm">{baseUrl}/r/{qr.slug}</code>
        </div>
      </div>
    </div>
  )
}
