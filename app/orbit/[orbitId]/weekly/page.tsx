import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { WeeklyChallengePage } from '@/components/games/weekly-challenge-page'

export default async function WeeklyRoute({ params }: { params: { orbitId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const db = createServerClient()
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1)

  const { data: challenge } = await db
    .from('weekly_challenges')
    .select('*, weekly_entries(*, users(id, discord_id, username, avatar), weekly_votes(voter_id))')
    .eq('orbit_id', params.orbitId)
    .gte('week_end', today.toISOString())
    .single()

  return (
    <WeeklyChallengePage
      challenge={challenge}
      userId={session.user.id}
      orbitId={params.orbitId}
    />
  )
}
