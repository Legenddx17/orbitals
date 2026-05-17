'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getDiscordGuildIconUrl } from '@/lib/utils'
import { toast } from 'sonner'

interface Guild { id: string; name: string; icon: string | null; owner: boolean }

export function OnboardingClient({ guilds }: { guilds: Guild[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function joinOrbit(guild: Guild) {
    setLoading(guild.id)
    try {
      const res = await fetch('/api/orbits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: guild.id, guild_name: guild.name, guild_icon: guild.icon }),
      })
      const { orbit, error } = await res.json()
      if (error) throw new Error(error)
      toast.success(`¡Bienvenido a ${guild.name}!`)
      router.push(`/orbit/${orbit.id}`)
    } catch (e: any) {
      toast.error(e.message)
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white font-black text-2xl glow mx-auto mb-4">
            O
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Elige tu orbit</h1>
          <p className="text-white/50">Selecciona el servidor de Discord que quieres vincular.</p>
        </div>

        <div className="space-y-3">
          {guilds.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-white/40">
              No tienes servidores de Discord disponibles.
            </div>
          )}
          {guilds.map(guild => {
            const icon = getDiscordGuildIconUrl(guild.id, guild.icon)
            return (
              <button
                key={guild.id}
                onClick={() => joinOrbit(guild)}
                disabled={!!loading}
                className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:border-brand/40 hover:bg-brand/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-50 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">
                  {icon ? (
                    <Image src={icon} alt={guild.name} width={48} height={48} className="object-cover" />
                  ) : (
                    guild.name[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{guild.name}</p>
                  {guild.owner && <p className="text-xs text-white/40">Propietario</p>}
                </div>
                {loading === guild.id ? (
                  <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-white/20 text-sm">→</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
