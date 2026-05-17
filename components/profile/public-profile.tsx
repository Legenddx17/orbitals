'use client'
import { Navbar } from '@/components/layout/navbar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatPoints, getOrdinalSuffix } from '@/lib/utils'
import { Share2, Flame, Zap, Trophy, Target } from 'lucide-react'
import { toast } from 'sonner'

interface PublicProfileProps {
  user: any
  leaderboardPosition: number
  isOwn: boolean
}

export function PublicProfile({ user, leaderboardPosition, isOwn }: PublicProfileProps) {
  const badges = user.user_badges ?? []
  const missionCount = user.mission_completions?.length ?? 0

  function share() {
    const url = `${window.location.origin}/profile/${user.username}`
    navigator.clipboard.writeText(url)
    toast.success('Link copiado')
  }

  return (
    <div className="min-h-screen">
      <Navbar orbitId={user.orbit_id} />

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="glass rounded-2xl p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <Avatar
              discordId={user.discord_id}
              avatar={user.avatar}
              username={user.username}
              size={80}
              className="mx-auto mb-4 ring-4 ring-brand/30"
            />
            <h1 className="text-2xl font-black text-white">{user.username}</h1>
            {user.orbits && (
              <p className="text-white/40 text-sm mt-1">{user.orbits.name}</p>
            )}

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={share}
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartir perfil
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Zap,    label: 'Puntos',   value: formatPoints(user.points), color: '#7C3AED' },
            { icon: Trophy, label: 'Posición', value: leaderboardPosition > 0 ? getOrdinalSuffix(leaderboardPosition) : '—', color: '#F59E0B' },
            { icon: Flame,  label: 'Racha',    value: `${user.streak}d`, color: '#EF4444' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>

        {/* Missions */}
        <div className="glass rounded-2xl p-5 mb-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white">{missionCount} misiones completadas</p>
            <p className="text-sm text-white/40">a lo largo de todas las semanas</p>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Badges</h3>
            <div className="flex flex-wrap gap-3">
              {badges.map(({ badge, earned_at }: any) => (
                <div
                  key={badge.slug}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10"
                  title={badge.description}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs text-white/60 font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
