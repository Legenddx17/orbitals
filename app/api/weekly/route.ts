import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { challenge_id, content } = await req.json()
  const db = createServerClient()
  const { data, error } = await db
    .from('weekly_entries')
    .insert({ challenge_id, user_id: session.user.id, content })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { entry_id } = await req.json()
  const db = createServerClient()

  const { data: existing } = await db
    .from('weekly_votes')
    .select('id')
    .eq('entry_id', entry_id)
    .eq('voter_id', session.user.id)
    .single()

  if (existing) {
    await db.from('weekly_votes').delete().eq('id', existing.id)
    await db.from('weekly_entries').update({ votes: db.rpc('decrement', {}) }).eq('id', entry_id)
    return NextResponse.json({ voted: false })
  }

  await db.from('weekly_votes').insert({ entry_id, voter_id: session.user.id })
  await db.rpc('increment_entry_votes', { entry_id })
  return NextResponse.json({ voted: true })
}
