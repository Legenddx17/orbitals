import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { OrbitHome } from '@/components/orbit/orbit-home'

export default async function OrbitPage({ params }: { params: { orbitId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const db = createServerClient()
  const { data: orbit } = await db.from('orbits').select('*').eq('id', params.orbitId).single()
  if (!orbit) redirect('/onboarding')

  const { data: leaderboard } = await db
    .from('users')
    .select('id, discord_id, username, avatar, points, streak, user_badges(badge_slug, badges(*))')
    .eq('orbit_id', params.orbitId)
    .order('points', { ascending: false })
    .limit(20)

  return <OrbitHome orbit={orbit} leaderboard={leaderboard ?? []} currentUserId={session.user.id} />
}
