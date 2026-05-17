'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { formatPoints, getOrdinalSuffix } from '@/lib/utils'
import { Flame, Zap, Target, Calendar, Heart, Trophy } from 'lucide-react'

const GAME_MODES = [
  { href: 'missions', icon: Target,   label: 'Misiones',        desc: 'Retos semanales individuales',   color: '#7C3AED' },
  { href: 'weekly',  icon: Trophy,    label: 'Reto Semanal',    desc: 'Compite y vota con tu orbit',    color: '#F59E0B' },
  { href: 'daily',   icon: Calendar,  label: 'Ritual Diario',   desc: 'La pregunta de hoy a las 9pm',   color: '#06B6D4' },
  { href: 'match',   icon: Heart,     label: 'Match de Afinidad','desc': 'Descubre tu top 3 afín',       color: '#EC4899' },
]

interface OrbitHomeProps {
  orbit: any
  leaderboard: any[]
  currentUserId: string
}

export function OrbitHome({ orbit, leaderboard: initial, currentUserId }: OrbitHomeProps) {
  const [leaderboard, setLeaderboard] = useState(initial)

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`orbit-${orbit.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, () => {
        // Refetch leaderboard on any user update
        supabase
          .from('users')
          .select('id, discord_id, username, avatar, points, streak')
          .eq('orbit_id', orbit.id)
          .order('points', { ascending: false })
          .limit(20)
          .then(({ data }) => { if (data) setLeaderboard(data) })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [orbit.id])

  const myPos = leaderboard.findIndex(u => u.id === currentUserId) + 1
  const me = leaderboard.find(u => u.id === currentUserId)

  return (
    <div className="min-h-screen">
      <Navbar orbitId={orbit.id} points={me?.points} />

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Leaderboard */}
        <div className="lg:col-span-1">
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Leaderboard
              </h2>
              <p className="text-xs text-white/40 mt-0.5">{orbit.name}</p>
            </div>
            <div className="divide-y divide-white/5">
              {leaderboard.slice(0, 10).map((user, i) => {
                const pos = i + 1
                const isMe = user.id === currentUserId
                return (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors ${isMe ? 'bg-brand/5' : ''}`}
                  >
                    <span className={`w-6 text-center text-sm font-bold ${pos === 1 ? 'text-yellow-400' : pos === 2 ? 'text-slate-300' : pos === 3 ? 'text-amber-600' : 'text-white/30'}`}>
                      {pos}
                    </span>
                    <Avatar discordId={user.discord_id} avatar={user.avatar} username={user.username} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isMe ? 'text-brand-300' : 'text-white'}`}>{user.username}</p>
                      {user.streak > 0 && (
                        <p className="text-xs text-white/30 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-400" />{user.streak}d
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white/70">{formatPoints(user.points)}</span>
                  </Link>
                )
              })}
            </div>
            {myPos > 10 && (
              <div className="p-4 border-t border-white/5 bg-brand/5 flex items-center gap-3">
                <span className="text-xs text-brand-300 font-semibold">Tu posición: #{myPos}</span>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Game modes */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="font-bold text-white text-xl mb-1">Hola, {me?.username ?? 'Orbiter'} 👋</h2>
            <p className="text-white/40 text-sm">¿Qué quieres jugar hoy?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAME_MODES.map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={`/orbit/${orbit.id}/${href}`}>
                <div className="glass rounded-2xl p-5 hover:border-white/15 transition-all group cursor-pointer h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                    style={{ background: `${color}22`, border: `1px solid ${color}44` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{label}</h3>
                  <p className="text-sm text-white/40">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick stats */}
          {me && (
            <Card className="flex items-center justify-around py-4">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{formatPoints(me.points)}</p>
                <p className="text-xs text-white/40 flex items-center gap-1 justify-center"><Zap className="w-3 h-3" />Puntos</p>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">{myPos > 0 ? getOrdinalSuffix(myPos) : '—'}</p>
                <p className="text-xs text-white/40 flex items-center gap-1 justify-center"><Trophy className="w-3 h-3" />Posición</p>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">{me.streak ?? 0}</p>
                <p className="text-xs text-white/40 flex items-center gap-1 justify-center"><Flame className="w-3 h-3 text-orange-400" />Racha</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
