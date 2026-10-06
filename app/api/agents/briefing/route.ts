import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildOrgContext } from '@/lib/ai/memory'
import { runEngine } from '@/lib/ai/engine'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const orgId = profile?.organization_id
    if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    const ctx = await buildOrgContext(supabase, orgId)

    // Build briefing query from context
    const kpiAtRisk = ctx.kpis.filter(k => k.status !== 'on_track')
    const briefingQuery = [
      'Generate a comprehensive executive intelligence briefing for today.',
      ctx.kpis.length > 0 ? `We have ${ctx.kpis.length} KPIs tracked, ${kpiAtRisk.length} are at risk or off track.` : '',
      ctx.insights.length > 0 ? `There are ${ctx.insights.length} unread insights requiring attention.` : '',
      'Assess the current business situation, identify the most important issues requiring executive attention, surface key risks and opportunities, and provide prioritized recommendations for the next 30 days.',
    ].filter(Boolean).join(' ')

    const admin = createServiceClient()
    const startMs = Date.now()

    const { data: runRecord } = await admin.from('agent_runs').insert({
      organization_id: orgId,
      agent_type: 'executive_briefing',
      trigger: 'manual',
      status: 'running',
      input: { query: briefingQuery },
    }).select('id').single()

    const analysis = await runEngine('briefing', briefingQuery, ctx)

    // Save recommendations
    let savedRecs = 0
    if (analysis.recommendations.length > 0) {
      const rows = analysis.recommendations.map(r => ({
        organization_id: orgId,
        engine: 'briefing',
        title: r.title,
        summary: r.description,
        reasoning: analysis.reasoning_chain.join(' → '),
        priority: r.priority,
        effort: r.effort,
        expected_impact: r.expected_impact,
        timeframe: r.timeframe,
        confidence: analysis.confidence,
        metadata: { run_id: runRecord?.id },
      }))
      const { data: inserted } = await admin.from('recommendations').insert(rows).select('id')
      savedRecs = inserted?.length ?? 0
    }

    if (runRecord?.id) {
      await admin.from('agent_runs').update({
        status: 'completed',
        output: { summary: analysis.summary, recommendations_count: analysis.recommendations.length },
        recommendations_generated: savedRecs,
        duration_ms: Date.now() - startMs,
        completed_at: new Date().toISOString(),
      }).eq('id', runRecord.id)
    }

    return NextResponse.json({ briefing: analysis, recommendations_saved: savedRecs })
  } catch (error) {
    console.error('Briefing agent error:', error)
    return NextResponse.json({ error: 'Briefing generation failed' }, { status: 500 })
  }
}
