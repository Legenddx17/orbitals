'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Trophy } from 'lucide-react'
import { toast } from 'sonner'

interface WeeklyChallengePageProps {
  challenge: any
  userId: string
  orbitId: string
}

export function WeeklyChallengePage({ challenge, userId, orbitId }: WeeklyChallengePageProps) {
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState<any[]>(challenge?.weekly_entries ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [voting, setVoting] = useState<string | null>(null)

  const myEntry = entries.find(e => e.user_id === userId)

  async function submit() {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challenge.id, content }),
      })
      const { entry, error } = await res.json()
      if (error) throw new Error(error)
      setEntries(prev => [...prev, { ...entry, users: { id: userId }, weekly_votes: [] }])
      setContent('')
      toast.success('¡Entrada enviada!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function vote(entryId: string) {
    if (voting) return
    setVoting(entryId)
    try {
      const res = await fetch('/api/weekly', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_id: entryId }),
      })
      const { voted } = await res.json()
      setEntries(prev => prev.map(e => {
        if (e.id !== entryId) return e
        const already = e.weekly_votes?.some((v: any) => v.voter_id === userId)
        return {
          ...e,
          votes: e.votes + (voted ? 1 : -1),
          weekly_votes: voted
            ? [...(e.weekly_votes ?? []), { voter_id: userId }]
            : (e.weekly_votes ?? []).filter((v: any) => v.voter_id !== userId),
        }
      }))
    } finally {
      setVoting(null)
    }
  }

  const sorted = [...entries].sort((a, b) => b.votes - a.votes)

  if (!challenge) {
    return (
      <div className="min-h-screen">
        <Navbar orbitId={orbitId} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-white/40">
          No hay reto semanal activo.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar orbitId={orbitId} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm mb-3">
            <Trophy className="w-4 h-4" />Reto Semanal
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{challenge.title}</h1>
          <p className="text-white/50">{challenge.description}</p>
        </div>

        {!myEntry && (
          <div className="glass rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-white mb-3">Tu entrada</h3>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 resize-none"
            />
            <Button className="mt-3 w-full" onClick={submit} disabled={submitting || !content.trim()}>
              {submitting ? 'Enviando...' : 'Enviar entrada'}
            </Button>
          </div>
        )}

        {sorted.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-white/60 text-sm uppercase tracking-wide">
              {sorted.length} {sorted.length === 1 ? 'entrada' : 'entradas'}
            </h3>
            {sorted.map((entry, i) => {
              const voted = entry.weekly_votes?.some((v: any) => v.voter_id === userId)
              const isMe = entry.user_id === userId
              return (
                <div key={entry.id} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {i === 0 && <span className="text-yellow-400 text-lg">👑</span>}
                    {entry.users && (
                      <Avatar discordId={entry.users.discord_id} avatar={entry.users.avatar} username={entry.users.username} size={32} />
                    )}
                    <span className="font-medium text-white text-sm">{entry.users?.username ?? 'Anónimo'}</span>
                    {isMe && <span className="text-xs text-brand-400 ml-auto">Tu entrada</span>}
                  </div>
                  <p className="text-white/70 text-sm mb-4">{entry.content}</p>
                  <button
                    onClick={() => !isMe && vote(entry.id)}
                    disabled={isMe || voting === entry.id}
                    className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all ${
                      voted ? 'bg-brand/20 text-brand-300' : 'text-white/40 hover:text-white hover:bg-white/5'
                    } ${isMe ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {entry.votes}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
