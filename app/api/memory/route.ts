import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { upsertMemory } from '@/lib/ai/memory'

const upsertSchema = z.object({
  entries: z.array(z.object({
    category: z.enum(['business_context','goals','constraints','market','competitors','pricing','customers','team','product','financials','decisions']),
    key: z.string().min(1),
    value: z.string().min(1),
  })),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
  const orgId = profile?.organization_id
  if (!orgId) return NextResponse.json({ memory: {} })

  const { data } = await supabase.from('organizational_memory').select('*').eq('organization_id', orgId).order('category')

  // Group by category
  const grouped: Record<string, Array<{ key: string; value: string; source: string; updated_at: string }>> = {}
  for (const row of data ?? []) {
    if (!grouped[row.category]) grouped[row.category] = []
    grouped[row.category].push({ key: row.key, value: row.value, source: row.source, updated_at: row.updated_at })
  }

  return NextResponse.json({ memory: grouped })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = upsertSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
  const orgId = profile?.organization_id
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

  const admin = createServiceClient()
  await upsertMemory(admin, orgId, parsed.data.entries.map(e => ({ ...e, source: 'user_input' })))

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
  const orgId = profile?.organization_id
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

  const admin = createServiceClient()
  await admin.from('organizational_memory').delete().eq('id', id).eq('organization_id', orgId)
  return NextResponse.json({ ok: true })
}
