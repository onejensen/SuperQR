export type DestinationType =
  | 'url'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'tiktok'
  | 'facebook'
  | 'youtube'

export type DotStyle = 'square' | 'rounded' | 'dots'
export type CornerStyle = 'square' | 'rounded'

export interface QRCode {
  id: string
  user_id: string
  name: string
  slug: string
  destination_type: DestinationType
  destination_value: string
  fg_color: string
  bg_color: string
  dot_style: DotStyle
  corner_style: CornerStyle
  created_at: string
}

export interface Scan {
  id: string
  qr_code_id: string
  scanned_at: string
  country: string | null
}

export interface QRCodeWithScanCount extends QRCode {
  scan_count: number
}

export interface DailyScanCount {
  date: string
  count: number
}
