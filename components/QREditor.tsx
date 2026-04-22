'use client'
import { useState, useTransition } from 'react'
import { QRPreview, useQRDownload } from './QRPreview'
import { DestinationInput } from './DestinationInput'
import { createQRCode, updateQRCode } from '@/lib/actions'
import type { QRCode, DestinationType, DotStyle, CornerStyle } from '@/lib/types'

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square',  label: '■ Cuadrado' },
  { value: 'rounded', label: '▣ Redondeado' },
  { value: 'dots',    label: '● Círculos' },
]

const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: 'square',  label: '⬛ Cuadradas' },
  { value: 'rounded', label: '🔵 Redondeadas' },
]

interface QREditorProps {
  qr?: QRCode
  baseUrl: string
}

export function QREditor({ qr, baseUrl }: QREditorProps) {
  const [name, setName] = useState(qr?.name ?? '')
  const [destType, setDestType] = useState<DestinationType>(qr?.destination_type ?? 'url')
  const [destValue, setDestValue] = useState(qr?.destination_value ?? '')
  const [fgColor, setFgColor] = useState(qr?.fg_color ?? '#000000')
  const [bgColor, setBgColor] = useState(qr?.bg_color ?? '#ffffff')
  const [dotStyle, setDotStyle] = useState<DotStyle>(qr?.dot_style ?? 'square')
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>(qr?.corner_style ?? 'square')
  const [isPending, startTransition] = useTransition()

  const previewUrl = qr ? `${baseUrl}/r/${qr.slug}` : `${baseUrl}/r/preview`
  const { download } = useQRDownload(previewUrl, fgColor, bgColor, dotStyle, cornerStyle)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input = { name, destination_type: destType, destination_value: destValue, fg_color: fgColor, bg_color: bgColor, dot_style: dotStyle, corner_style: cornerStyle }
    startTransition(async () => {
      if (qr) {
        await updateQRCode(qr.id, input)
      } else {
        await createQRCode(input)
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 min-h-[500px]">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white border border-gray-200 rounded-2xl p-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nombre</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Mi Instagram"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Destino</label>
          <DestinationInput
            type={destType}
            value={destValue}
            onTypeChange={t => { setDestType(t); setDestValue('') }}
            onValueChange={setDestValue}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Colores</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Principal', value: fgColor, onChange: setFgColor },
              { label: 'Fondo',     value: bgColor, onChange: setBgColor },
            ].map(({ label, value, onChange }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-1.5">{label}</p>
                <div className="flex gap-2 items-center">
                  <input type="color" value={value} onChange={e => onChange(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5" />
                  <input value={value} onChange={e => onChange(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estilo de módulos</label>
          <div className="flex gap-2">
            {DOT_STYLES.map(s => (
              <button key={s.value} type="button" onClick={() => setDotStyle(s.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  dotStyle === s.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Esquinas</label>
          <div className="flex gap-2">
            {CORNER_STYLES.map(s => (
              <button key={s.value} type="button" onClick={() => setCornerStyle(s.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  cornerStyle === s.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isPending}
          className="mt-auto bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {isPending ? 'Guardando...' : qr ? 'Guardar cambios' : 'Crear QR'}
        </button>
      </form>

      {/* Preview panel */}
      <div className="flex flex-col gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-6 items-center justify-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</p>
        <QRPreview url={previewUrl} fgColor={fgColor} bgColor={bgColor} dotStyle={dotStyle} cornerStyle={cornerStyle} size={200} />
        {qr && (
          <>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">{name || qr.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{baseUrl}/r/{qr.slug}</p>
            </div>
            <div className="flex gap-2 w-full">
              <button onClick={() => download('png', qr.name)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50">
                ⬇ PNG
              </button>
              <button onClick={() => download('svg', qr.name)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50">
                ⬇ SVG
              </button>
            </div>
            <div className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs">
              <p className="text-gray-400 font-semibold mb-1 uppercase tracking-wider">Link corto</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-indigo-600 truncate">{baseUrl}/r/{qr.slug}</code>
                <button onClick={() => navigator.clipboard.writeText(`${baseUrl}/r/${qr.slug}`)}
                  className="px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 text-xs">
                  Copiar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
