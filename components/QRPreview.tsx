'use client'
import { useEffect, useRef, useState } from 'react'
import type { DotStyle, CornerStyle } from '@/lib/types'

interface QRPreviewProps {
  url: string
  fgColor: string
  bgColor: string
  dotStyle: DotStyle
  cornerStyle: CornerStyle
  size?: number
}

const DOT_TYPE_MAP: Record<DotStyle, string> = {
  square: 'square',
  rounded: 'rounded',
  dots: 'dots',
}

const CORNER_TYPE_MAP: Record<CornerStyle, string> = {
  square: 'square',
  rounded: 'extra-rounded',
}

export function QRPreview({ url, fgColor, bgColor, dotStyle, cornerStyle, size = 200 }: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<unknown>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        data: url || 'https://superqr.app',
        dotsOptions: { color: fgColor, type: DOT_TYPE_MAP[dotStyle] as 'square' },
        cornersSquareOptions: { type: CORNER_TYPE_MAP[cornerStyle] as 'square' },
        backgroundOptions: { color: bgColor },
        qrOptions: { errorCorrectionLevel: 'M' },
      })
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        ;(qrRef.current as { append: (el: HTMLElement) => void }).append(containerRef.current)
      }
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!qrRef.current || !ready) return
    ;(qrRef.current as { update: (opts: object) => void }).update({
      data: url || 'https://superqr.app',
      dotsOptions: { color: fgColor, type: DOT_TYPE_MAP[dotStyle] },
      cornersSquareOptions: { type: CORNER_TYPE_MAP[cornerStyle] },
      backgroundOptions: { color: bgColor },
    })
  }, [url, fgColor, bgColor, dotStyle, cornerStyle, ready])

  return <div ref={containerRef} style={{ width: size, height: size }} />
}

export function useQRDownload(
  url: string,
  fgColor: string,
  bgColor: string,
  dotStyle: DotStyle,
  cornerStyle: CornerStyle
) {
  async function download(format: 'png' | 'svg', filename: string) {
    const { default: QRCodeStyling } = await import('qr-code-styling')
    const qr = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: url,
      dotsOptions: { color: fgColor, type: DOT_TYPE_MAP[dotStyle] as 'square' },
      cornersSquareOptions: { type: CORNER_TYPE_MAP[cornerStyle] as 'square' },
      backgroundOptions: { color: bgColor },
      qrOptions: { errorCorrectionLevel: 'M' },
    })
    await qr.download({ name: filename, extension: format })
  }
  return { download }
}
