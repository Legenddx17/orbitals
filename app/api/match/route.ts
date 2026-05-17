import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { answers } = await req.json()
  const db = createServerClient()
  await db.from('users').update({ affinity_answers: answers }).eq('id', session.user.id)
  return NextResponse.json({ ok: true })
}
