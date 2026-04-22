import Link from 'next/link'
import { deleteQRCode } from '@/lib/actions'
import { DESTINATION_LABELS } from '@/lib/qr/destinations'
import type { QRCodeWithScanCount } from '@/lib/types'

interface QRCardProps {
  qr: QRCodeWithScanCount
  baseUrl: string
}

export function QRCard({ qr, baseUrl }: QRCardProps) {
  const dest = DESTINATION_LABELS[qr.destination_type]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
      <div
        className="w-14 h-14 rounded-xl flex-shrink-0"
        style={{
          background: `repeating-conic-gradient(${qr.fg_color} 0% 25%, ${qr.bg_color} 0% 50%) 0 0 / 8px 8px`,
          border: `2px solid ${qr.fg_color}20`,
        }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{qr.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{dest.icon} {dest.label} → {qr.destination_value}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{baseUrl}/r/{qr.slug}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-xl font-bold text-gray-900">{qr.scan_count.toLocaleString()}</p>
        <p className="text-xs text-gray-500">escaneos</p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Link href={`/qr/${qr.id}`}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
          ✏️ Editar
        </Link>
        <Link href={`/qr/${qr.id}/stats`}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
          📊 Stats
        </Link>
        <form action={deleteQRCode.bind(null, qr.id)}>
          <button type="submit"
            className="px-3 py-1.5 border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50">
            🗑️
          </button>
        </form>
      </div>
    </div>
  )
}
