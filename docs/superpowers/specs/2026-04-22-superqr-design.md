# SuperQR — Diseño de la Aplicación

**Fecha:** 2026-04-22

## Resumen

SuperQR es una web app para generar y gestionar códigos QR dinámicos permanentes. El usuario crea un QR que apunta a un short-link propio; puede cambiar el destino en cualquier momento sin alterar el código impreso. Incluye autenticación, personalización visual del QR y analytics básicos de escaneos.

---

## Stack Tecnológico

- **Frontend + Backend:** Next.js App Router (React + API routes / Server Actions)
- **Auth + DB + Storage:** Supabase (PostgreSQL, Row Level Security, Auth integrado)
- **Librería QR:** `qr-code-styling` (soporta bordes redondeados, colores, estilos)
- **Estilos:** Tailwind CSS
- **Deploy:** Vercel

---

## Arquitectura

### Flujo principal de redirección

1. Usuario crea un QR con destino (ej. Instagram `@usuario`)
2. Se genera un slug único (ej. `ab12cd`) → short-link: `superqr.app/r/ab12cd`
3. El QR codifica el short-link (no el destino final)
4. Al escanear: servidor registra el escaneo en DB → construye URL final → redirige

### Páginas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/login` | Autenticación (magic link / OAuth) | Público |
| `/dashboard` | Lista de QR codes del usuario + stats globales | Autenticado |
| `/create` | Crear nuevo QR | Autenticado |
| `/qr/[id]` | Editar QR existente | Autenticado (dueño) |
| `/qr/[id]/stats` | Analytics de escaneos | Autenticado (dueño) |
| `/r/[slug]` | Redirect endpoint | Público |

---

## Modelo de Datos

### Tabla `qr_codes`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | Identificador único |
| `user_id` | uuid FK → users | Dueño del QR |
| `name` | text | Nombre descriptivo (ej. "Mi Instagram") |
| `slug` | text UNIQUE | Identificador del short-link (ej. `ab12cd`) |
| `destination_type` | text | Tipo de destino (ver lista) |
| `destination_value` | text | Valor según el tipo (URL, usuario, teléfono) |
| `fg_color` | text | Color principal del QR (hex) |
| `bg_color` | text | Color de fondo del QR (hex) |
| `dot_style` | text | Estilo de módulos: `square`, `rounded`, `dots` |
| `corner_style` | text | Estilo de esquinas: `square`, `rounded` |
| `created_at` | timestamptz | Fecha de creación |

### Tabla `scans`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | Identificador único |
| `qr_code_id` | uuid FK → qr_codes | QR escaneado |
| `scanned_at` | timestamptz | Timestamp del escaneo |
| `country` | text (nullable) | País del escaneo (via IP geolocation, opcional) |

### Row Level Security

- `qr_codes`: usuario solo puede leer/escribir sus propios registros
- `scans`: insert público (el redirect endpoint lo llama sin auth), select solo para el dueño del QR

---

## Tipos de Destino

| `destination_type` | `destination_value` | URL generada |
|---|---|---|
| `url` | `https://ejemplo.com` | directo |
| `phone` | `+50688887777` | `tel:+50688887777` |
| `whatsapp` | `+50688887777` | `https://wa.me/50688887777` |
| `email` | `correo@ejemplo.com` | `mailto:correo@ejemplo.com` |
| `instagram` | `usuario` | `https://instagram.com/usuario` |
| `twitter` | `usuario` | `https://x.com/usuario` |
| `linkedin` | `usuario` | `https://linkedin.com/in/usuario` |
| `tiktok` | `usuario` | `https://tiktok.com/@usuario` |
| `facebook` | `usuario` | `https://facebook.com/usuario` |
| `youtube` | `canal` | `https://youtube.com/@canal` |

---

## Personalización del QR

- **Color principal:** selector de color (hex)
- **Color de fondo:** selector de color (hex)
- **Estilo de módulos:** cuadrado / redondeado / círculos
- **Estilo de esquinas:** cuadrado / redondeado
- **Preview en tiempo real** en el editor
- **Descarga:** PNG y SVG

---

## Funcionalidades

### Dashboard
- Listado de QR codes con miniatura, nombre, tipo de destino y total de escaneos
- Stats globales: total QRs, escaneos hoy, escaneos totales
- Acciones por QR: editar, ver stats, descargar

### Editor de QR (`/create` y `/qr/[id]`)
- Layout dos columnas: formulario (izquierda) + preview en tiempo real (derecha)
- Selección de tipo de destino con iconos
- Input adaptado según el tipo seleccionado
- Opciones de personalización visual
- Botón de guardado; muestra el short-link generado
- Descarga del QR en PNG y SVG

### Analytics (`/qr/[id]/stats`)
- Total de escaneos histórico
- Escaneos por día (gráfico de línea, últimos 30 días)
- País de escaneo si está disponible

### Redirect (`/r/[slug]`)
- Busca el QR por slug
- Registra el escaneo en `scans` (sin bloquear el redirect)
- Construye la URL final según `destination_type` + `destination_value`
- Responde con HTTP 302 redirect

---

## Autenticación

Supabase Auth con:
- Magic link (email)
- OAuth opcional (Google)

Rutas protegidas con middleware de Next.js que verifica la sesión de Supabase.

---

## Generación de Slugs

Los slugs son cadenas alfanuméricas de 6 caracteres generadas aleatoriamente (ej. `ab12cd`). Se verifica unicidad en DB antes de insertar; en caso de colisión se reintenta. Con 36^6 (~2.2B) combinaciones posibles la probabilidad de colisión es despreciable en escala inicial.

---

## Decisiones de Diseño

- El QR nunca cambia aunque cambie el destino — la permanencia está garantizada por el short-link intermedio.
- El endpoint `/r/[slug]` registra el escaneo de forma asíncrona para no añadir latencia al redirect.
- RLS de Supabase garantiza aislamiento entre usuarios sin lógica adicional en el backend.
- `qr-code-styling` genera el QR en el cliente (browser), lo que permite preview instantáneo sin llamadas al servidor.
