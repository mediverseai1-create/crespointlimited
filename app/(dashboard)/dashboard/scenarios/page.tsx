'use client'
import { GitBranch, Target, Shield, TrendingUp } from 'lucide-react'
import { AIEngineChat } from '@/components/ai/AIEngineChat'

export default function ScenariosPage() {
  return (
    <AIEngineChat
      engineName="Scenario Intelligence"
      description="I'm your AI Scenario Intelligence engine. Describe a decision or course of action you're considering, and I will model the potential consequences, evaluate multiple outcome paths, identify second-order effects, and compare the risk-reward profile across your options — before you commit. What scenario do you want to evaluate?"
      placeholder="e.g. What happens if we reduce our prices by 20% to compete?"
      systemHint="You are an AI Scenario Intelligence engine. When given a business scenario or proposed decision, model multiple outcome paths, identify consequences (including second-order effects), compare risk vs reward across options, and give a clear recommendation with reasoning."
      suggested={[
        'What if we cut prices by 20% to beat competition?',
        'What happens if we lose our top 3 clients?',
        'What if we double our marketing spend?',
        'What are the consequences of expanding now vs waiting?',
        'What if we shift from B2B to B2C?',
        'What happens if a key supplier fails?',
      ]}
      contextItems={[
        { icon: GitBranch, label: 'Engine', value: 'Scenario Intelligence' },
        { icon: Target, label: 'Input', value: 'Proposed decision or scenario' },
        { icon: Shield, label: 'Analysis', value: 'Consequences & second-order effects' },
        { icon: TrendingUp, label: 'Output', value: 'Risk-reward comparison & recommendation' },
      ]}
    />
  )
}
