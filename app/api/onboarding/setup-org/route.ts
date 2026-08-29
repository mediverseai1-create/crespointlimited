import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  industry: z.string().min(1),
  country: z.string().min(1),
  size: z.string().min(1),
  slug: z.string().min(2),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    // Verify the user is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role to bypass RLS for initial org setup
    const admin = createServiceClient()

    // Create organization
    const { data: org, error: orgError } = await admin.from('organizations').insert({
      name: data.name,
      slug: data.slug,
      industry: data.industry,
      country: data.country,
      size: data.size,
    }).select().single()

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 400 })
    }

    // Update profile
    await admin.from('profiles').update({ organization_id: org.id }).eq('id', user.id)

    // Add user as org owner
    await admin.from('organization_members').insert({
      organization_id: org.id,
      user_id: user.id,
      role: 'owner',
    })

    return NextResponse.json({ org })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
