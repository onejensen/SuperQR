const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SLUG_LENGTH = 6

export function generateSlug(): string {
  return Array.from(
    { length: SLUG_LENGTH },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]{6}$/.test(slug)
}
