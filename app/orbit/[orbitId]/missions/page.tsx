import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { MissionsPage } from '@/components/games/missions-page'

export default async function MissionsRoute({ params }: { params: { orbitId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const db = createServerClient()
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const { data: missions } = await db
    .from('missions')
    .select('*, mission_completions!left(user_id)')
    .eq('week_start', weekStartStr)
    .order('difficulty', { ascending: true })

  const enriched = (missions ?? []).map(m => ({
    ...m,
    completed: m.mission_completions?.some((c: any) => c.user_id === session.user.id) ?? false,
    mission_completions: undefined,
  }))

  return <MissionsPage missions={enriched} userId={session.user.id} orbitId={params.orbitId} />
}
