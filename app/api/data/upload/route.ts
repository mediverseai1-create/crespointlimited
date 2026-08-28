import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  filename: z.string(),
  columns: z.array(z.string()),
  rowCount: z.number(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const orgId = profile?.organization_id
    if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    const { data: upload, error } = await supabase.from('data_uploads').insert({
      organization_id: orgId,
      filename: parsed.data.filename,
      status: 'completed',
      row_count: parsed.data.rowCount,
      columns: parsed.data.columns,
      uploaded_by: user.id,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Log activity
    await supabase.from('activity_logs').insert({
      organization_id: orgId,
      user_id: user.id,
      action: 'uploaded_data',
      resource_type: 'data_upload',
      resource_id: upload.id,
      metadata: { filename: parsed.data.filename, rows: parsed.data.rowCount },
    })

    return NextResponse.json({ upload })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
