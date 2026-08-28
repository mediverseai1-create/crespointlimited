'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  // During build with placeholder values, return a minimal client that won't throw
  if (!url.startsWith('http')) {
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(url, key)
}
