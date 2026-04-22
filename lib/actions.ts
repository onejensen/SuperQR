'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/qr/slugs'
import type { DestinationType, DotStyle, CornerStyle, QRCodeWithScanCount, DailyScanCount } from '@/lib/types'

interface QRCodeInput {
  name: string
  destination_type: DestinationType
  destination_value: string
  fg_color: string
  bg_color: string
  dot_style: DotStyle
  corner_style: CornerStyle
}

async function generateUniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const slug = generateSlug()
    const { data } = await supabase.from('qr_codes').select('id').eq('slug', slug).single()
    if (!data) return slug
  }
  throw new Error('No se pudo generar un slug único')
}

export async function createQRCode(input: QRCodeInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const slug = await generateUniqueSlug(supabase)

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({ ...input, user_id: user.id, slug })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  redirect(`/qr/${data.id}`)
}

export async function updateQRCode(id: string, input: QRCodeInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('qr_codes')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath(`/qr/${id}`)
}

export async function deleteQRCode(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('qr_codes').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function getQRCodes(): Promise<QRCodeWithScanCount[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: qrCodes } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!qrCodes || qrCodes.length === 0) return []

  const ids = qrCodes.map(q => q.id)
  const { data: scans } = await supabase
    .from('scans')
    .select('qr_code_id')
    .in('qr_code_id', ids)

  const countMap: Record<string, number> = {}
  scans?.forEach(s => { countMap[s.qr_code_id] = (countMap[s.qr_code_id] ?? 0) + 1 })

  return qrCodes.map(q => ({ ...q, scan_count: countMap[q.id] ?? 0 }))
}

export async function getQRCode(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) redirect('/dashboard')
  return data
}

export async function getQRStats(id: string): Promise<{ total: number; daily: DailyScanCount[] }> {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: scans } = await supabase
    .from('scans')
    .select('scanned_at')
    .eq('qr_code_id', id)
    .gte('scanned_at', thirtyDaysAgo.toISOString())

  const countByDay: Record<string, number> = {}
  scans?.forEach(s => {
    const date = s.scanned_at.slice(0, 10)
    countByDay[date] = (countByDay[date] ?? 0) + 1
  })

  const daily: DailyScanCount[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const date = d.toISOString().slice(0, 10)
    return { date, count: countByDay[date] ?? 0 }
  })

  const { count: total } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('qr_code_id', id)

  return { total: total ?? 0, daily }
}
