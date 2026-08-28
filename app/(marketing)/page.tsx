/**
 * NOTE: This file is intentionally minimal.
 * The root landing page lives at app/page.tsx.
 * Delete this file before building — having both app/page.tsx and
 * app/(marketing)/page.tsx resolving to "/" causes a Next.js build error.
 *
 * The (marketing) layout group is used for /pricing and other marketing pages.
 */
import { redirect } from 'next/navigation'

export default function MarketingRootPage() {
  redirect('/')
}
