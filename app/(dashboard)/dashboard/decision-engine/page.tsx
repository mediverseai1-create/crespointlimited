'use client'
import { Brain, Target, Shield, Lightbulb } from 'lucide-react'
import { AIEngineChat } from '@/components/ai/AIEngineChat'

export default function DecisionEnginePage() {
  return (
    <AIEngineChat
      engineName="AI Decision Engine"
      description="I'm your AI Executive Decision Engine. Present any business problem, strategic choice, or challenge and I will analyze your data, evaluate your options, surface risks and opportunities, and recommend a decision with full reasoning. What decision do you need to make?"
      placeholder="e.g. Should we expand into the Nigerian market this quarter?"
      systemHint="You are an AI Executive Decision Engine. Analyze business problems and recommend decisions with structured reasoning, risk assessment, and prioritized action steps. Base analysis on the user's business context and data."
      suggested={[
        'Should we enter a new market?',
        'How should we respond to this competitive threat?',
        'Should we raise prices or increase volume?',
        'What is our highest-leverage growth lever right now?',
        'How do we reduce churn without cutting price?',
        'Should we hire now or automate first?',
      ]}
      contextItems={[
        { icon: Brain, label: 'Engine', value: 'AI Decision Engine' },
        { icon: Target, label: 'Purpose', value: 'Strategic decision support' },
        { icon: Shield, label: 'Analysis', value: 'Risks, options & reasoning' },
        { icon: Lightbulb, label: 'Output', value: 'Recommended course of action' },
      ]}
    />
  )
}
