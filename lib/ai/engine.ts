import { geminiModel } from '@/lib/gemini'
import type { StructuredAnalysis, EngineType, OrgContext } from './types'
import { serializeContext } from './memory'

const ENGINE_PERSONAS: Record<EngineType, string> = {
  decision: 'You are an AI Executive Decision Engine. Your role is to analyze complex business problems, evaluate strategic options with rigorous reasoning, surface hidden risks and opportunities, and recommend a clear decision with full justification.',
  strategy: 'You are an AI Strategy Engine. Your role is to take business objectives and convert them into complete, executable strategies — analyzing constraints, identifying growth levers, mapping initiatives with priorities, setting measurable milestones, and defining success metrics.',
  scenario: 'You are an AI Scenario Intelligence Engine. Your role is to model the consequences of proposed decisions — mapping multiple outcome paths, identifying second-order effects, comparing risk-reward profiles across options, and recommending the most defensible course of action.',
  risk: 'You are an AI Risk Intelligence Engine. Your role is to identify, assess, and prioritize risks across strategic, financial, operational, commercial, and compliance dimensions — surfacing early warning signals and recommending specific mitigation actions.',
  revenue: 'You are an AI Revenue Intelligence Engine. Your role is to analyze revenue performance, pipeline health, customer dynamics, pricing, and growth constraints — identifying revenue leaks, growth opportunities, and churn risks with concrete recommended actions.',
  competitive: 'You are an AI Competitive Intelligence Engine. Your role is to analyze the competitive landscape, monitor market dynamics, identify strategic vulnerabilities and advantages, and recommend how to position and respond to competitive threats.',
  briefing: 'You are an AI Executive Briefing Engine. Your role is to synthesize the organization\'s current situation into a concise, decision-ready intelligence briefing — summarizing what matters most, what has changed, what needs a decision, and what the AI recommends.',
  insights: 'You are an AI Insight Generator. Your role is to surface non-obvious patterns, anomalies, and trends from the organization\'s data — generating actionable insights ranked by business impact.',
}

const STRUCTURED_OUTPUT_SCHEMA = `
{
  "summary": "2-3 sentence executive summary of your analysis",
  "confidence": 0.85,
  "reasoning_chain": [
    "Step 1: What you examined first and why",
    "Step 2: What you found and what it implies",
    "Step 3: How you weighed the options or factors",
    "Step 4: What drove your conclusion"
  ],
  "key_findings": [
    "Specific, data-grounded finding 1",
    "Specific, data-grounded finding 2"
  ],
  "recommendations": [
    {
      "title": "Clear action title",
      "description": "Specific description of what to do and why",
      "priority": "critical|high|medium|low",
      "effort": "quick_win|medium_term|long_term",
      "expected_impact": "Specific expected outcome",
      "timeframe": "e.g. Next 2 weeks"
    }
  ],
  "risks": [
    {
      "title": "Risk title",
      "severity": "critical|high|medium|low",
      "likelihood": "high|medium|low",
      "description": "What the risk is and why it matters",
      "mitigation": "Specific mitigation action",
      "early_signals": ["Signal to watch for"]
    }
  ],
  "opportunities": [
    {
      "title": "Opportunity title",
      "description": "What this opportunity is",
      "potential_impact": "Expected business impact",
      "required_action": "What to do to capture it",
      "timeframe": "When to act"
    }
  ],
  "predictions": [
    {
      "statement": "If X then Y prediction",
      "confidence": 0.75,
      "horizon": "e.g. 90 days",
      "rationale": "Why you expect this"
    }
  ],
  "next_steps": [
    "Immediate action 1",
    "Immediate action 2"
  ],
  "data_gaps": [
    "What additional data would improve this analysis"
  ]
}`

export async function runEngine(
  engine: EngineType,
  query: string,
  ctx: OrgContext
): Promise<StructuredAnalysis> {
  const persona = ENGINE_PERSONAS[engine]
  const contextStr = serializeContext(ctx)

  const prompt = `${persona}

You are analyzing the following organization:
${contextStr}

USER QUERY / REQUEST:
${query}

INSTRUCTIONS:
- Base your analysis on the actual data provided above
- Be specific — reference real numbers, KPIs, and metrics where available
- If data is missing, note it in data_gaps but still provide your best analysis
- Provide your reasoning step by step
- Be direct and actionable — executives need decisions, not hedging
- Scale the number of recommendations, risks, and opportunities to what the data supports (don't pad with generic advice)
- confidence should reflect how much data you have: 0.3-0.5 = limited data, 0.6-0.75 = some data, 0.76-0.9 = good data, 0.91+ = rich data

Respond ONLY with valid JSON matching this exact schema (no markdown, no preamble):
${STRUCTURED_OUTPUT_SCHEMA}`

  const text = await geminiModel.generateContent(prompt).then(r => r.response.text())

  // Strip markdown fences if present
  const clean = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    const parsed = JSON.parse(clean) as StructuredAnalysis
    parsed.engine = engine
    return parsed
  } catch {
    // Fallback: wrap in minimal structure
    return {
      summary: text.slice(0, 500),
      confidence: 0.5,
      reasoning_chain: ['Analysis generated but could not be structured.'],
      key_findings: [],
      recommendations: [],
      risks: [],
      opportunities: [],
      predictions: [],
      next_steps: [],
      data_gaps: ['Unable to parse structured output — raw analysis above'],
      engine,
    }
  }
}

export async function runQuickChat(
  query: string,
  ctx: OrgContext,
  engineHint?: EngineType
): Promise<string> {
  const persona = engineHint ? ENGINE_PERSONAS[engineHint] : ENGINE_PERSONAS.decision
  const contextStr = serializeContext(ctx)

  const prompt = `${persona}

Organization context:
${contextStr}

Question: ${query}

Provide a direct, concise, expert answer. Reference the actual data where relevant. Be specific, not generic.`

  return geminiModel.generateContent(prompt).then(r => r.response.text())
}
