import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildDestinationUrl } from '@/lib/qr/destinations'
import type { DestinationType } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qr_codes')
    .select('id, destination_type, destination_value')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return new NextResponse('QR code no encontrado', { status: 404 })
  }

  // Register scan fire-and-forget (does not block redirect)
  supabase
    .from('scans')
    .insert({ qr_code_id: data.id })
    .then(() => {})

  const url = buildDestinationUrl(
    data.destination_type as DestinationType,
    data.destination_value
  )

  return NextResponse.redirect(url, { status: 302 })
}
