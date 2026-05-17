import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { AffinityMatchPage } from '@/components/games/affinity-match-page'

export default async function MatchRoute({ params }: { params: { orbitId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const db = createServerClient()
  const { data: me } = await db.from('users').select('affinity_answers').eq('id', session.user.id).single()
  const { data: members } = await db
    .from('users')
    .select('id, discord_id, username, avatar, affinity_answers')
    .eq('orbit_id', params.orbitId)
    .neq('id', session.user.id)

  return (
    <AffinityMatchPage
      userId={session.user.id}
      orbitId={params.orbitId}
      myAnswers={me?.affinity_answers}
      members={members ?? []}
    />
  )
}
