import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { guild_id, guild_name, guild_icon } = await req.json()
  const db = createServerClient()

  // Upsert the orbit
  const { data: orbit, error } = await db
    .from('orbits')
    .upsert({ discord_server_id: guild_id, name: guild_name, icon: guild_icon }, { onConflict: 'discord_server_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Link user to orbit
  await db.from('users').update({ orbit_id: orbit.id }).eq('discord_id', session.user.discord_id)

  // Create default missions for this week if none exist
  await seedWeeklyContent(orbit.id, db)

  return NextResponse.json({ orbit })
}

async function seedWeeklyContent(orbitId: string, db: any) {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const { count } = await db.from('missions').select('id', { count: 'exact', head: true }).eq('week_start', weekStartStr)
  if (count && count > 0) return

  const missions = [
    { title: '¿Cuál es la capital de Japón?', description: 'Responde correctamente para ganar puntos.', difficulty: 'easy', points: 10, type: 'trivia', is_limited: false, week_start: weekStartStr },
    { title: 'Describe tu serie favorita en una palabra', description: 'Comparte tu elección creativa.', difficulty: 'easy', points: 10, type: 'creative', is_limited: false, week_start: weekStartStr },
    { title: 'Responde en menos de 30 segundos', description: '¿Cuántos países hay en América del Sur?', difficulty: 'medium', points: 20, type: 'speed', is_limited: true, expires_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), week_start: weekStartStr },
    { title: 'Comparte una foto de tu escritorio', description: 'Muéstranos dónde trabajas o juegas.', difficulty: 'hard', points: 30, type: 'photo', is_limited: false, week_start: weekStartStr },
    { title: 'Nombra 5 Pokémon de la primera generación', description: 'Sin repetir y sin buscar.', difficulty: 'medium', points: 20, type: 'trivia', is_limited: false, week_start: weekStartStr },
  ]

  await db.from('missions').insert(missions)

  // Weekly challenge
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  await db.from('weekly_challenges').upsert({
    orbit_id: orbitId,
    title: 'El reto de esta semana',
    description: 'Comparte la foto más épica que hayas tomado este mes. Los demás miembros votarán por su favorita.',
    week_start: weekStartStr,
    week_end: weekEnd.toISOString().split('T')[0],
  }, { onConflict: 'orbit_id,week_start' })

  // Daily ritual
  const revealAt = new Date(today)
  revealAt.setHours(21, 0, 0, 0)
  await db.from('daily_rituals').upsert({
    orbit_id: orbitId,
    question: '¿Qué canción suena en tu cabeza en este momento?',
    date: today.toISOString().split('T')[0],
    reveal_at: revealAt.toISOString(),
  }, { onConflict: 'orbit_id,date' })
}
