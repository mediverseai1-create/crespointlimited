export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1E3C] via-[#1a3260] to-[#0F1E3C] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
