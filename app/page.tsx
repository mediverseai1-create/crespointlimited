'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Brain, Compass, GitBranch, Shield, DollarSign, Globe,
  FileText, BookOpen, TrendingUp, Lightbulb, ArrowRight, Check,
  Lock, Zap, Headphones, Database, ChevronDown
} from 'lucide-react'

/* ─── Feature tabs ──────────────────────────────────── */
const featureTabs = [
  {
    id: 'decision',
    label: 'Decision Engine',
    icon: Brain,
    headline: 'Every decision backed by structured AI reasoning',
    body: 'Describe the problem. The AI loads your organizational context — financials, KPIs, history, constraints — and returns a structured recommendation with confidence scores, a full reasoning chain, and ranked next steps. Not a chatbot. A strategic thinking partner.',
    bullets: ['Structured analysis with confidence scoring', 'Full reasoning chain exposed — no black box', 'Recommendations saved and actionable'],
  },
  {
    id: 'strategy',
    label: 'Strategy Engine',
    icon: Compass,
    headline: 'Turn business goals into executable plans',
    body: 'Input your objective. The AI produces a full strategic plan: phases, milestones, resource requirements, risks, success metrics, and alternatives — all grounded in your actual business data and market context.',
    bullets: ['Context-aware strategic planning', 'Milestone breakdowns with timelines', 'Risk and opportunity mapping built in'],
  },
  {
    id: 'scenario',
    label: 'Scenario Intelligence',
    icon: GitBranch,
    headline: 'See the consequences before you commit',
    body: 'Model any decision or market event. The AI maps multiple outcome paths, quantifies second-order effects, compares risk-reward profiles, and tells you which path fits your context — before anything is irreversible.',
    bullets: ['Multiple scenario paths modeled in parallel', 'Second-order consequence mapping', 'Risk-reward comparison across options'],
  },
  {
    id: 'risk',
    label: 'Risk Intelligence',
    icon: Shield,
    headline: 'Spot risks before they become crises',
    body: 'Continuous AI monitoring across strategic, financial, operational, commercial, and compliance dimensions. Early warning signals surface automatically. The AI prioritizes by severity and suggests mitigation actions.',
    bullets: ['Multi-dimensional risk scanning', 'Early warning signals with severity scoring', 'Mitigation recommendations auto-generated'],
  },
  {
    id: 'revenue',
    label: 'Revenue Intelligence',
    icon: DollarSign,
    headline: 'Find the growth levers hiding in your data',
    body: 'Deep analysis of your revenue performance — pipeline health, customer dynamics, pricing effectiveness, churn signals, and expansion opportunities. The AI identifies the highest-leverage growth actions available to you right now.',
    bullets: ['Pipeline health and conversion analysis', 'Revenue leak identification', 'Highest-leverage growth actions ranked'],
  },
  {
    id: 'briefing',
    label: 'Executive Briefing',
    icon: FileText,
    headline: 'Decision-ready intelligence, delivered automatically',
    body: 'The briefing agent runs continuously. It synthesizes your KPIs, risks, opportunities, and outstanding decisions into a structured executive intelligence brief — ready before your Monday morning meeting.',
    bullets: ['Auto-generated executive briefings', 'KPI, risk, and opportunity synthesis', 'Recommendation inbox with feedback loop'],
  },
]

const engines = [
  { icon: Brain,      title: 'Decision Engine',        desc: 'Analyze any business problem and get a structured recommendation with reasoning.' },
  { icon: Compass,    title: 'Strategy Engine',         desc: 'Turn goals into executable strategies with phases and milestones.' },
  { icon: GitBranch,  title: 'Scenario Intelligence',   desc: 'Model decision consequences and compare outcome paths.' },
  { icon: Shield,     title: 'Risk Intelligence',       desc: 'Continuous risk scanning across all business dimensions.' },
  { icon: DollarSign, title: 'Revenue Intelligence',    desc: 'Pipeline, customers, pricing, and growth lever analysis.' },
  { icon: Globe,      title: 'Competitive Intelligence',desc: 'Monitor competitors and market dynamics continuously.' },
  { icon: TrendingUp, title: 'Forecasting',             desc: 'Predict outcomes using your data and market signals.' },
  { icon: Lightbulb,  title: 'Opportunity Intelligence',desc: 'Surface growth and cost opportunities you may be missing.' },
  { icon: FileText,   title: 'Executive Briefing',      desc: 'Auto-produced intelligence briefs for executives and boards.' },
  { icon: BookOpen,   title: 'Decision Memory',         desc: 'Learns from past decisions and outcomes to improve future strategy.' },
]

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Get started and explore the AI engines.',
    features: ['3 AI analyses per month', 'Decision & Strategy Engine', 'Basic organizational memory', '1 user'],
    cta: 'Start for free',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$47',
    period: 'per month',
    desc: 'For executives and founders who need continuous intelligence.',
    features: ['Unlimited AI analyses', 'All 8 intelligence engines', 'Persistent organizational memory', 'Recommendation inbox', 'Up to 5 users'],
    cta: 'Get started',
    href: 'https://selar.com/crestpointpro',
    highlight: true,
  },
  {
    name: 'Growth',
    price: '$57',
    period: 'per month',
    desc: 'For growing teams with deeper intelligence needs.',
    features: ['Everything in Professional', 'Briefing agent (auto-runs daily)', 'KPI monitoring & alerts', 'Priority support', 'Up to 15 users'],
    cta: 'Get started',
    href: 'https://selar.com/crestpointgrowth',
    highlight: false,
  },
  {
    name: 'Business',
    price: '$97',
    period: 'per month',
    desc: 'For leadership teams running on AI intelligence.',
    features: ['Everything in Growth', 'Unlimited users', 'Custom AI personas', 'API access', 'Dedicated success manager'],
    cta: 'Get started',
    href: 'https://selar.com/crestpointbusiness',
    highlight: false,
  },
]

const faqs = [
  { q: 'How is this different from ChatGPT?', a: 'CrestPoint loads your organization\'s actual data — KPIs, financials, history, goals — before every analysis. Every output is structured JSON with reasoning chains, confidence scores, and saved recommendations. It is a persistent intelligence system, not a chat session.' },
  { q: 'Do I need to upload data to get value?', a: 'No. You can start with context you type in. The AI builds your organizational memory over time. The more you use it, the smarter it gets about your specific business.' },
  { q: 'Is my business data secure?', a: 'Yes. Each organization\'s data is fully isolated with row-level security. We never train on your data. All data is encrypted at rest and in transit.' },
  { q: 'What AI model powers CrestPoint?', a: 'Google Gemini 1.5 Flash — chosen for its large context window, reasoning capability, and fast response times. This allows us to load your full organizational context into every analysis.' },
  { q: 'Can I use this for a team?', a: 'Yes. Professional and above support multiple users. All analyses, recommendations, and organizational memory are shared across your team so everyone works from the same intelligence.' },
]

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('decision')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const activeFeature = featureTabs.find(t => t.id === activeTab)!

  return (
    <>
      {/* Google Font — Playfair Display */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans-body { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      <div className="font-sans-body bg-[#FAF5EE] min-h-screen text-[#0F1E3C]">

        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 bg-[#FAF5EE]/95 backdrop-blur border-b border-[#0F1E3C]/8">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif-display font-bold text-xl text-[#0F1E3C] tracking-tight">
              CrestPoint
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B7280]">
              <Link href="#features" className="hover:text-[#0F1E3C] transition-colors">Features</Link>
              <Link href="#engines" className="hover:text-[#0F1E3C] transition-colors">AI Engines</Link>
              <Link href="#pricing" className="hover:text-[#0F1E3C] transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="text-sm font-medium text-[#6B7280] hover:text-[#0F1E3C] transition-colors">
                Log in
              </Link>
              <Link href="/auth/signup"
                className="bg-[#0F1E3C] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1a3060] transition-colors">
                Try CrestPoint free
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest mb-6">
            AI Executive Intelligence
          </p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-bold text-[#0F1E3C] leading-[1.1] mb-6 max-w-4xl mx-auto">
            Turn decisions into{' '}
            <span className="relative inline-block">
              strategic advantage
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 16" fill="none" preserveAspectRatio="none">
                <path d="M2 12 Q100 4 200 10 Q300 16 398 8" stroke="#F06930" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            CrestPoint is the AI intelligence system for business executives — analyzing your context, surfacing risks, modeling scenarios, and generating structured recommendations so you lead with clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup"
              className="bg-[#0F1E3C] text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-[#1a3060] transition-colors w-full sm:w-auto text-center">
              Get started for free
            </Link>
            <Link href="#features"
              className="border border-[#0F1E3C]/20 text-[#0F1E3C] font-semibold px-8 py-4 rounded-full text-base hover:border-[#0F1E3C]/40 transition-colors w-full sm:w-auto text-center">
              See how it works
            </Link>
          </div>

          {/* Product preview card */}
          <div className="bg-[#0F1E3C] rounded-3xl p-6 md:p-8 text-left max-w-5xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-xs text-white/40 font-mono">CrestPoint — Executive Briefing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs text-[#F06930] font-bold uppercase tracking-widest mb-3">Decision Engine</p>
                <p className="text-sm text-white/80 mb-4 leading-relaxed">Should we enter the East African market in Q1 or delay to Q3?</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F06930]" />
                    <p className="text-xs text-white/60">Confidence: 87%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <p className="text-xs text-white/60">Recommendation: Q3 entry</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <p className="text-xs text-white/60">3 risks • 2 opportunities</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs text-[#F06930] font-bold uppercase tracking-widest mb-3">Risk Intelligence</p>
                <div className="space-y-3">
                  {[
                    { label: 'Revenue concentration', level: 'High', color: 'bg-red-400' },
                    { label: 'Key person dependency', level: 'Medium', color: 'bg-amber-400' },
                    { label: 'Regulatory compliance', level: 'Low', color: 'bg-green-400' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between">
                      <p className="text-xs text-white/70">{r.label}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${r.color}`}>{r.level}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs text-[#F06930] font-bold uppercase tracking-widest mb-3">AI Recommendations</p>
                <div className="space-y-3">
                  {[
                    { title: 'Diversify top 3 clients', priority: 'Critical' },
                    { title: 'Launch referral program', priority: 'High' },
                    { title: 'Review pricing model', priority: 'Medium' },
                  ].map(rec => (
                    <div key={rec.title} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-white/80 leading-tight">{rec.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">{rec.priority}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <section className="border-y border-[#0F1E3C]/10 bg-white/40 py-6">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-[#6B7280]">
            {[
              { icon: Lock,       label: 'Bank-grade security' },
              { icon: Zap,        label: 'Real-time intelligence' },
              { icon: Database,   label: 'Isolated org data' },
              { icon: Headphones, label: 'AI-powered support' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#F06930]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURE TABS ── */}
        <section id="features" className="py-24 max-w-6xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest text-center mb-4">Intelligence engines</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-bold text-[#0F1E3C] text-center mb-16 max-w-2xl mx-auto leading-tight">
            Everything you need to lead with intelligence
          </h2>

          {/* Tab row */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {featureTabs.map(tab => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#0F1E3C] text-white shadow-sm'
                      : 'bg-white border border-[#0F1E3C]/10 text-[#6B7280] hover:border-[#0F1E3C]/30 hover:text-[#0F1E3C]'
                  }`}>
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif-display text-3xl md:text-4xl font-bold text-[#0F1E3C] leading-tight mb-6">
                {activeFeature.headline}
              </h3>
              <p className="text-[#6B7280] leading-relaxed mb-8 text-lg">
                {activeFeature.body}
              </p>
              <ul className="space-y-3 mb-8">
                {activeFeature.bullets.map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm font-medium text-[#0F1E3C]">
                    <div className="w-5 h-5 rounded-full bg-[#F06930]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-[#F06930]" />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup"
                className="inline-flex items-center gap-2 bg-[#0F1E3C] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#1a3060] transition-colors">
                Try {activeFeature.label} free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-[#0F1E3C] rounded-3xl p-6 min-h-[340px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {(() => { const Icon = activeFeature.icon; return <div className="w-8 h-8 rounded-lg bg-[#F06930]/20 flex items-center justify-center"><Icon className="h-4 w-4 text-[#F06930]" /></div> })()}
                  <p className="text-sm font-bold text-white">{activeFeature.label}</p>
                </div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4 font-semibold">Analysis output</p>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-[#F06930] font-semibold mb-2">Summary</p>
                    <p className="text-xs text-white/70 leading-relaxed">AI analysis complete. Confidence: 87%. 3 key findings, 4 recommendations, 2 critical risks identified.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-[#F06930] font-semibold mb-2">Reasoning Chain</p>
                    <div className="space-y-1.5">
                      {['Assessed organizational context', 'Analyzed competitive landscape', 'Modeled financial impact', 'Generated ranked recommendations'].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                          <span className="text-xs text-white/30 w-4">{i + 1}.</span>
                          <p className="text-xs text-white/60">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                  <div className="bg-[#F06930] h-1.5 rounded-full w-4/5" />
                </div>
                <span className="text-xs text-white/40">87% confidence</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-[#0F1E3C] py-24">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest mb-4">How it works</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-bold text-white mb-16 max-w-2xl mx-auto leading-tight">
              The AI sits at the core
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: '01', title: 'Load your context', body: 'The AI reads your organization — KPIs, financials, history, goals, constraints, market. Everything becomes organizational memory that sharpens every analysis.' },
                { n: '02', title: 'Run structured analysis', body: 'Ask a question. The AI reasons step-by-step using your full context, produces confidence-scored output with findings, risks, opportunities, and ranked recommendations.' },
                { n: '03', title: 'Act and improve', body: 'Accept, reject, or defer each recommendation. The AI records your decisions and outcomes. Over time, it becomes smarter about what works for your specific business.' },
              ].map(s => (
                <div key={s.n} className="text-left p-6 rounded-3xl bg-white/5 border border-white/10">
                  <span className="font-serif-display text-5xl font-bold text-[#F06930]/40 block mb-4">{s.n}</span>
                  <h3 className="font-serif-display text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL ENGINES ── */}
        <section id="engines" className="py-24 max-w-6xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest text-center mb-4">Full platform</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-bold text-[#0F1E3C] text-center mb-4 max-w-xl mx-auto leading-tight">
            10 AI engines. One intelligence platform.
          </h2>
          <p className="text-[#6B7280] text-center max-w-xl mx-auto mb-16">Every engine shares the same organizational memory and feeds recommendations into the same actionable inbox.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {engines.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#0F1E3C]/8 rounded-2xl p-5 hover:border-[#F06930]/50 hover:shadow-lg transition-all duration-300 group">
                <div className="w-10 h-10 bg-[#FAF5EE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F06930]/10 transition-colors">
                  <Icon className="h-5 w-5 text-[#0F1E3C]" />
                </div>
                <h3 className="font-semibold text-[#0F1E3C] text-sm mb-2 leading-snug">{title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-24 bg-white/50">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest text-center mb-4">Pricing</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-bold text-[#0F1E3C] text-center mb-4 leading-tight">
              Intelligence that fits your stage
            </h2>
            <p className="text-[#6B7280] text-center max-w-lg mx-auto mb-16">Start free. Upgrade as your intelligence needs grow.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricing.map(plan => (
                <div key={plan.name}
                  className={`rounded-3xl p-7 flex flex-col ${plan.highlight
                    ? 'bg-[#0F1E3C] text-white shadow-2xl ring-2 ring-[#F06930]'
                    : 'bg-white border border-[#0F1E3C]/8 text-[#0F1E3C]'}`}>
                  {plan.highlight && (
                    <p className="text-xs font-bold text-[#F06930] uppercase tracking-widest mb-3">Most popular</p>
                  )}
                  <h3 className={`font-serif-display text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-[#0F1E3C]'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`font-serif-display text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-[#0F1E3C]'}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? 'text-white/50' : 'text-[#6B7280]'}`}>/{plan.period}</span>
                  </div>
                  <p className={`text-sm mb-6 leading-relaxed ${plan.highlight ? 'text-white/60' : 'text-[#6B7280]'}`}>{plan.desc}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-[#F06930]' : 'text-[#F06930]'}`} />
                        <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-[#6B7280]'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}
                    className={`w-full text-center py-3 rounded-full text-sm font-bold transition-colors ${plan.highlight
                      ? 'bg-[#F06930] text-white hover:bg-[#d4561f]'
                      : 'bg-[#0F1E3C] text-white hover:bg-[#1a3060]'}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 max-w-3xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest text-center mb-4">FAQ</p>
          <h2 className="font-serif-display text-4xl font-bold text-[#0F1E3C] text-center mb-16">Common questions</h2>
          <div className="divide-y divide-[#0F1E3C]/8">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4">
                  <span className="font-serif-display text-lg font-semibold text-[#0F1E3C]">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-[#6B7280] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="text-[#6B7280] leading-relaxed pb-5 text-sm">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="bg-[#0F1E3C] rounded-3xl p-12 md:p-16 text-center">
            <p className="text-sm font-semibold text-[#F06930] uppercase tracking-widest mb-4">Get started today</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto leading-tight">
              Your AI executive team is ready
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Start free. No credit card. Add your organizational context, run your first analysis, and see what strategic intelligence feels like.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup"
                className="bg-[#F06930] text-[#0F1E3C] font-bold px-10 py-4 rounded-full text-base hover:bg-[#d4561f] transition-colors w-full sm:w-auto text-center">
                Start for free
              </Link>
              <Link href="/pricing"
                className="border border-white/20 text-white font-semibold px-10 py-4 rounded-full text-base hover:border-white/40 transition-colors w-full sm:w-auto text-center">
                Compare plans
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#0F1E3C]/10 py-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-serif-display font-bold text-lg text-[#0F1E3C]">CrestPoint</span>
            <div className="flex flex-wrap gap-6 text-sm text-[#6B7280] justify-center">
              <Link href="/auth/signin" className="hover:text-[#0F1E3C] transition-colors">Log in</Link>
              <Link href="/auth/signup" className="hover:text-[#0F1E3C] transition-colors">Sign up</Link>
              <Link href="#pricing" className="hover:text-[#0F1E3C] transition-colors">Pricing</Link>
              <Link href="mailto:support@crestpointlimited.click" className="hover:text-[#0F1E3C] transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-[#6B7280]">© {new Date().getFullYear()} CrestPoint Limited</p>
          </div>
        </footer>
      </div>
    </>
  )
}
