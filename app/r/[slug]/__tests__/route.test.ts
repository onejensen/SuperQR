/**
 * @jest-environment node
 */
import { GET } from '../route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/qr/destinations', () => ({
  buildDestinationUrl: jest.fn((type: string, value: string) => {
    if (type === 'url') return value
    if (type === 'whatsapp') return `https://wa.me/${value}`
    return value
  }),
}))

import { createClient } from '@/lib/supabase/server'

const mockCreateClient = createClient as jest.Mock

function makeRequest(slug: string) {
  return new NextRequest(`http://localhost/r/${slug}`)
}

describe('GET /r/[slug]', () => {
  beforeEach(() => jest.clearAllMocks())

  it('redirects to destination URL when slug found', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({
              data: { id: 'qr-1', destination_type: 'url', destination_value: 'https://example.com' },
              error: null,
            }),
          }),
        }),
        insert: () => ({
          then: () => {},
        }),
      }),
    })

    const res = await GET(makeRequest('ab12cd'), { params: Promise.resolve({ slug: 'ab12cd' }) })
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toMatch(/^https:\/\/example\.com\/?$/)
  })

  it('returns 404 when slug not found', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
        insert: () => ({
          then: () => {},
        }),
      }),
    })

    const res = await GET(makeRequest('notfnd'), { params: Promise.resolve({ slug: 'notfnd' }) })
    expect(res.status).toBe(404)
  })
})
