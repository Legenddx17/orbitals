import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-brand text-white hover:bg-brand-700 active:scale-95',
        outline: 'border border-white/10 text-white hover:bg-white/5 active:scale-95',
        ghost:   'text-white/70 hover:text-white hover:bg-white/5',
        danger:  'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30',
        discord: 'bg-[#5865F2] text-white hover:bg-[#4752C4] active:scale-95',
      },
      size: {
        sm:  'h-8  px-3 text-sm',
        md:  'h-10 px-4 text-sm',
        lg:  'h-12 px-6 text-base',
        xl:  'h-14 px-8 text-lg',
        icon:'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'
