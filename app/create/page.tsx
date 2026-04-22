import { QREditor } from '@/components/QREditor'

export default function CreatePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</a>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">Nuevo QR</h1>
        </div>
        <QREditor baseUrl={baseUrl} />
      </div>
    </div>
  )
}
