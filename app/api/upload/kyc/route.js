import { requireAuth } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { randomBytes } from 'node:crypto'

const BUCKET = 'kyc'
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

function safeExt(mime, filename) {
  const fromName = filename?.split('.').pop()?.toLowerCase()
  if (mime === 'application/pdf') return 'pdf'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(fromName)) return fromName
  return 'jpg'
}

export async function POST(req) {
  try {
    const user = await requireAuth()
    const formData = await req.formData()
    const file = formData.get('file')
    const side = String(formData.get('side') || '').toLowerCase()

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!['front', 'back'].includes(side)) {
      return Response.json({ error: 'Document side must be front or back' }, { status: 400 })
    }

    const { name, size, type } = file
    if (size > MAX_SIZE) {
      return Response.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(type)) {
      return Response.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or PDF.' }, { status: 400 })
    }

    const ext = safeExt(type, name)
    const token = randomBytes(6).toString('hex')
    const path = `${user.userId}/${side}-${Date.now()}-${token}.${ext}`
    const supabase = getSupabaseAdmin()
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: type,
      upsert: true,
    })
    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
        return Response.json({
          error: 'Storage bucket "kyc" not found. Create it in Supabase Dashboard: Storage > New bucket > name "kyc".',
        }, { status: 500 })
      }
      return Response.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return Response.json({ url: urlData.publicUrl, path: data.path, side })
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    return Response.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
