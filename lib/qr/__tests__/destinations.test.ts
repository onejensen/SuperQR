import { buildDestinationUrl, DESTINATION_LABELS } from '../destinations'

describe('buildDestinationUrl', () => {
  it('returns url value directly', () => {
    expect(buildDestinationUrl('url', 'https://example.com')).toBe('https://example.com')
  })

  it('builds tel: link for phone', () => {
    expect(buildDestinationUrl('phone', '+50688887777')).toBe('tel:+50688887777')
  })

  it('builds WhatsApp link stripping non-digits', () => {
    expect(buildDestinationUrl('whatsapp', '+506 8888-7777')).toBe('https://wa.me/50688887777')
  })

  it('builds mailto: link for email', () => {
    expect(buildDestinationUrl('email', 'user@example.com')).toBe('mailto:user@example.com')
  })

  it('builds instagram URL stripping @ prefix', () => {
    expect(buildDestinationUrl('instagram', '@miusuario')).toBe('https://instagram.com/miusuario')
  })

  it('builds instagram URL without @ prefix', () => {
    expect(buildDestinationUrl('instagram', 'miusuario')).toBe('https://instagram.com/miusuario')
  })

  it('builds twitter URL on x.com', () => {
    expect(buildDestinationUrl('twitter', '@usuario')).toBe('https://x.com/usuario')
  })

  it('builds linkedin URL', () => {
    expect(buildDestinationUrl('linkedin', 'juan-jensen')).toBe('https://linkedin.com/in/juan-jensen')
  })

  it('builds tiktok URL with @ prefix', () => {
    expect(buildDestinationUrl('tiktok', 'micanal')).toBe('https://tiktok.com/@micanal')
  })

  it('builds facebook URL', () => {
    expect(buildDestinationUrl('facebook', 'mipagina')).toBe('https://facebook.com/mipagina')
  })

  it('builds youtube URL with @ prefix', () => {
    expect(buildDestinationUrl('youtube', 'micanal')).toBe('https://youtube.com/@micanal')
  })
})

describe('DESTINATION_LABELS', () => {
  it('has a label for every destination type', () => {
    const types = ['url', 'phone', 'whatsapp', 'email', 'instagram', 'twitter', 'linkedin', 'tiktok', 'facebook', 'youtube']
    types.forEach(type => {
      expect(DESTINATION_LABELS[type as keyof typeof DESTINATION_LABELS]).toBeDefined()
    })
  })
})
