'use client'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DailyRitualPageProps {
  ritual: any
  userId: string
  orbitId: string
  answered: boolean
  isRevealed: boolean
}

export function DailyRitualPage({ ritual, userId, orbitId, answered: initAnswered, isRevealed: initRevealed }: DailyRitualPageProps) {
  const [answer, setAnswer] = useState('')
  const [answered, setAnswered] = useState(initAnswered)
  const [revealed, setRevealed] = useState(initRevealed)
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!ritual?.reveal_at) return
    const update = () => {
      const diff = new Date(ritual.reveal_at).getTime() - Date.now()
      if (diff <= 0) { setRevealed(true); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${h}h ${m}m ${s}s`)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [ritual?.reveal_at])

  async function submit() {
    if (!answer.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ritual_id: ritual.id, answer }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnswered(true)
      toast.success('+5 puntos por participar')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!ritual) {
    return (
      <div className="min-h-screen">
        <Navbar orbitId={orbitId} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-white/40">
          No hay ritual para hoy. Vuelve más tarde.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar orbitId={orbitId} />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-6">
          <Calendar className="w-4 h-4" />
          Ritual del {format(new Date(), "d 'de' MMMM", { locale: es })}
        </div>

        <h1 className="text-3xl font-black text-white mb-8">{ritual.question}</h1>

        {!answered ? (
          <div className="glass rounded-2xl p-5">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Tu respuesta (solo tú la verás hasta las 9pm)..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 resize-none"
            />
            <Button className="mt-3 w-full" onClick={submit} disabled={submitting || !answer.trim()}>
              {submitting ? 'Enviando...' : 'Responder'}
            </Button>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 text-center">
            {revealed ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-white/60 text-sm uppercase tracking-wide">
                  {ritual.daily_answers?.length ?? 0} respuestas reveladas
                </h3>
                {(ritual.daily_answers ?? []).map((ans: any) => (
                  <div key={ans.id} className="flex items-start gap-3 text-left">
                    <Avatar discordId={ans.users?.discord_id} avatar={ans.users?.avatar} username={ans.users?.username} size={32} />
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">{ans.users?.username}</p>
                      <p className="text-white/80 text-sm">{ans.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Lock className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm">Tu respuesta está guardada.</p>
                <p className="text-white font-semibold mt-1">Se revela en {countdown}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
