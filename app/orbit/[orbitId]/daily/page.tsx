import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { DailyRitualPage } from '@/components/games/daily-ritual-page'

export default async function DailyRoute({ params }: { params: { orbitId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const db = createServerClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: ritual } = await db
    .from('daily_rituals')
    .select('*, daily_answers(*, users(id, discord_id, username, avatar))')
    .eq('orbit_id', params.orbitId)
    .eq('date', today)
    .single()

  const answered = ritual?.daily_answers?.some((a: any) => a.user_id === session.user.id) ?? false
  const isRevealed = ritual ? new Date() >= new Date(ritual.reveal_at) : false

  return (
    <DailyRitualPage
      ritual={ritual}
      userId={session.user.id}
      orbitId={params.orbitId}
      answered={answered}
      isRevealed={isRevealed}
    />
  )
}
