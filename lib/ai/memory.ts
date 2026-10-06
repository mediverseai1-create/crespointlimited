import type { SupabaseClient } from '@supabase/supabase-js'
import type { OrgContext } from './types'

export async function buildOrgContext(
  supabase: SupabaseClient,
  orgId: string
): Promise<OrgContext> {
  const [orgRes, memoryRes, kpisRes, metricsRes, insightsRes, recsRes] = await Promise.all([
    supabase.from('organizations').select('name,industry,size,country,plan').eq('id', orgId).single(),
    supabase.from('organizational_memory').select('category,key,value').eq('organization_id', orgId),
    supabase.from('kpis').select('name,category,current_value,target_value,unit,status').eq('organization_id', orgId).limit(30),
    supabase.from('business_metrics').select('category,name,value,period_start').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(50),
    supabase.from('insights').select('title,category,severity').eq('organization_id', orgId).eq('is_read', false).limit(15),
    supabase.from('recommendations').select('title,status,engine').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(10),
  ])

  // Group memory by category
  const memory: Record<string, Record<string, string>> = {}
  for (const row of memoryRes.data ?? []) {
    if (!memory[row.category]) memory[row.category] = {}
    memory[row.category][row.key] = row.value
  }

  return {
    organization: orgRes.data ?? { name: '', industry: '', size: '', country: '', plan: 'free' },
    memory,
    kpis: kpisRes.data ?? [],
    metrics: metricsRes.data ?? [],
    insights: insightsRes.data ?? [],
    recent_recommendations: recsRes.data ?? [],
  }
}

export function serializeContext(ctx: OrgContext): string {
  const lines: string[] = []

  lines.push(`ORGANIZATION: ${ctx.organization.name}`)
  lines.push(`Industry: ${ctx.organization.industry || 'Unknown'} | Size: ${ctx.organization.size || 'Unknown'} | Country: ${ctx.organization.country || 'Unknown'}`)

  if (Object.keys(ctx.memory).length > 0) {
    lines.push('\nORGANIZATIONAL MEMORY (accumulated business context):')
    for (const [category, entries] of Object.entries(ctx.memory)) {
      const items = Object.entries(entries).map(([k, v]) => `  ${k}: ${v}`).join('\n')
      lines.push(`[${category.toUpperCase()}]\n${items}`)
    }
  }

  if (ctx.kpis.length > 0) {
    lines.push('\nKPIs:')
    for (const k of ctx.kpis) {
      lines.push(`  ${k.name} (${k.category}): current=${k.current_value ?? 'N/A'}${k.unit ?? ''} target=${k.target_value ?? 'N/A'}${k.unit ?? ''} status=${k.status}`)
    }
  }

  if (ctx.metrics.length > 0) {
    lines.push('\nBUSINESS METRICS (most recent):')
    for (const m of ctx.metrics.slice(0, 20)) {
      lines.push(`  ${m.category} / ${m.name}: ${m.value} (${m.period_start ?? 'recent'})`)
    }
  }

  if (ctx.insights.length > 0) {
    lines.push('\nACTIVE INSIGHTS:')
    for (const i of ctx.insights) {
      lines.push(`  [${i.severity.toUpperCase()}] ${i.title} (${i.category})`)
    }
  }

  if (ctx.recent_recommendations.length > 0) {
    lines.push('\nRECENT AI RECOMMENDATIONS:')
    for (const r of ctx.recent_recommendations) {
      lines.push(`  ${r.engine}: "${r.title}" — ${r.status}`)
    }
  }

  return lines.join('\n')
}

export async function upsertMemory(
  supabase: SupabaseClient,
  orgId: string,
  entries: Array<{ category: string; key: string; value: string; source?: string }>
): Promise<void> {
  if (entries.length === 0) return
  const rows = entries.map(e => ({
    organization_id: orgId,
    category: e.category,
    key: e.key,
    value: e.value,
    source: e.source ?? 'ai_inference',
    updated_at: new Date().toISOString(),
  }))
  await supabase.from('organizational_memory').upsert(rows, {
    onConflict: 'organization_id,category,key',
  })
}
