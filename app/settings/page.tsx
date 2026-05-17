import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { SettingsPage } from '@/components/settings/settings-page'

export default async function Settings() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const db = createServerClient()
  const { data: user } = await db.from('users').select('*').eq('id', session.user.id).single()

  return <SettingsPage user={user} />
}
