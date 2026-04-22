import { getQRCode } from '@/lib/actions'
import { QREditor } from '@/components/QREditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditQRPage({ params }: Props) {
  const { id } = await params
  const qr = await getQRCode(id)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</a>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">{qr.name}</h1>
          <a href={`/qr/${id}/stats`} className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            📊 Ver estadísticas
          </a>
        </div>
        <QREditor qr={qr} baseUrl={baseUrl} />
      </div>
    </div>
  )
}
