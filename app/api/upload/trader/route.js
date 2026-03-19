import { requireAdmin } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-server'

const BUCKET = 'traders'
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(req) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const traderId = formData.get('traderId') || formData.get('trader_id')
    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const { name, size, type } = file
    if (size > MAX_SIZE) {
      return Response.json({ error: 'File too large (max 2MB)' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(type)) {
      return Response.json({ error: 'Invalid file type. Use JPEG, PNG, GIF, or WebP.' }, { status: 400 })
    }

    const ext = name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg'
    const slug = (traderId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`).replace(/[^a-z0-9-_]/gi, '-')
    const path = `${slug}.${safeExt}`

    const supabase = getSupabaseAdmin()
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: type,
      upsert: true,
    })

    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
        return Response.json({
          error: 'Storage bucket "traders" not found. Create it in Supabase Dashboard: Storage > New bucket > name "traders" > Public.',
        }, { status: 500 })
      }
      return Response.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return Response.json({ url: urlData.publicUrl })
  } catch (e) {
    return Response.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
