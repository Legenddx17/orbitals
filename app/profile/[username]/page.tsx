import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { PublicProfile } from '@/components/profile/public-profile'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions)
  const db = createServerClient()

  const { data: user } = await db
    .from('users')
    .select(`
      *,
      orbits(id, name, icon, discord_server_id),
      user_badges(earned_at, badges(*)),
      mission_completions(id)
    `)
    .eq('username', params.username)
    .single()

  if (!user) notFound()

  const leaderboardPos = await db
    .from('users')
    .select('id')
    .eq('orbit_id', user.orbit_id)
    .order('points', { ascending: false })
    .then(({ data }) => (data?.findIndex(u => u.id === user.id) ?? -1) + 1)

  return (
    <PublicProfile
      user={user}
      leaderboardPosition={leaderboardPos}
      isOwn={session?.user?.id === user.id}
    />
  )
}
