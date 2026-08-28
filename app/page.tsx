import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart3, Target, Bot, Lightbulb, TrendingUp, Sparkles,
  Cog, CheckSquare, AlertTriangle, ArrowRight, Check, ChevronDown
} from 'lucide-react'

const demoKPIs = [
  { name: 'Monthly Revenue', value: '$284K', change: '+12.4%', status: 'on_track' },
  { name: 'Customer Satisfaction', value: '94.2%', change: '+2.1%', status: 'on_track' },
  { name: 'Operational Cost', value: '$142K', change: '+8.3%', status: 'at_risk' },
  { name: 'Team Productivity', value: '87%', change: '-3.2%', status: 'at_risk' },
]

const features = [
  { icon: BarChart3, title: 'Business Intelligence', desc: 'Real-time dashboards and reports with complete visibility into every business unit.' },
  { icon: Target, title: 'KPI Management', desc: 'Define, track, and analyze key performance indicators across all departments.' },
  { icon: Bot, title: 'AI Business Analyst', desc: 'Ask questions in plain English and get instant analysis powered by Gemini AI.' },
  { icon: Lightbulb, title: 'Automated Insights', desc: 'Proactively surface patterns, anomalies, and opportunities before they escalate.' },
  { icon: AlertTriangle, title: 'Root-Cause Analysis', desc: 'Understand why metrics are moving — not just that they moved.' },
  { icon: TrendingUp, title: 'Forecasting', desc: 'AI-powered predictions and scenario planning to prepare for what comes next.' },
  { icon: Sparkles, title: 'Opportunity Detection', desc: 'Automatically identify revenue opportunities, cost savings, and efficiency gains.' },
  { icon: CheckSquare, title: 'Action Center', desc: 'Turn insights into accountable tasks. Assign, track, and close the loop.' },
  { icon: Cog, title: 'Operations Intelligence', desc: 'Deep operational analytics covering supply chain, workforce, and process efficiency.' },
]

const plans = [
  { name: 'Free', price: '$0', period: '/month', highlight: false, features: ['5 KPIs', '1 user', 'Basic dashboard', '30-day data history', 'Email support'], cta: 'Get Started Free', href: '/auth/signup' },
  { name: 'Starter', price: '$47', period: '/month', highlight: false, features: ['25 KPIs', '3 users', 'Advanced analytics', '1-year history', 'AI Assistant (50 queries/mo)', 'Email + chat support'], cta: 'Start Starter', href: '/auth/signup' },
  { name: 'Professional', price: '$57', period: '/month', highlight: true, features: ['Unlimited KPIs', '10 users', 'All analytics', 'Unlimited history', 'AI Assistant (300 queries/mo)', 'Automated insights', 'Priority support'], cta: 'Start Professional', href: '/auth/signup' },
  { name: 'Business', price: '$97', period: '/month', highlight: false, features: ['Unlimited everything', 'Unlimited users', 'Dedicated CSM', 'SLA guarantee', 'SSO/SAML', 'API access'], cta: 'Start Business', href: '/auth/signup' },
]

const faqs = [
  { q: 'Do I need technical expertise?', a: 'No. CrestPoint is designed for business leaders. Upload data via CSV and get insights immediately.' },
  { q: 'How does the AI Assistant work?', a: 'Our AI uses Google Gemini configured with your organization\'s actual data. Ask in plain English, get specific answers.' },
  { q: 'Is my business data secure?', a: 'Yes. We use row-level security — your data is completely isolated from other organizations. We never use it to train AI.' },
  { q: 'Can I invite my team?', a: 'Yes. All paid plans include team collaboration with role-based access control.' },
  { q: 'How do I get data into CrestPoint?', a: 'Upload CSV or Excel files directly from the Data Hub in your dashboard.' },
  { q: 'Can I cancel at any time?', a: 'Yes. All plans are month-to-month with no long-term commitment.' },
]

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="CrestPoint Logo" width={36} height={36} priority />
            <span className="font-bold text-lg text-[#0F1E3C]">Crest<span className="text-[#D4A843]">Point</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
            <a href="#features" className="hover:text-[#0F1E3C] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#0F1E3C] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#0F1E3C] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm font-medium text-[#64748B] hover:text-[#0F1E3C] transition-colors hidden sm:block">Sign In</Link>
            <Link href="/auth/signup" className="bg-[#D4A843] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#b8912e] transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#D4A843]/10 text-[#D4A843] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />AI-Powered Business Intelligence
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#0F1E3C] leading-tight mb-6">
            Business Intelligence<br /><span className="text-[#D4A843]">That Leads to Action</span>
          </h1>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto mb-8">
            CrestPoint connects your business data, measures performance, detects problems early, and recommends actions — all powered by AI that understands your specific situation.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup" className="bg-[#D4A843] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#b8912e] transition-colors flex items-center gap-2">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="border-2 border-[#0F1E3C] text-[#0F1E3C] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#0F1E3C] hover:text-white transition-colors">
              See How It Works
            </a>
          </div>
        </div>

        {/* Product Preview */}
        <div className="bg-[#0F1E3C] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold text-sm">KPI Dashboard</p>
            <span className="bg-[#D4A843]/20 text-[#D4A843] text-xs px-2.5 py-1 rounded-full font-medium">DEMO DATA</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {demoKPIs.map((kpi) => (
              <div key={kpi.name} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs mb-1 truncate">{kpi.name}</p>
                <p className="text-white font-bold text-xl mb-1">{kpi.value}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${kpi.status === 'on_track' ? 'text-green-400' : 'text-amber-400'}`}>{kpi.change}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${kpi.status === 'on_track' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {kpi.status === 'on_track' ? 'On Track' : 'At Risk'}
                  </span>
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full">
                  <div className={`h-full rounded-full ${kpi.status === 'on_track' ? 'bg-green-400' : 'bg-amber-400'}`} style={{ width: kpi.status === 'on_track' ? '78%' : '52%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white/5 rounded-xl p-3 border border-white/10">
            <Bot className="h-4 w-4 text-[#D4A843] flex-shrink-0" />
            <p className="text-white/70 text-sm"><span className="text-[#D4A843] font-medium">AI Insight:</span> Operational costs trending 9.2% above target. Primary driver: overtime in logistics. Recommend reviewing shift scheduling.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#F8F6F1] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1E3C] mb-4">How CrestPoint Works</h2>
            <p className="text-[#64748B] max-w-xl mx-auto">A complete intelligence loop from data to action</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-4">
            {['Connect Data', 'Measure KPIs', 'Analyze Trends', 'Detect Issues', 'Understand Why', 'Forecast', 'Recommend', 'Assign Actions', 'Measure Results'].map((step, i) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${i % 2 === 0 ? 'bg-[#0F1E3C] text-white' : 'bg-[#D4A843] text-white'}`}>{i + 1}</div>
                <p className="text-xs font-medium text-[#0F1E3C]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1E3C] mb-4">Everything Your Business Needs</h2>
            <p className="text-[#64748B] max-w-xl mx-auto">Nine integrated modules working together for complete business intelligence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-2xl p-6 hover:border-[#D4A843] hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-[#0F1E3C] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4A843] transition-colors">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0F1E3C] mb-2">{title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-[#0F1E3C] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Business Leaders</h2>
            <p className="text-white/60 max-w-xl mx-auto">Purpose-built for people who make decisions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { role: 'CEO', desc: 'Executive overview with the metrics that matter most for strategic decisions.' },
              { role: 'COO', desc: 'Operational health at a glance — efficiency, capacity, and execution metrics.' },
              { role: 'Operations Manager', desc: 'Day-to-day operational KPIs and team performance in one view.' },
              { role: 'Business Owner', desc: 'Everything from revenue to expenses to workforce in a single dashboard.' },
              { role: 'Finance Team', desc: 'Financial performance, forecasting, and variance analysis built in.' },
              { role: 'Department Head', desc: 'Department-specific KPIs and AI-generated recommendations.' },
            ].map(({ role, desc }) => (
              <div key={role} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <h3 className="font-semibold text-[#D4A843] mb-2">{role}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#F8F6F1] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1E3C] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-[#64748B]">Start free. Scale as you grow. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border-2 bg-white ${plan.highlight ? 'border-[#D4A843] shadow-xl' : 'border-gray-200'}`}>
                {plan.highlight && <div className="bg-[#D4A843] text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-3">Most Popular</div>}
                <h3 className="font-bold text-[#0F1E3C] text-lg">{plan.name}</h3>
                <div className="flex items-end gap-1 my-3">
                  <span className="text-3xl font-bold text-[#0F1E3C]">{plan.price}</span>
                  <span className="text-[#64748B] text-sm mb-1">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#64748B]">
                      <Check className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block w-full text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${plan.highlight ? 'bg-[#D4A843] text-white hover:bg-[#b8912e]' : 'border-2 border-[#0F1E3C] text-[#0F1E3C] hover:bg-[#0F1E3C] hover:text-white'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1E3C] mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-[#0F1E3C]">{q}</span>
                  <ChevronDown className="h-4 w-4 text-[#64748B] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-[#64748B] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F1E3C] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform how you run your business?</h2>
          <p className="text-white/60 mb-8">Join forward-thinking businesses using CrestPoint to make faster, smarter decisions.</p>
          <Link href="/auth/signup" className="bg-[#D4A843] text-white font-semibold px-10 py-4 rounded-xl hover:bg-[#b8912e] transition-colors inline-flex items-center gap-2">
            Start Free Today <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="CrestPoint Logo" width={28} height={28} />
            <span className="font-bold text-[#0F1E3C]">Crest<span className="text-[#D4A843]">Point</span> <span className="text-xs text-[#64748B] font-normal">Limited</span></span>
          </div>
          <p className="text-xs text-[#64748B]">&copy; {new Date().getFullYear()} CrestPoint Limited. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-[#64748B]">
            <a href="#" className="hover:text-[#0F1E3C]">Privacy</a>
            <a href="#" className="hover:text-[#0F1E3C]">Terms</a>
            <Link href="/pricing" className="hover:text-[#0F1E3C]">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
