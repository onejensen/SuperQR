import { generateSlug, isValidSlug } from '../slugs'

describe('generateSlug', () => {
  it('generates a string of length 6', () => {
    expect(generateSlug()).toHaveLength(6)
  })

  it('only contains alphanumeric characters', () => {
    const slug = generateSlug()
    expect(slug).toMatch(/^[a-z0-9]+$/)
  })

  it('generates different slugs on consecutive calls', () => {
    const slugs = new Set(Array.from({ length: 20 }, () => generateSlug()))
    expect(slugs.size).toBeGreaterThan(1)
  })
})

describe('isValidSlug', () => {
  it('returns true for valid 6-char alphanumeric slug', () => {
    expect(isValidSlug('ab12cd')).toBe(true)
  })

  it('returns false for slug with special characters', () => {
    expect(isValidSlug('ab-12c')).toBe(false)
  })

  it('returns false for slug shorter than 6', () => {
    expect(isValidSlug('ab12')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidSlug('')).toBe(false)
  })
})
