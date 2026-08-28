import { Logo } from '@/components/layout/Logo'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <Logo size="md" showText href="/" />
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">{children}</main>
    </div>
  )
}
