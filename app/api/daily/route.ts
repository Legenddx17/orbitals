import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { awardPoints, POINTS } from '@/lib/points'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { ritual_id, answer } = await req.json()
  const db = createServerClient()

  const { data: existing } = await db
    .from('daily_answers')
    .select('id')
    .eq('ritual_id', ritual_id)
    .eq('user_id', session.user.id)
    .single()

  if (existing) return NextResponse.json({ error: 'Already answered' }, { status: 409 })

  await db.from('daily_answers').insert({ ritual_id, user_id: session.user.id, answer })
  await awardPoints(session.user.id, POINTS.DAILY_RITUAL, 'Ritual diario completado')

  // Update streak
  await db.rpc('update_user_streak', { user_id: session.user.id })

  return NextResponse.json({ ok: true })
}
