import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { generateContent } from '@/lib/gemini'

const schema = z.object({
  type: z.enum(['executive_summary', 'performance_report', 'operations_report', 'trend_analysis', 'opportunity_report']),
})

const TYPE_LABELS = {
  executive_summary: 'Executive Summary',
  performance_report: 'Performance Report',
  operations_report: 'Operations Report',
  trend_analysis: 'Trend Analysis',
  opportunity_report: 'Opportunity Report',
}

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

    const [kpisRes, metricsRes, insightsRes, oppsRes] = await Promise.all([
      supabase.from('kpis').select('*').eq('organization_id', orgId),
      supabase.from('business_metrics').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(50),
      supabase.from('insights').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(10),
      supabase.from('opportunities').select('*').eq('organization_id', orgId).limit(10),
    ])

    const reportType = parsed.data.type
    const prompt = `Generate a comprehensive ${TYPE_LABELS[reportType]} for this business. Write in professional business language suitable for executives.

Data:
KPIs: ${JSON.stringify(kpisRes.data)}
Recent Metrics: ${JSON.stringify(metricsRes.data?.slice(0, 20))}
Insights: ${JSON.stringify(insightsRes.data)}
Opportunities: ${JSON.stringify(oppsRes.data)}

Write a detailed report with:
1. Executive summary
2. Key findings
3. Areas requiring attention
4. Recommendations
5. Next steps

Be specific, data-driven, and actionable. Reference actual numbers where available.`

    const summary = await generateContent(prompt)
    const title = `${TYPE_LABELS[reportType]} — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`

    const { data: report } = await supabase.from('reports').insert({
      organization_id: orgId,
      title,
      type: reportType,
      content: { summary },
      generated_by: user.id,
    }).select().single()

    await supabase.from('activity_logs').insert({
      organization_id: orgId,
      user_id: user.id,
      action: 'generated_report',
      resource_type: 'report',
      resource_id: report?.id,
      metadata: { type: reportType },
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
