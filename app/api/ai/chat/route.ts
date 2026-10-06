import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { buildOrgContext } from '@/lib/ai/memory'
import { runQuickChat } from '@/lib/ai/engine'
import type { EngineType } from '@/lib/ai/types'

const schema = z.object({
  message: z.string().min(1),
  engine: z.enum(['decision','strategy','scenario','risk','revenue','competitive','briefing','insights']).optional(),
  context: z.string().optional(),
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

    let response: string
    if (orgId) {
      const ctx = await buildOrgContext(supabase, orgId)
      response = await runQuickChat(
        parsed.data.message,
        ctx,
        parsed.data.engine as EngineType | undefined
      )
    } else {
      response = 'Please complete your organization setup to enable AI analysis.'
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
