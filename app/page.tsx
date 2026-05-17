import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { LandingPage } from '@/components/landing/landing-page'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user?.orbit_id) redirect(`/orbit/${session.user.orbit_id}`)
  if (session) redirect('/onboarding')
  return <LandingPage />
}
