import { cn } from '@/lib/utils'

interface BadgePillProps {
  label: string
  color?: string
  className?: string
}

export function BadgePill({ label, color = '#7C3AED', className }: BadgePillProps) {
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  )
}
