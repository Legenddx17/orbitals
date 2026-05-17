'use client'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Target, Trophy, Calendar, Heart, ChevronRight } from 'lucide-react'

const MODES = [
  { href: 'missions', icon: Target,   label: 'Misiones Individuales', desc: 'Completa retos de trivia, creatividad o rapidez. Se renuevan cada semana.',   color: '#7C3AED', pts: '10–30 pts' },
  { href: 'weekly',   icon: Trophy,   label: 'Reto Semanal',          desc: 'Participa con todo el orbit. Los más votados ganan puntos bonus.',             color: '#F59E0B', pts: '25–50 pts' },
  { href: 'daily',    icon: Calendar, label: 'Ritual Diario',         desc: 'Responde la pregunta del día. Todos los resultados se revelan a las 9pm.',     color: '#06B6D4', pts: '5 pts' },
  { href: 'match',    icon: Heart,    label: 'Match de Afinidad',     desc: 'Descubre con quién conectas más en tu orbit. Se refresca cada 2 semanas.',     color: '#EC4899', pts: 'Social' },
]

export function GamesMenu({ orbitId }: { orbitId: string }) {
  return (
    <div className="min-h-screen">
      <Navbar orbitId={orbitId} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Juegos</h1>
          <p className="text-white/40 mt-1">Elige qué quieres jugar</p>
        </div>
        <div className="space-y-3">
          {MODES.map(({ href, icon: Icon, label, desc, color, pts }) => (
            <Link key={href} href={`/orbit/${orbitId}/${href}`}>
              <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-white">{label}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}22`, color }}>{pts}</span>
                  </div>
                  <p className="text-sm text-white/40">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
