import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CrestPoint Limited — Business Intelligence Platform',
    template: '%s | CrestPoint Limited',
  },
  description: 'Enterprise B2B SaaS platform for business intelligence, KPI management, and AI-powered insights.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://crestpointlimited.click'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
