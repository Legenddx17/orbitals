import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { OnboardingClient } from '@/components/onboarding/onboarding-client'

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')
  if (session.user?.orbit_id) redirect(`/orbit/${session.user.orbit_id}`)
  return <OnboardingClient guilds={session.user?.guilds ?? []} />
}
