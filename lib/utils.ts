import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDiscordAvatarUrl(discordId: string, avatar: string | null) {
  if (!avatar) return `https://cdn.discordapp.com/embed/avatars/${Number(discordId) % 5}.png`
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.webp?size=128`
}

export function getDiscordGuildIconUrl(guildId: string, icon: string | null) {
  if (!icon) return null
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=128`
}

export function formatPoints(points: number) {
  return points >= 1000 ? `${(points / 1000).toFixed(1)}k` : String(points)
}

export function getOrdinalSuffix(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
