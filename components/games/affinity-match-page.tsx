'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'

const QUESTIONS = [
  { id: 'q1', question: '¿Eres más de día o de noche?', options: ['Día 🌞', 'Noche 🌙'] },
  { id: 'q2', question: '¿Prefieres juegos en solitario o multijugador?', options: ['Solo 🎮', 'Multi 👥'] },
  { id: 'q3', question: '¿Qué tipo de música más escuchas?', options: ['Electrónica 🎧', 'Rock 🎸', 'Lo-fi 🎵', 'Otra 🎶'] },
  { id: 'q4', question: '¿Eres de introvertido o extrovertido?', options: ['Introvertido 🏠', 'Extrovertido 🎉'] },
  { id: 'q5', question: '¿Series o películas?', options: ['Series 📺', 'Películas 🎬'] },
  { id: 'q6', question: '¿Cuál es tu forma favorita de relajarte?', options: ['Videojuegos 🎮', 'Música 🎵', 'Leer 📚', 'Salir 🌳'] },
  { id: 'q7', question: '¿Planeas o improvisas?', options: ['Planifico 📋', 'Improviso 🌊'] },
  { id: 'q8', question: '¿Café o energizante?', options: ['Café ☕', 'Energizante ⚡', 'Nada 🚫'] },
  { id: 'q9', question: '¿Hablas rápido o reflexionas antes?', options: ['Rápido 💬', 'Reflexiono 🤔'] },
  { id: 'q10', question: '¿Prefieres texto o llamada?', options: ['Texto 💬', 'Llamada 📞'] },
]

function computeScore(a: Record<string, string>, b: Record<string, string>) {
  if (!a || !b) return 0
  let matches = 0
  let total = 0
  for (const q of QUESTIONS) {
    if (a[q.id] !== undefined && b[q.id] !== undefined) {
      total++
      if (a[q.id] === b[q.id]) matches++
    }
  }
  return total === 0 ? 0 : Math.round((matches / total) * 100)
}

interface AffinityMatchPageProps {
  userId: string
  orbitId: string
  myAnswers: Record<string, string> | null
  members: any[]
}

export function AffinityMatchPage({ userId, orbitId, myAnswers: initial, members }: AffinityMatchPageProps) {
  const [step, setStep] = useState(initial ? 'results' : 'questions')
  const [answers, setAnswers] = useState<Record<string, string>>(initial ?? {})
  const [saving, setSaving] = useState(false)

  async function save() {
    if (Object.keys(answers).length < QUESTIONS.length) {
      toast.error('Responde todas las preguntas')
      return
    }
    setSaving(true)
    try {
      await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      setStep('results')
      toast.success('¡Perfil de afinidad guardado!')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const matches = members
    .map(m => ({ ...m, score: computeScore(answers, m.affinity_answers) }))
    .filter(m => m.affinity_answers)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <Navbar orbitId={orbitId} />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm mb-6">
          <Heart className="w-4 h-4" />Match de Afinidad
        </div>

        {step === 'questions' ? (
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Cuéntanos sobre ti</h1>
            <p className="text-white/40 mb-8 text-sm">10 preguntas rápidas para encontrar tu mejor match.</p>
            <div className="space-y-6">
              {QUESTIONS.map(q => (
                <div key={q.id} className="glass rounded-2xl p-5">
                  <p className="font-semibold text-white mb-4">{q.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          answers[q.id] === opt
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6" onClick={save} disabled={saving}>
              {saving ? 'Guardando...' : 'Ver mis matches'}
            </Button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Tus top matches</h1>
            <p className="text-white/40 mb-8 text-sm">Basado en tus respuestas, conectas más con:</p>

            {matches.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-white/40">
                Nadie en tu orbit ha completado su perfil aún.
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((m, i) => (
                  <div key={m.id} className="glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="text-2xl font-black text-white/20">#{i + 1}</div>
                    <Avatar discordId={m.discord_id} avatar={m.avatar} username={m.username} size={48} />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{m.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 rounded-full transition-all"
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-pink-400">{m.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button variant="outline" className="w-full mt-6" onClick={() => setStep('questions')}>
              Rehacer mis respuestas
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
