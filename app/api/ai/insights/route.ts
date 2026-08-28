import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateContent } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const orgId = profile?.organization_id
    if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    const [kpisRes, metricsRes] = await Promise.all([
      supabase.from('kpis').select('*').eq('organization_id', orgId),
      supabase.from('business_metrics').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(50),
    ])

    const prompt = `Analyze this business data and generate 3-5 actionable insights. Return JSON array of objects with: title, description, category (performance|risk|opportunity|trend), severity (info|warning|critical).

KPIs: ${JSON.stringify(kpisRes.data)}
Metrics: ${JSON.stringify(metricsRes.data)}

Return only valid JSON array, no markdown.`

    const text = await generateContent(prompt)
    let insights: { title: string; description: string; category: string; severity: string }[] = []

    try {
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      insights = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    // Save insights to DB
    const toInsert = insights.map(i => ({
      organization_id: orgId,
      title: i.title,
      description: i.description,
      category: i.category,
      severity: i.severity,
    }))

    const { data: saved } = await supabase.from('insights').insert(toInsert).select()
    return NextResponse.json({ insights: saved })
  } catch (error) {
    console.error('Insights generation error:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
