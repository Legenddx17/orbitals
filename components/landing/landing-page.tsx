'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Zap, Users, Trophy, MessageCircle } from 'lucide-react'

const FEATURES = [
  { icon: Zap,           label: 'Misiones semanales',    desc: 'Retos de trivia, creatividad y rapidez que rotan cada semana.' },
  { icon: Trophy,        label: 'Leaderboard en vivo',   desc: 'Compite con tu comunidad. El ranking se actualiza en tiempo real.' },
  { icon: MessageCircle, label: 'Ritual diario',         desc: 'Una pregunta al día. Las respuestas se revelan a las 9pm.' },
  { icon: Users,         label: 'Match de afinidad',     desc: 'Descubre con quién conectas más dentro de tu orbit.' },
]

export function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Para comunidades de Discord
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Juega con<br />
            <span className="gradient-text">tu comunidad.</span>
          </h1>

          <p className="text-xl text-white/50 max-w-xl mx-auto mb-10">
            Discord te junta con gente. Orbitals te da algo divertido que hacer con esa gente.
          </p>

          <Button
            variant="discord"
            size="xl"
            onClick={() => signIn('discord')}
            className="shadow-lg shadow-[#5865F2]/20"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.036.052a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Entrar con Discord
          </Button>
        </div>

        {/* Orbit animation */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-32 h-32 hidden xl:block">
          <div className="w-4 h-4 rounded-full bg-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glow" />
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-brand/20 animate-orbit"
              style={{ animationDelay: `${i * 2}s`, transform: `scale(${1 + i * 0.5})` }}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{label}</h3>
                <p className="text-sm text-white/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
