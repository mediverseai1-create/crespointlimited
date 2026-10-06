'use client'
import { Globe, Search, Shield, TrendingUp } from 'lucide-react'
import { AIEngineChat } from '@/components/ai/AIEngineChat'

export default function CompetitiveIntelligencePage() {
  return (
    <AIEngineChat
      engineName="Competitive Intelligence"
      description="I'm your AI Competitive Intelligence engine. Tell me about your competitors, market dynamics, or strategic threats and I will analyze the competitive landscape, identify your vulnerabilities and advantages, monitor relevant market movements, and recommend how to position and respond. What would you like to understand about your competitive environment?"
      placeholder="e.g. Our main competitor just dropped prices by 30% — how should we respond?"
      systemHint="You are an AI Competitive Intelligence engine. Analyze competitive threats, market positioning, competitor moves, industry dynamics, and strategic opportunities. Help identify competitive advantages, vulnerabilities, and concrete response strategies. Ask for competitor details if needed."
      suggested={[
        'A competitor just dropped prices — how do we respond?',
        'What are our key competitive advantages we should double down on?',
        'Where are we most vulnerable to competitive attack?',
        'How do we differentiate from our main competitor?',
        'What market trends should we be watching?',
        'How do we win deals we are losing to competitors?',
      ]}
      contextItems={[
        { icon: Globe, label: 'Engine', value: 'Competitive Intelligence' },
        { icon: Search, label: 'Covers', value: 'Competitors & market dynamics' },
        { icon: Shield, label: 'Also covers', value: 'Vulnerabilities & positioning' },
        { icon: TrendingUp, label: 'Output', value: 'Competitive strategy & response' },
      ]}
    />
  )
}
