import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

const feedbackSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['accepted','rejected','deferred','completed']),
  feedback: z.string().optional(),
  outcome: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
  const orgId = profile?.organization_id
  if (!orgId) return NextResponse.json({ recommendations: [] })

  const url = new URL(req.url)
  const status = url.searchParams.get('status') ?? 'pending'
  const engine = url.searchParams.get('engine')
  const limit = parseInt(url.searchParams.get('limit') ?? '20')

  let query = supabase
    .from('recommendations')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status !== 'all') query = query.eq('status', status)
  if (engine) query = query.eq('engine', engine)

  const { data } = await query
  return NextResponse.json({ recommendations: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = feedbackSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
  const orgId = profile?.organization_id
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

  const admin = createServiceClient()
  const { data, error } = await admin
    .from('recommendations')
    .update({
      status: parsed.data.status,
      feedback: parsed.data.feedback ?? null,
      outcome: parsed.data.outcome ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .eq('organization_id', orgId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ recommendation: data })
}
