'use client'
import { Shield, AlertTriangle, Target, TrendingUp } from 'lucide-react'
import { AIEngineChat } from '@/components/ai/AIEngineChat'

export default function RiskIntelligencePage() {
  return (
    <AIEngineChat
      engineName="Risk Intelligence"
      description="I'm your AI Risk Intelligence engine. Ask me to assess risks across any dimension of your business — strategic, financial, operational, commercial, or compliance. I will identify risks you may be underestimating, model their potential impact, and recommend mitigation strategies. What area do you want me to assess?"
      placeholder="e.g. What are our biggest financial risks heading into next quarter?"
      systemHint="You are an AI Risk Intelligence engine. Identify and assess strategic, financial, operational, commercial, and compliance risks. For each risk, assess probability, potential impact, early warning signals, and recommended mitigation actions. Be specific and prioritize by severity."
      suggested={[
        'What are our biggest risks heading into next quarter?',
        'Assess our revenue concentration risk',
        'What operational risks are we underestimating?',
        'What are our key strategic vulnerabilities?',
        'Analyze our cash flow risk for the next 6 months',
        'What compliance or regulatory risks should we monitor?',
      ]}
      contextItems={[
        { icon: Shield, label: 'Engine', value: 'Risk Intelligence' },
        { icon: AlertTriangle, label: 'Covers', value: 'Strategic, financial, operational' },
        { icon: Target, label: 'Also covers', value: 'Commercial & compliance risks' },
        { icon: TrendingUp, label: 'Output', value: 'Risk map + mitigation priorities' },
      ]}
    />
  )
}
