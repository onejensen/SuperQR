import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildDestinationUrl } from '@/lib/qr/destinations'
import type { DestinationType } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data, error } = await supabase
    .from('qr_codes')
    .select('id, destination_type, destination_value')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return new NextResponse(
      `QR code no encontrado. Slug: ${slug}. Error: ${error ? JSON.stringify(error) : 'data null'}`,
      { status: 404 }
    )
  }

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
