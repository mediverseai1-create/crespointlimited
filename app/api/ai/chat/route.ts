import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { generateContent } from '@/lib/gemini'

const schema = z.object({ message: z.string().min(1) })

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

    // Gather org context
    let context = 'No data available for this organization yet.'
    if (orgId) {
      const [kpisRes, metricsRes, insightsRes] = await Promise.all([
        supabase.from('kpis').select('name, category, current_value, target_value, unit, status').eq('organization_id', orgId).limit(20),
        supabase.from('business_metrics').select('category, name, value, period_start').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(30),
        supabase.from('insights').select('title, description, category, severity').eq('organization_id', orgId).eq('is_read', false).limit(10),
      ])

      const kpiSummary = (kpisRes.data ?? []).map(k =>
        `${k.name} (${k.category}): current=${k.current_value ?? 'N/A'} ${k.unit ?? ''}, target=${k.target_value ?? 'N/A'} ${k.unit ?? ''}, status=${k.status}`
      ).join('\n')

      const metricSummary = (metricsRes.data ?? []).map(m =>
        `${m.category} / ${m.name}: ${m.value} (period: ${m.period_start ?? 'unknown'})`
      ).join('\n')

      const insightSummary = (insightsRes.data ?? []).map(i =>
        `[${i.severity.toUpperCase()}] ${i.title}: ${i.description ?? ''}`
      ).join('\n')

      context = [
        kpiSummary ? `KPIs:\n${kpiSummary}` : '',
        metricSummary ? `Business Metrics:\n${metricSummary}` : '',
        insightSummary ? `Active Insights:\n${insightSummary}` : '',
      ].filter(Boolean).join('\n\n') || 'No data available yet.'
    }

    const systemPrompt = `You are a senior business analyst AI assistant for CrestPoint, a B2B SaaS business intelligence platform.
You have access to the following real data from the user's organization:

${context}

Provide concise, actionable, data-driven analysis. Be specific and reference the actual metrics when relevant.
If data is limited or missing, acknowledge that and suggest what data would help.
Keep responses professional and focused on business insights and recommendations.`

    const fullPrompt = `${systemPrompt}\n\nUser question: ${parsed.data.message}`
    const response = await generateContent(fullPrompt)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
