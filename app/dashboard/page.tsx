import Link from 'next/link'
import { getQRCodes } from '@/lib/actions'
import { QRCard } from '@/components/QRCard'

export default async function DashboardPage() {
  const qrCodes = await getQRCodes()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  const totalScans = qrCodes.reduce((sum, q) => sum + q.scan_count, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SuperQR</h1>
            <p className="text-sm text-gray-500 mt-0.5">{qrCodes.length} código{qrCodes.length !== 1 ? 's' : ''} activo{qrCodes.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700">
            + Nuevo QR
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total QRs</p>
            <p className="text-3xl font-bold text-gray-900">{qrCodes.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total escaneos</p>
            <p className="text-3xl font-bold text-indigo-600">{totalScans.toLocaleString()}</p>
          </div>
        </div>

        {qrCodes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-sm">No tienes códigos QR aún</p>
            <Link href="/create" className="mt-3 inline-block text-indigo-600 text-sm font-medium hover:text-indigo-700">
              Crear tu primer QR →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {qrCodes.map(qr => <QRCard key={qr.id} qr={qr} baseUrl={baseUrl} />)}
          </div>
        )}
      </div>
    </div>
  )
}
