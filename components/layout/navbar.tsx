'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Settings, LogOut, Zap } from 'lucide-react'
import { formatPoints } from '@/lib/utils'

interface NavbarProps {
  orbitId?: string
  points?: number
}

export function Navbar({ orbitId, points }: NavbarProps) {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface-50/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={orbitId ? `/orbit/${orbitId}` : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-sm glow">
            O
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Orbitals</span>
        </Link>

        {session?.user && (
          <div className="flex items-center gap-3">
            {points !== undefined && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20">
                <Zap className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-semibold text-brand-300">{formatPoints(points)}</span>
              </div>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Avatar
              discordId={session.user.discord_id ?? ''}
              avatar={session.user.image ?? null}
              username={session.user.name ?? ''}
              size={32}
              className="cursor-pointer ring-2 ring-brand/30 hover:ring-brand/60 transition-all"
            />
          </div>
        )}
      </div>
    </nav>
  )
}
