import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildOrgContext, upsertMemory } from '@/lib/ai/memory'
import { runEngine } from '@/lib/ai/engine'
import type { EngineType } from '@/lib/ai/types'

const schema = z.object({
  query: z.string().min(1),
  engine: z.enum(['decision','strategy','scenario','risk','revenue','competitive','briefing','insights']),
  save_recommendations: z.boolean().optional().default(true),
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

    // Build rich organizational context
    const ctx = await buildOrgContext(supabase, orgId)

    // Log agent run start
    const admin = createServiceClient()
    const { data: runRecord } = await admin.from('agent_runs').insert({
      organization_id: orgId,
      agent_type: parsed.data.engine === 'briefing' ? 'executive_briefing' : `${parsed.data.engine}_analysis` as string,
      trigger: 'manual',
      status: 'running',
      input: { query: parsed.data.query, engine: parsed.data.engine },
    }).select('id').single()

    const startMs = Date.now()

    // Run the AI engine
    const analysis = await runEngine(parsed.data.engine as EngineType, parsed.data.query, ctx)

    const durationMs = Date.now() - startMs

    // Save recommendations to DB
    let savedRecs = 0
    if (parsed.data.save_recommendations && analysis.recommendations.length > 0) {
      const recsToInsert = analysis.recommendations.map(r => ({
        organization_id: orgId,
        engine: parsed.data.engine,
        title: r.title,
        summary: r.description,
        reasoning: analysis.reasoning_chain.join(' → '),
        priority: r.priority,
        effort: r.effort,
        expected_impact: r.expected_impact,
        timeframe: r.timeframe,
        confidence: analysis.confidence,
        metadata: {
          query: parsed.data.query,
          run_id: runRecord?.id,
        },
      }))
      const { data: inserted } = await admin.from('recommendations').insert(recsToInsert).select('id')
      savedRecs = inserted?.length ?? 0
    }

    // Extract memory updates from analysis
    const memoryUpdates: Array<{ category: string; key: string; value: string; source: string }> = []

    if (analysis.risks.length > 0) {
      const criticalRisks = analysis.risks.filter(r => r.severity === 'critical' || r.severity === 'high')
      if (criticalRisks.length > 0) {
        memoryUpdates.push({
          category: 'constraints',
          key: `key_risks_${parsed.data.engine}`,
          value: criticalRisks.map(r => r.title).join('; '),
          source: 'ai_inference',
        })
      }
    }

    if (analysis.opportunities.length > 0) {
      memoryUpdates.push({
        category: 'goals',
        key: `identified_opportunities_${parsed.data.engine}`,
        value: analysis.opportunities.slice(0, 3).map(o => o.title).join('; '),
        source: 'ai_inference',
      })
    }

    if (memoryUpdates.length > 0) {
      await upsertMemory(admin, orgId, memoryUpdates)
    }

    // Update agent run as completed
    if (runRecord?.id) {
      await admin.from('agent_runs').update({
        status: 'completed',
        output: {
          summary: analysis.summary,
          findings_count: analysis.key_findings.length,
          recommendations_count: analysis.recommendations.length,
          risks_count: analysis.risks.length,
          opportunities_count: analysis.opportunities.length,
        },
        recommendations_generated: savedRecs,
        duration_ms: durationMs,
        completed_at: new Date().toISOString(),
      }).eq('id', runRecord.id)
    }

    return NextResponse.json({ analysis, recommendations_saved: savedRecs })
  } catch (error) {
    console.error('AI analyze error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
