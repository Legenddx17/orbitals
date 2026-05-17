import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { GamesMenu } from '@/components/games/games-menu'

export default async function GamesPage({ params }: { params: { orbitId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')
  return <GamesMenu orbitId={params.orbitId} />
}
