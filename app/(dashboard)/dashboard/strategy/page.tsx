'use client'
import { Compass, Target, TrendingUp, CheckSquare } from 'lucide-react'
import { AIEngineChat } from '@/components/ai/AIEngineChat'

export default function StrategyEnginePage() {
  return (
    <AIEngineChat
      engineName="Strategy Engine"
      description="I'm your AI Strategy Engine. Give me a business objective — such as 'grow revenue from $5M to $10M in 18 months' — and I will analyze your current position, identify constraints and opportunities, map required initiatives, set priorities, define success metrics, and produce an executable strategy. What is your goal?"
      placeholder="e.g. Grow annual revenue from $5M to $10M within 18 months"
      systemHint="You are an AI Strategy Engine. Convert business objectives into executable strategies. Analyze current constraints, identify opportunities, define required initiatives with priorities, set measurable milestones, identify key risks, and produce a clear, actionable strategic plan."
      suggested={[
        'Grow revenue from $5M to $10M in 18 months',
        'Reduce operational costs by 20% this year',
        'Expand into 3 new markets in 12 months',
        'Build a profitable SaaS product line',
        'Improve customer retention from 70% to 90%',
        'Achieve profitability within 6 months',
      ]}
      contextItems={[
        { icon: Compass, label: 'Engine', value: 'Strategy Engine' },
        { icon: Target, label: 'Input', value: 'Your business objective' },
        { icon: TrendingUp, label: 'Output', value: 'Executable strategy + milestones' },
        { icon: CheckSquare, label: 'Includes', value: 'Priorities, risks & KPIs' },
      ]}
    />
  )
}
