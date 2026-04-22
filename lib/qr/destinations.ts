import type { DestinationType } from '../types'

export function buildDestinationUrl(type: DestinationType, value: string): string {
  const clean = (v: string) => v.replace(/^@/, '')
  switch (type) {
    case 'url':       return value
    case 'phone':     return `tel:${value}`
    case 'whatsapp':  return `https://wa.me/${value.replace(/\D/g, '')}`
    case 'email':     return `mailto:${value}`
    case 'instagram': return `https://instagram.com/${clean(value)}`
    case 'twitter':   return `https://x.com/${clean(value)}`
    case 'linkedin':  return `https://linkedin.com/in/${value}`
    case 'tiktok':    return `https://tiktok.com/@${clean(value)}`
    case 'facebook':  return `https://facebook.com/${value}`
    case 'youtube':   return `https://youtube.com/@${clean(value)}`
  }
}

export const DESTINATION_LABELS: Record<DestinationType, { label: string; icon: string; placeholder: string }> = {
  url:       { label: 'URL',       icon: '🌐', placeholder: 'https://misitioweb.com' },
  phone:     { label: 'Teléfono',  icon: '📞', placeholder: '+50688887777' },
  whatsapp:  { label: 'WhatsApp',  icon: '💬', placeholder: '+50688887777' },
  email:     { label: 'Email',     icon: '✉️', placeholder: 'correo@ejemplo.com' },
  instagram: { label: 'Instagram', icon: '📸', placeholder: '@usuario' },
  twitter:   { label: 'Twitter',   icon: '𝕏',  placeholder: '@usuario' },
  linkedin:  { label: 'LinkedIn',  icon: '💼', placeholder: 'tu-nombre' },
  tiktok:    { label: 'TikTok',    icon: '🎵', placeholder: '@usuario' },
  facebook:  { label: 'Facebook',  icon: '📘', placeholder: 'tupagina' },
  youtube:   { label: 'YouTube',   icon: '▶️', placeholder: '@tucanal' },
}
