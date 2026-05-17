'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Zap, Trophy, Flame } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Fácil',   color: '#22C55E', pts: 10 },
  medium: { label: 'Medio',   color: '#F59E0B', pts: 20 },
  hard:   { label: 'Difícil', color: '#EF4444', pts: 30 },
}

interface MissionsPageProps {
  missions: any[]
  userId: string
  orbitId: string
}

export function MissionsPage({ missions: initial, userId, orbitId }: MissionsPageProps) {
  const [missions, setMissions] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [answer, setAnswer] = useState<Record<string, string>>({})

  async function complete(missionId: string) {
    setLoading(missionId)
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission_id: missionId, answer: answer[missionId] ?? '' }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      toast.success(`+${data.points} puntos${data.bonus ? ` (+${data.bonus} bonus)` : ''}`)
      setMissions(ms => ms.map(m => m.id === missionId ? { ...m, completed: true } : m))
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(null)
    }
  }

  const completed = missions.filter(m => m.completed).length

  return (
    <div className="min-h-screen">
      <Navbar orbitId={orbitId} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-2">
          <h1 className="text-3xl font-black text-white">Misiones</h1>
          <p className="text-white/40 mt-1">{completed}/{missions.length} completadas esta semana</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: missions.length ? `${(completed / missions.length) * 100}%` : '0%' }}
          />
        </div>

        <div className="space-y-4">
          {missions.map(mission => {
            const cfg = DIFFICULTY_CONFIG[mission.difficulty as keyof typeof DIFFICULTY_CONFIG]
            const isLoading = loading === mission.id
            const isExpired = mission.expires_at && new Date(mission.expires_at) < new Date()

            return (
              <div
                key={mission.id}
                className={cn(
                  'glass rounded-2xl p-5 transition-all',
                  mission.completed ? 'opacity-60' : '',
                  isExpired && !mission.completed ? 'opacity-40' : ''
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cfg.color}22`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      {mission.is_limited && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 flex items-center gap-1">
                          <Flame className="w-3 h-3" />Limitada
                        </span>
                      )}
                      {mission.completed && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-white">{mission.title}</h3>
                    <p className="text-sm text-white/50 mt-0.5">{mission.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-brand-300 font-bold">
                      <Zap className="w-3 h-3" />{mission.points}
                    </div>
                    {mission.is_limited && <p className="text-xs text-pink-400">+15 si eres el 1ro</p>}
                  </div>
                </div>

                {!mission.completed && !isExpired && (
                  <div className="flex gap-3 mt-3">
                    <input
                      type="text"
                      value={answer[mission.id] ?? ''}
                      onChange={e => setAnswer(a => ({ ...a, [mission.id]: e.target.value }))}
                      placeholder="Tu respuesta..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50"
                    />
                    <Button
                      size="sm"
                      onClick={() => complete(mission.id)}
                      disabled={isLoading || !answer[mission.id]?.trim()}
                    >
                      {isLoading ? '...' : 'Completar'}
                    </Button>
                  </div>
                )}

                {isExpired && !mission.completed && (
                  <p className="text-xs text-white/30 flex items-center gap-1 mt-2"><Clock className="w-3 h-3" />Expirada</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
