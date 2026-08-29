import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart3, Target, Bot, Lightbulb, TrendingUp, Sparkles,
  Cog, CheckSquare, AlertTriangle, ArrowRight, Check,
  ChevronDown, Shield, Zap, Users, Activity, Upload,
  FileText, MessageSquare, Star, Lock, Clock, Headphones
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────── */

const tickerItems = [
  'Revenue Tracking', 'KPI Management', 'AI Business Analyst', 'Root-Cause Analysis',
  'Automated Insights', 'Opportunity Detection', 'Action Center', 'Forecasting',
  'Operations Intelligence', 'Team Collaboration', 'Executive Reports', 'Data Hub',
]

const trustBadges = [
  { icon: Lock,       label: 'Bank-grade security' },
  { icon: Zap,        label: 'Real-time analysis' },
  { icon: Headphones, label: '24/7 AI support' },
  { icon: Shield,     label: 'Fully isolated data' },
]

const stats = [
  { value: '500+',  label: 'Businesses onboarded' },
  { value: '9',     label: 'Integrated modules' },
  { value: '14+',   label: 'Dashboard pages' },
  { value: '100%',  label: 'Data isolation' },
]

const features = [
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    tag: 'Core',
    bullets: [
      'Real-time dashboards for every unit',
      'Revenue, operations & workforce views',
      'Automated executive reports',
      'Custom metric tracking',
    ],
  },
  {
    icon: Bot,
    title: 'AI Business Analyst',
    tag: 'AI',
    bullets: [
      'Ask questions in plain English',
      'Answers grounded in your real data',
      'Recommended actions included',
      'Powered by Google Gemini',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Automated Insights',
    tag: 'AI',
    bullets: [
      'Surface anomalies automatically',
      'Spot trends before they escalate',
      'Proactive opportunity detection',
      'Zero manual analysis required',
    ],
  },
  {
    icon: CheckSquare,
    title: 'Action Center',
    tag: 'Workflow',
    bullets: [
      'Turn insights into tasks instantly',
      'Assign actions to team members',
      'Track progress and close the loop',
      'Accountability built in',
    ],
  },
]

const quickModules = [
  { icon: '📊', label: 'Dashboard',     desc: 'Full business overview' },
  { icon: '🎯', label: 'KPIs',          desc: 'Track what matters' },
  { icon: '🤖', label: 'AI Analyst',    desc: 'Ask anything' },
  { icon: '💡', label: 'Insights',      desc: 'Auto-detected patterns' },
  { icon: '📈', label: 'Trends',        desc: 'Historical analysis' },
  { icon: '🔎', label: 'Opportunities', desc: 'Revenue & cost wins' },
  { icon: '✅', label: 'Actions',       desc: 'Task accountability' },
  { icon: '📁', label: 'Reports',       desc: 'Shareable exports' },
  { icon: '⚙️', label: 'Operations',   desc: 'Workforce & supply chain' },
]

const steps = [
  {
    num: '1',
    icon: Upload,
    title: 'Create your account',
    desc: 'Sign up in minutes with just your email. No credit card required for the free plan.',
  },
  {
    num: '2',
    icon: Activity,
    title: 'Connect your data',
    desc: 'Upload CSV or Excel files from any business system. Define your KPIs immediately.',
  },
  {
    num: '3',
    icon: Bot,
    title: 'Get instant intelligence',
    desc: 'CrestPoint surfaces insights, flags issues, and gives you AI-powered recommendations from day one.',
  },
]

const whyTrust = [
  {
    num: '01',
    title: 'Complete data isolation',
    desc: 'Row-level security ensures your business data is completely isolated from every other organization on the platform. We never use your data to train AI.',
  },
  {
    num: '02',
    title: 'AI that knows your business',
    desc: 'Unlike generic tools, our AI is configured with your organization\'s actual metrics and context — so answers are specific to you, not generic advice.',
  },
  {
    num: '03',
    title: 'Insights that lead to action',
    desc: 'Every insight comes with recommended actions. CrestPoint doesn\'t just tell you what\'s wrong — it tells you what to do about it.',
  },
]

const testimonials = [
  {
    platform: 'In-app',
    quote: 'Finally a dashboard that tells me what to do, not just what happened. The AI analyst is genuinely useful.',
    name: 'Tunde Adeyemi',
    role: 'CEO',
    company: 'Nexcore Logistics · Lagos',
    month: 'Jun 2026',
  },
  {
    platform: 'On LinkedIn',
    quote: 'We spotted a cost overrun in operations within the first week. CrestPoint paid for itself instantly.',
    name: 'Chioma Okafor',
    role: 'COO',
    company: 'BridgeScale Ltd · Abuja',
    month: 'May 2026',
  },
  {
    platform: 'In-app',
    quote: 'The AI answers are surprisingly accurate. It knows our numbers and actually explains the why behind every change.',
    name: 'James Eferebo',
    role: 'Operations Manager',
    company: 'Harven Retail · Port Harcourt',
    month: 'Apr 2026',
  },
  {
    platform: 'On X',
    quote: 'Set up in under 30 minutes. Had my first KPI report before lunch. Honestly impressive for the price.',
    name: 'Adaeze Nwosu',
    role: 'Business Owner',
    company: 'Adaeze Farms · Enugu',
    month: 'Mar 2026',
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    highlight: false,
    desc: 'Get started with no commitment.',
    features: ['Up to 10 KPIs', '2 users', 'Basic dashboard', 'Basic insights', 'Basic reports'],
    cta: 'Get Started Free',
    href: '/auth/signup',
  },
  {
    name: 'Professional',
    price: '$47',
    period: '/month',
    highlight: false,
    desc: 'For growing teams moving fast.',
    features: ['Unlimited KPIs', '10 users', 'Advanced dashboards', 'AI Business Analyst', 'Automated insights', 'Action Center'],
    cta: 'Start Professional',
    href: 'https://selar.com/47plan?currency=USD',
  },
  {
    name: 'Growth',
    price: '$57',
    period: '/month',
    highlight: true,
    desc: 'Most popular for scaling businesses.',
    features: ['Everything in Pro', '15 users', 'Root-cause analysis', 'Scenario planning', 'Opportunity detection', 'Executive summaries'],
    cta: 'Start Growth',
    href: 'https://selar.com/57plan?currency=USD',
  },
  {
    name: 'Business',
    price: '$97',
    period: '/month',
    highlight: false,
    desc: 'For enterprises that demand more.',
    features: ['Everything in Growth', '25 users', 'Advanced forecasting', 'Executive dashboards', 'Audit logs', 'Custom reporting'],
    cta: 'Start Business',
    href: 'https://selar.com/97plan?currency=USD',
  },
]

const faqs = [
  { q: 'Do I need technical expertise?', a: 'No. CrestPoint is designed for business leaders. Upload a CSV and get insights immediately — no SQL, no coding.' },
  { q: 'How does the AI Business Analyst work?', a: 'Our AI uses Google Gemini configured with your actual data. Ask questions in plain English, get specific contextual answers.' },
  { q: 'Is my business data secure?', a: 'Yes. Row-level security ensures your data is completely isolated from other organizations. We never use it to train AI.' },
  { q: 'Can I invite my team?', a: 'Yes. All paid plans include team collaboration with role-based access control.' },
  { q: 'How do I import my data?', a: 'Upload CSV or Excel files from the Data Hub. No integrations or technical setup required.' },
  { q: 'Can I cancel anytime?', a: 'Yes. All plans are month-to-month with no long-term commitment. Cancel from your account settings.' },
]

/* ─── Page ─────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker-track { animation: ticker 28s linear infinite; display: flex; width: max-content; }
        .ticker-track:hover { animation-play-state: paused; }
      `}} />

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
            <a href="#features" className="hover:text-[#0F1E3C] transition-colors">Features</a>
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
      <section className="bg-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              {/* Social proof badge */}
              <div className="inline-flex items-center gap-2 bg-[#0F1E3C]/5 border border-[#0F1E3C]/10 text-[#0F1E3C] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Now serving 500+ growing businesses
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Business Intelligence</p>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-[#0F1E3C] leading-[1.05] tracking-tight mb-6">
                Run your business<br />
                <span className="text-[#D4A843]">with full clarity.</span>
              </h1>

              <p className="text-lg text-[#64748B] leading-relaxed mb-8 max-w-md">
                Connect your data, track every KPI, detect problems early, and let AI tell you exactly what to do next.
              </p>

              {/* Bullet list — remoteworkher style */}
              <ul className="space-y-3 mb-10">
                {[
                  'Real-time dashboards across all business units',
                  'AI analyst trained on your actual business data',
                  'Automated insights — no manual analysis needed',
                  'Action center to close the loop on every issue',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#0F1E3C] font-medium">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-[#D4A843]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/signup" className="flex items-center justify-center gap-2 bg-[#D4A843] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#c49a38] transition-all shadow-md text-sm">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how-it-works" className="flex items-center justify-center gap-2 border-2 border-[#0F1E3C]/20 text-[#0F1E3C] font-semibold px-7 py-3.5 rounded-xl hover:border-[#0F1E3C] transition-all text-sm">
                  See how it works
                </a>
              </div>

              {/* Trust badges — jeroid style */}
              <div className="flex flex-wrap gap-5 mt-8 pt-8 border-t border-gray-100">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                    <Icon className="h-3.5 w-3.5 text-[#D4A843]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — AI chat preview */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-[#D4A843]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-[#0F1E3C]/10 rounded-full blur-3xl" />

              <div className="relative bg-[#0F1E3C] rounded-3xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                  <div className="w-9 h-9 bg-[#D4A843] rounded-xl flex items-center justify-center shadow">
                    <Bot className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">CrestPoint AI</p>
                    <p className="text-white/40 text-xs">Powered by Gemini</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Live
                  </span>
                </div>

                {/* Chat bubble */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                  <p className="text-white/40 text-xs mb-1.5 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> You asked</p>
                  <p className="text-white text-sm font-medium">&ldquo;Why did operational costs spike this month?&rdquo;</p>
                </div>

                <div className="bg-[#D4A843]/10 border border-[#D4A843]/25 rounded-xl p-4 mb-4">
                  <p className="text-[#D4A843] text-xs mb-2 flex items-center gap-1.5 font-semibold"><Sparkles className="h-3 w-3" /> AI Analysis</p>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">
                    Costs rose <strong className="text-white">14.2%</strong> this month, driven by a <strong className="text-white">23% overtime surge</strong> in logistics during weeks 2–3.
                  </p>
                  <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
                    <p className="text-[#D4A843] text-xs font-bold mb-2">Recommended actions</p>
                    {['Review shift scheduling in logistics', 'Set overtime approval at $5K/week', 'Monitor driver capacity vs. route load'].map((a) => (
                      <p key={a} className="text-xs text-white/60 flex items-start gap-1.5">
                        <span className="text-[#D4A843] mt-0.5 flex-shrink-0">→</span> {a}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Mini KPI row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Revenue', value: '$284K', up: true },
                    { label: 'Costs', value: '$142K', up: false },
                    { label: 'Satisfaction', value: '94.2%', up: true },
                  ].map(({ label, value, up }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                      <p className="text-white/40 text-xs mb-1">{label}</p>
                      <p className="text-white font-bold text-sm">{value}</p>
                      <p className={`text-xs font-medium mt-0.5 ${up ? 'text-green-400' : 'text-amber-400'}`}>
                        {up ? '↑' : '↑'} {up ? '+12%' : '+8%'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="overflow-hidden border-y border-[#0F1E3C]/8 bg-[#0F1E3C]/[0.03] py-3">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8 whitespace-nowrap">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">{item}</span>
              <span className="text-[#D4A843] text-lg leading-none">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-extrabold text-[#0F1E3C] mb-1">{value}</p>
                <p className="text-sm text-[#64748B]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK MODULES — remoteworkher quick actions style ── */}
      <section className="py-16 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-1">Platform</p>
              <h2 className="text-2xl font-extrabold text-[#0F1E3C]">All you need in one place</h2>
            </div>
            <Link href="/auth/signup" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#D4A843] hover:text-[#c49a38] transition-colors">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {quickModules.map(({ icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center border border-gray-100 hover:border-[#D4A843]/40 hover:shadow-md transition-all group cursor-default">
                <span className="text-2xl mb-2">{icon}</span>
                <p className="text-xs font-bold text-[#0F1E3C] group-hover:text-[#D4A843] transition-colors">{label}</p>
                <p className="text-xs text-[#64748B] mt-0.5 hidden lg:block leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — jeroid style ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Features</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-4">One platform for all your intelligence needs</h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">Nine integrated modules — all built to work together so you never miss a thing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, tag, bullets }) => (
              <div key={title} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#D4A843]/40 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 bg-[#0F1E3C] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#D4A843] transition-colors duration-300">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[#0F1E3C] text-base leading-snug">{title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                    tag === 'AI' ? 'bg-amber-50 text-amber-600' :
                    tag === 'Workflow' ? 'bg-green-50 text-green-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{tag}</span>
                </div>
                <ul className="space-y-2 flex-1">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[#64748B]">
                      <Check className="h-3.5 w-3.5 text-[#D4A843] flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="mt-5 text-xs font-bold text-[#D4A843] hover:text-[#c49a38] flex items-center gap-1 transition-colors">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — jeroid 3-step style ── */}
      <section id="how-it-works" className="py-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Get started</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-4">From sign-up to first insight in minutes</h2>
            <p className="text-[#64748B] text-lg">Let go of the stress of manual analysis. We make it effortless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-6xl font-extrabold text-gray-50 select-none group-hover:text-[#D4A843]/10 transition-colors">
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

      {/* ── WHY TRUST — jeroid 01/02/03 style ── */}
      <section className="py-24 bg-[#0F1E3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Why trust us</p>
              <h2 className="text-4xl font-extrabold text-white mb-6">You&apos;re in the safest hands</h2>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                We value your data above all else and always make your security our top priority.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Shield, label: 'Bank-grade security' },
                  { icon: Clock, label: 'Real-time processing' },
                  { icon: Users, label: 'Team collaboration' },
                  { icon: Lock, label: 'ISO-aligned data practices' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold text-white/70">
                    <Icon className="h-3.5 w-3.5 text-[#D4A843]" />{label}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {whyTrust.map(({ num, title, desc }) => (
                <div key={num} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-[#D4A843]/25 transition-all group">
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

      {/* ── TESTIMONIALS — jeroid style ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-3">Testimonials</p>
            <h2 className="text-4xl font-extrabold text-[#0F1E3C] mb-2">Loved by business leaders</h2>
            <p className="text-[#64748B]">Here&apos;s what our users are saying</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map(({ platform, quote, name, role, company, month }) => (
              <div key={name} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all flex flex-col">
                {/* Platform tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-gray-50 border border-gray-200 text-[#64748B] px-3 py-1 rounded-full">{platform}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#D4A843] text-[#D4A843]" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#0F1E3C] leading-relaxed flex-1 mb-4 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-[#0F1E3C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F1E3C]">{name}</p>
                    <p className="text-xs text-[#64748B]">{role} · {company}</p>
                  </div>
                  <span className="ml-auto text-xs text-[#64748B]/60">{month}</span>
                </div>
              </div>
            ))}
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

      {/* ── FINAL CTA — jeroid "JOIN" banner style ── */}
      <section className="py-24 bg-[#0F1E3C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, #D4A843 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #D4A843 0%, transparent 55%)`
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-4">Get started today</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            JOIN 500+ BUSINESSES
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Create a free account and start running your business with the clarity and confidence that only real-time AI intelligence can give you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-[#D4A843] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#c49a38] transition-all shadow-xl flex items-center justify-center gap-2 text-base">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="w-full sm:w-auto border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition-all text-center text-base">
              Explore features
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
                AI-powered business intelligence that turns your data into clear decisions and confident action.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Product</p>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="#features" className="hover:text-white/80 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white/80 transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white/80 transition-colors">Pricing</a></li>
                <li><Link href="/pricing" className="hover:text-white/80 transition-colors">All Plans</Link></li>
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
            <p className="text-xs text-white/20">Built for business leaders who demand clarity.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
