'use client'
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react'
import { AIEngineChat } from '@/components/ai/AIEngineChat'

export default function RevenueIntelligencePage() {
  return (
    <AIEngineChat
      engineName="Revenue Intelligence"
      description="I'm your AI Revenue Intelligence engine. Ask me anything about your revenue performance, pipeline health, customer segments, pricing strategy, or growth constraints. I will analyze what's working, what's at risk, and where your highest-value revenue opportunities are. What do you want to understand about your revenue?"
      placeholder="e.g. Why has our revenue growth slowed over the past 3 months?"
      systemHint="You are an AI Revenue Intelligence engine. Analyze revenue performance, pipeline health, customer segments, pricing, growth constraints, and revenue risks. Identify what's working, what's underperforming, churn risks, upsell opportunities, and prioritized revenue growth levers."
      suggested={[
        'Why has our revenue growth slowed?',
        'Which customer segments are most valuable?',
        'Where are we leaking revenue?',
        'What are our biggest pipeline risks?',
        'How should we think about pricing?',
        'What is our highest-leverage revenue growth action?',
      ]}
      contextItems={[
        { icon: DollarSign, label: 'Engine', value: 'Revenue Intelligence' },
        { icon: TrendingUp, label: 'Covers', value: 'Growth, pipeline & pricing' },
        { icon: Users, label: 'Also covers', value: 'Customer segments & churn' },
        { icon: Target, label: 'Output', value: 'Revenue opportunities & risks' },
      ]}
    />
  )
}
