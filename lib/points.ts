import { createServerClient } from './supabase'

export const POINTS = {
  MISSION_EASY:    10,
  MISSION_HARD:    30,
  MISSION_FIRST:   15, // bonus for first to complete a limited mission
  WEEKLY_WIN:      50,
  WEEKLY_TOP3:     25,
  DAILY_RITUAL:     5,
} as const

export async function awardPoints(userId: string, amount: number, reason: string) {
  const db = createServerClient()

  // Insert points event
  await db.from('points_events').insert({ user_id: userId, amount, reason })

  // Increment user total
  await db.rpc('increment_user_points', { user_id: userId, amount })

  // Check & award badges
  await checkBadges(userId, db)
}

async function checkBadges(userId: string, db: ReturnType<typeof createServerClient>) {
  const { data: user } = await db.from('users').select('points, streak').eq('id', userId).single()
  if (!user) return

  const badgesToCheck = [
    { slug: 'en-racha',    condition: user.streak >= 7 },
    { slug: 'explorador',  condition: false }, // handled separately
  ]

  for (const b of badgesToCheck) {
    if (!b.condition) continue
    await db.from('user_badges').upsert({ user_id: userId, badge_slug: b.slug }, { onConflict: 'user_id,badge_slug', ignoreDuplicates: true })
  }
}
