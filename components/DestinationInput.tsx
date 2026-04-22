'use client'
import { DESTINATION_LABELS } from '@/lib/qr/destinations'
import type { DestinationType } from '@/lib/types'

const DESTINATION_TYPES: DestinationType[] = [
  'url', 'phone', 'whatsapp', 'email',
  'instagram', 'twitter', 'linkedin',
  'tiktok', 'facebook', 'youtube',
]

interface DestinationInputProps {
  type: DestinationType
  value: string
  onTypeChange: (type: DestinationType) => void
  onValueChange: (value: string) => void
}

export function DestinationInput({ type, value, onTypeChange, onValueChange }: DestinationInputProps) {
  const current = DESTINATION_LABELS[type]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-2">
        {DESTINATION_TYPES.map(t => {
          const info = DESTINATION_LABELS[t]
          const selected = t === type
          return (
            <button
              key={t}
              type="button"
              onClick={() => onTypeChange(t)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                selected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          )
        })}
      </div>
      <input
        type={type === 'email' ? 'email' : type === 'phone' || type === 'whatsapp' ? 'tel' : 'text'}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder={current.placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
  )
}
