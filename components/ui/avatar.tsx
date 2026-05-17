import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getDiscordAvatarUrl } from '@/lib/utils'

interface AvatarProps {
  discordId: string
  avatar: string | null
  username: string
  size?: number
  className?: string
}

export function Avatar({ discordId, avatar, username, size = 40, className }: AvatarProps) {
  return (
    <div
      className={cn('relative rounded-full overflow-hidden flex-shrink-0 bg-brand-800', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={getDiscordAvatarUrl(discordId, avatar)}
        alt={username}
        fill
        className="object-cover"
      />
    </div>
  )
}
