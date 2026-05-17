'use client'
import { signOut } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, ExternalLink } from 'lucide-react'

export function SettingsPage({ user }: { user: any }) {
  if (!user) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Configuración</h1>

        {/* Account */}
        <div className="glass rounded-2xl p-6 mb-4">
          <h3 className="font-semibold text-white/60 text-sm uppercase tracking-wide mb-4">Cuenta</h3>
          <div className="flex items-center gap-4">
            <Avatar discordId={user.discord_id} avatar={user.avatar} username={user.username} size={48} />
            <div>
              <p className="font-semibold text-white">{user.username}</p>
              {user.email && <p className="text-sm text-white/40">{user.email}</p>}
              <p className="text-xs text-white/30 mt-0.5">Conectado con Discord</p>
            </div>
          </div>
        </div>

        {/* Profile link */}
        <div className="glass rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Tu perfil público</p>
              <p className="text-sm text-white/40">/profile/{user.username}</p>
            </div>
            <a href={`/profile/${user.username}`} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5" />
                Ver
              </Button>
            </a>
          </div>
        </div>

        {/* Danger zone */}
        <div className="glass rounded-2xl p-5 border border-red-500/10">
          <h3 className="font-semibold text-red-400 text-sm uppercase tracking-wide mb-4">Zona peligrosa</h3>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
