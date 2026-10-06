import Link from 'next/link'
import Image from 'next/image'
import {
  Brain, Compass, GitBranch, TrendingUp, Shield, Lightbulb,
  DollarSign, Globe, FileText, BookOpen, ArrowRight, Check,
  ChevronDown, Lock, Zap, Headphones, Users, BarChart3,
  ShoppingCart, Cog, UserCheck, Package, Search, Activity,
  Upload, Target
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────── */

const trustBadges = [
  { icon: Lock,       label: 'Bank-grade security' },
  { icon: Zap,        label: 'Real-time intelligence' },
  { icon: Headphones, label: 'AI-powered support' },
  { icon: Shield,     label: 'Fully isolated data' },
]

const aiCapabilities = [
  { icon: Brain,      title: 'AI Decision Engine',        desc: 'Analyzes problems and recommends decisions with full reasoning.' },
  { icon: Compass,    title: 'Strategy Engine',           desc: 'Turns business goals into executable strategies with milestones.' },
  { icon: GitBranch,  title: 'Scenario Intelligence',     desc: 'Models the consequences of decisions before you commit.' },
  { icon: TrendingUp, title: 'Forecasting Engine',        desc: 'Predicts outcomes using your data and real-world signals.' },
  { icon: Shield,     title: 'Risk Intelligence',         desc: 'Identifies strategic, financial, and operational risks early.' },
  { icon: Lightbulb,  title: 'Opportunity Intelligence',  desc: 'Surfaces growth and cost opportunities you may be missing.' },
  { icon: DollarSign, title: 'Revenue Intelligence',      desc: 'Deep analysis of pipeline, pricing, customers, and revenue risks.' },
  { icon: Globe,      title: 'Competitive Intelligence',  desc: 'Monitors competitors and market dynamics continuously.' },
  { icon: FileText,   title: 'Executive Briefing Engine', desc: 'Auto-produces decision-ready intelligence for executives and boards.' },
  { icon: BookOpen,   title: 'Decision Memory',           desc: 'Learns from past decisions and outcomes to improve future strategy.' },
]

const dataSources = [
  { icon: BarChart3,  label: 'Revenue & Finance' },
  { icon: Users,      label: 'CRM & Customers' },
  { icon: ShoppingCart, label: 'Sales Pipeline' },
  { icon: Activity,   label: 'Marketing Data' },
  { icon: Cog,        label: 'Operations' },
  { icon: UserCheck,  label: 'Workforce & HR' },
  { icon: Package,    label: 'Product Data' },
  { icon: FileText,   label: 'Business Documents' },
  { icon: Globe,      label: 'Market Intelligence' },
  { icon: Search,     label: 'Competitor Info' },
]

const coreEngines = [
  {
    icon: Brain,
    title: 'AI Decision Engine',
    tag: 'Flagship',
    bullets: [
      'Present any business problem or decision',
      'AI evaluates options with full reasoning',
      'Consequences and risks surfaced upfront',
      'Recommended course of action included',
    ],
  },
  {
    icon: Compass,
    title: 'Strategy Engine',
    tag: 'AI',
    bullets: [
      'Input a goal: "Grow revenue from $5M to $10M"',
      'AI identifies constraints and opportunities',
      'Builds executable strategies with priorities',
      'Monitors whether the strategy is working',
    ],
  },
  {
    icon: GitBranch,
    title: 'Scenario Intelligence',
    tag: 'AI',
    bullets: [
      'Evaluate any decision before committing',
      'Model multiple outcome paths simultaneously',
      'Identify second-order consequences early',
      'Compares risk-reward across all options',
    ],
  },
  {
    icon: FileText,
    title: 'Executive Briefing Engine',
    tag: 'AI',
    bullets: [
      'Auto-generates decision-ready intelligence',
      'Board and executive-level summaries',
      'Flags what changed and what it means',
      'One-click export for meetings and reviews',
    ],
  },
]

const steps = [
  {
    num: '1',
    icon: Upload,
    title: 'Connect your business data',
    desc: 'Upload data from any source — financials, CRM, operations, workforce. No integrations or technical setup needed.',
  },
  {
    num: '2',
    icon: Brain,
    title: 'Define your context and goals',
    desc: 'Tell CrestPoint your objectives and the decisions you face. The AI builds a continuously updated model of your business.',
  },
  {
    num: '3',
    icon: Compass,
    title: 'Get strategic intelligence',
    desc: 'CrestPoint surfaces risks, opportunities, strategy recommendations, and decision support — and monitors outcomes continuously.',
  },
]

const whyTrust = [
  {
    num: '01',
    title: 'AI trained exclusively on your data',
    desc: 'Every analysis is grounded in your actual business context. CrestPoint never gives generic advice — it works with your specific numbers, history, and goals.',
  },
  {
    num: '02',
    title: 'Decisions with full reasoning',
    desc: 'The AI doesn\'t just tell you what to do. It explains why, shows its reasoning, and surfaces the assumptions behind every recommendation.',
  },
  {
    num: '03',
    title: 'Continuously monitors strategy outcomes',
    desc: 'After a strategy is defined, CrestPoint keeps watching. It alerts you when results deviate from plan so you can act before problems compound.',
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    highlight: false,
    desc: 'Get started with no commitment.',
    features: ['Up to 10 KPIs', '2 users', 'Basic AI insights', 'Executive briefings', 'Basic reports'],
    cta: 'Get Started Free',
    href: '/auth/signup',
  },
  {
    name: 'Professional',
    price: '$47',
    period: '/month',
    highlight: false,
    desc: 'For growing teams moving fast.',
    features: ['Unlimited KPIs', '10 users', 'AI Decision Engine', 'Strategy Engine', 'Risk Intelligence', 'Revenue Intelligence'],
    cta: 'Start Professional',
    href: 'https://selar.com/47plan?currency=USD',
  },
  {
    name: 'Growth',
    price: '$57',
    period: '/month',
    highlight: true,
    desc: 'Most popular for scaling businesses.',
    features: ['Everything in Pro', '15 users', 'Scenario Intelligence', 'Competitive Intelligence', 'Forecasting Engine', 'Executive Briefing Engine'],
    cta: 'Start Growth',
    href: 'https://selar.com/57plan?currency=USD',
  },
  {
    name: 'Business',
    price: '$97',
    period: '/month',
    highlight: false,
    desc: 'For enterprises that demand more.',
    features: ['Everything in Growth', '25 users', 'Decision Memory', 'Full AI agent layer', 'Audit logs', 'Custom reporting'],
    cta: 'Start Business',
    href: 'https://selar.com/97plan?currency=USD',
  },
]

const faqs = [
  { q: 'What makes CrestPoint different from a BI dashboard?', a: 'CrestPoint is not a dashboard. It\'s an AI strategic intelligence system. Instead of showing charts, it analyzes your situation, evaluates decisions, builds strategies, identifies risks, and gives you actionable recommendations — all grounded in your real business data.' },
  { q: 'How does the AI Decision Engine work?', a: 'You present a business problem or decision. The AI analyzes your available data, evaluates options, models consequences, identifies risks and opportunities, and recommends a course of action with full reasoning.' },
  { q: 'Can CrestPoint build a strategy from a business objective?', a: 'Yes. Input a goal such as "grow revenue from $5M to $10M in 18 months" and the Strategy Engine will analyze your constraints, identify opportunities, map required initiatives, and produce an executable plan.' },
  { q: 'Is my business data secure?', a: 'Yes. Row-level security ensures your data is completely isolated from every other organization. The AI works only on your data — we never use it to train shared models.' },
  { q: 'Do I need technical expertise to use this?', a: 'No. CrestPoint is designed for executives and business leaders. No SQL, no coding, no technical setup. Upload data and start getting intelligence immediately.' },
  { q: 'Can I cancel anytime?', a: 'Yes. All plans are month-to-month with no long-term commitment. Cancel from your account settings at any time.' },
]

/* ─── Page ─────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="CrestPoint" width={34} height={34} priority />
            <span className="font-extrabold text-lg tracking-tight text-[#0F1E3C]">
              Crest<span className="text-[#D4A843]">Point</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
            <a href="#capabilities" className="hover:text-[#0F1E3C] transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-[#0F1E3C] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#0F1E3C] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="hidden sm:block text-sm font-medium text-[#64748B] hover:text-[#0F1E3C] transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-[#D4A843] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#c49a38] transition-all shadow-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-white pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-4">AI Executive Intelligence</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#0F1E3C] leading-[1.05] tracking-tight mb-6">
            The Strategic Brain<br />
            <span className="text-[#D4A843]">for Your Company.</span>
          </h1>

          <p className="text-xl text-[#64748B] leading-relaxed mb-8 max-w-2xl mx-auto">
            Not a dashboard. An AI system that understands your business, evaluates complex decisions, builds executable strategies, and monitors outcomes — continuously.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-10">
            {[
              'AI Executive Decision Engine — analyze any business problem',
              'Strategy Engine — turn objectives into executable plans',
              'Risk & Scenario Intelligence — see consequences before you commit',
              'Revenue, Competitive & Opportunity Intelligence built in',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#0F1E3C] font-medium">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-[#D4A843]" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/auth/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D4A843] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#c49a38] transition-all shadow-md text-base">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#0F1E3C]/20 text-[#0F1E3C] font-semibold px-8 py-4 rounded-xl hover:border-[#0F1E3C] transition-all text-base">
              See how it works
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-gray-100">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                <Icon className="h-3.5 w-3.5 text-[#D4A843]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CAPABILITIES GRID ── */}
      <section id="capabilities" className="py-20 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">10 AI engines</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-4">One intelligence platform. Everything you need.</h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">Every engine works together — informed by the same business data, compounding over time.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiCapabilities.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#D4A843]/50 hover:shadow-lg transition-all duration-300 group">
                <div className="w-10 h-10 bg-[#0F1E3C] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4A843] transition-colors duration-300">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0F1E3C] text-sm mb-2 leading-snug">{title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT CRESTPOINT UNDERSTANDS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Business Intelligence Layer</p>
              <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-5 leading-snug">
                CrestPoint connects to<br />every part of your business.
              </h2>
              <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                The AI builds a continuously updated intelligence model across your revenue, operations, customers, workforce, and market — so every decision is grounded in what's actually happening.
              </p>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-[#D4A843] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#c49a38] transition-all shadow-md text-sm">
                Connect your data <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dataSources.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-[#F8F6F1] rounded-xl p-4 border border-gray-100 hover:border-[#D4A843]/30 transition-colors">
                  <div className="w-9 h-9 bg-[#0F1E3C] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#D4A843]" />
                  </div>
                  <span className="text-sm font-semibold text-[#0F1E3C]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE ENGINES DETAIL ── */}
      <section className="py-20 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Core engines</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-4">Not reports. Decisions.</h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">CrestPoint replaces the cycle of data → chart → meeting → decision with AI that does the thinking for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreEngines.map(({ icon: Icon, title, tag, bullets }) => (
              <div key={title} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#D4A843]/40 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 bg-[#0F1E3C] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#D4A843] transition-colors duration-300">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[#0F1E3C] text-base leading-snug">{title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${tag === 'Flagship' ? 'bg-[#D4A843]/15 text-[#c49a38]' : 'bg-amber-50 text-amber-600'}`}>{tag}</span>
                </div>
                <ul className="space-y-2 flex-1">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[#64748B]">
                      <Check className="h-3.5 w-3.5 text-[#D4A843] flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="mt-5 text-xs font-bold text-[#D4A843] hover:text-[#c49a38] flex items-center gap-1 transition-colors">
                  Get started <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Get started</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-4">From data to strategic intelligence in minutes</h2>
            <p className="text-[#64748B] text-lg">No integrations, no setup teams, no waiting. Upload your data and the AI gets to work.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="bg-[#F8F6F1] rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-6xl font-extrabold text-gray-100 select-none group-hover:text-[#D4A843]/10 transition-colors">
                  {num}
                </div>
                <div className="w-14 h-14 bg-[#0F1E3C] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D4A843] transition-colors duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#D4A843] text-white text-xs font-bold mb-4">
                  {num}
                </div>
                <h3 className="font-bold text-[#0F1E3C] text-lg mb-3">{title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST ── */}
      <section className="py-24 bg-[#0F1E3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Why trust CrestPoint</p>
              <h2 className="text-4xl font-extrabold text-white mb-6">Intelligence you can act on</h2>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                Most AI tools give generic answers. CrestPoint knows your business — and builds that understanding over time.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Shield, label: 'Bank-grade security' },
                  { icon: Target, label: 'Contextual to your business' },
                  { icon: Brain, label: 'Reasoning, not just answers' },
                  { icon: BookOpen, label: 'Learns from your decisions' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold text-white/70">
                    <Icon className="h-3.5 w-3.5 text-[#D4A843]" />{label}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              {whyTrust.map(({ num, title, desc }) => (
                <div key={num} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D4A843]/25 transition-all group">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-extrabold text-[#D4A843]/30 group-hover:text-[#D4A843]/60 transition-colors leading-none flex-shrink-0 mt-0.5">
                      {num}
                    </span>
                    <div>
                      <h3 className="font-bold text-white mb-2">{title}</h3>
                      <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Pricing</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-4">Simple, transparent pricing</h2>
            <p className="text-[#64748B] text-lg">Start free. Scale as you grow. No surprises, no contracts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col transition-all ${
                  plan.highlight
                    ? 'bg-[#0F1E3C] shadow-2xl ring-2 ring-[#D4A843] scale-[1.03]'
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#D4A843] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow whitespace-nowrap">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-[#0F1E3C]'}`}>{plan.name}</h3>
                <p className={`text-xs mb-4 ${plan.highlight ? 'text-white/50' : 'text-[#64748B]'}`}>{plan.desc}</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#0F1E3C]'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-white/50' : 'text-[#64748B]'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? 'text-white/70' : 'text-[#64748B]'}`}>
                      <Check className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-[#D4A843] text-white hover:bg-[#c49a38]'
                      : 'border-2 border-[#0F1E3C] text-[#0F1E3C] hover:bg-[#0F1E3C] hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#64748B] mt-8">All plans include a 14-day money-back guarantee · No credit card for Free plan</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">FAQ</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C]">Frequently asked questions</h2>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white">
                <summary className="flex items-center justify-between cursor-pointer list-none px-6 py-5 hover:bg-[#F8F6F1] transition-colors">
                  <span className="font-semibold text-[#0F1E3C] pr-4">{q}</span>
                  <ChevronDown className="h-4 w-4 text-[#64748B] flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-6 pb-5 text-sm text-[#64748B] leading-relaxed bg-[#F8F6F1]">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-[#0F1E3C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, #D4A843 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #D4A843 0%, transparent 55%)`
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-4">Get started today</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Give your company<br />an AI strategic brain.
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Create a free account and start making better decisions with AI intelligence built on your actual business data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-[#D4A843] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#c49a38] transition-all shadow-xl flex items-center justify-center gap-2 text-base">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#capabilities" className="w-full sm:w-auto border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition-all text-center text-base">
              Explore capabilities
            </a>
          </div>
          <p className="text-white/25 text-xs mt-6">No credit card required · Free plan available · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060f1f] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/logo.svg" alt="CrestPoint" width={30} height={30} />
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Crest<span className="text-[#D4A843]">Point</span>
                  <span className="font-light text-white/40 text-sm ml-1">Limited</span>
                </span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                The AI strategic brain for modern companies. Executive decision intelligence, built on your data.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Platform</p>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="#capabilities" className="hover:text-white/80 transition-colors">Capabilities</a></li>
                <li><a href="#how-it-works" className="hover:text-white/80 transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white/80 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Account</p>
              <ul className="space-y-3 text-sm text-white/50">
                <li><Link href="/auth/signup" className="hover:text-white/80 transition-colors">Get Started Free</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white/80 transition-colors">Sign In</Link></li>
                <li><a href="#" className="hover:text-white/80 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white/80 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} CrestPoint Limited. All rights reserved.</p>
            <p className="text-xs text-white/20">The AI strategic brain for the modern company.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
