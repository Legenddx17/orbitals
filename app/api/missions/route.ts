import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { awardPoints, POINTS } from '@/lib/points'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { mission_id } = await req.json()
  const db = createServerClient()

  const { data: mission } = await db.from('missions').select('*').eq('id', mission_id).single()
  if (!mission) return NextResponse.json({ error: 'Mission not found' }, { status: 404 })

  // Check if already completed
  const { data: existing } = await db
    .from('mission_completions')
    .select('id')
    .eq('mission_id', mission_id)
    .eq('user_id', session.user.id)
    .single()

  if (existing) return NextResponse.json({ error: 'Already completed' }, { status: 409 })

  // Check if first to complete limited mission
  let bonus = 0
  if (mission.is_limited) {
    const { count } = await db
      .from('mission_completions')
      .select('id', { count: 'exact', head: true })
      .eq('mission_id', mission_id)
    if (count === 0) bonus = POINTS.MISSION_FIRST
  }

  await db.from('mission_completions').insert({ mission_id, user_id: session.user.id })
  
  const pts = mission.points + bonus
  await awardPoints(session.user.id, pts, `Misión completada: ${mission.title}`)

  // Check primera-orbita badge
  const { count: missionCount } = await db
    .from('mission_completions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
  if (missionCount === 1) {
    await db.from('user_badges').upsert({ user_id: session.user.id, badge_slug: 'primera-orbita' }, { ignoreDuplicates: true })
  }

  return NextResponse.json({ points: pts, bonus })
}
