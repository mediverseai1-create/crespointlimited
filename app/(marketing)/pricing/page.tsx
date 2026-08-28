import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

export const metadata = { title: 'Pricing' }

const plans = [
  {
    name: 'Free', price: '$0', period: '/month',
    desc: 'For individuals exploring business intelligence.',
    features: ['5 KPIs', '1 user', 'Basic dashboard', '30-day data history', 'Community support'],
    cta: 'Get Started Free', href: '/auth/signup', highlight: false,
  },
  {
    name: 'Starter', price: '$47', period: '/month',
    desc: 'For small teams ready to track what matters.',
    features: ['25 KPIs', '3 users', 'Advanced analytics', '1-year data history', 'AI Assistant (50 queries/mo)', 'CSV data uploads', 'Email + chat support'],
    cta: 'Start Starter', href: process.env.STARTER_PAYMENT_LINK ?? '/auth/signup', highlight: false,
  },
  {
    name: 'Professional', price: '$57', period: '/month',
    desc: 'For growing businesses that need full intelligence.',
    features: ['Unlimited KPIs', '10 users', 'All analytics modules', 'Unlimited data history', 'AI Assistant (300 queries/mo)', 'Automated insights', 'Custom reports & exports', 'Opportunity detection', 'Action Center', 'Priority support'],
    cta: 'Start Professional', href: process.env.PRO_PAYMENT_LINK ?? '/auth/signup', highlight: true,
  },
  {
    name: 'Business', price: '$97', period: '/month',
    desc: 'For enterprises requiring scale and customization.',
    features: ['Unlimited everything', 'Unlimited users', 'White-label options', 'Custom integrations', 'Dedicated Customer Success Manager', 'SLA guarantee (99.9%)', 'SSO / SAML', 'API access', 'Custom onboarding'],
    cta: 'Start Business', href: process.env.BUSINESS_PAYMENT_LINK ?? '/auth/signup', highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" showText href="/" />
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F1E3C]">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0F1E3C] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-[#64748B] max-w-xl mx-auto">
            Start free and upgrade as your business grows. No setup fees. No hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col ${plan.highlight ? 'border-[#D4A843] shadow-xl' : 'border-gray-200'}`}
            >
              {plan.highlight && (
                <div className="bg-[#D4A843] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3 self-start">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-[#0F1E3C]">{plan.name}</h3>
              <p className="text-sm text-[#64748B] mt-1 mb-4">{plan.desc}</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-[#0F1E3C]">{plan.price}</span>
                <span className="text-[#64748B] text-sm mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#64748B]">
                    <Check className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-[#D4A843] text-white hover:bg-[#b8912e]'
                    : 'border-2 border-[#0F1E3C] text-[#0F1E3C] hover:bg-[#0F1E3C] hover:text-white'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-[#64748B]">
            All plans include a 14-day free trial. No credit card required to start.{' '}
            <Link href="/auth/signup" className="text-[#D4A843] font-medium hover:underline">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
