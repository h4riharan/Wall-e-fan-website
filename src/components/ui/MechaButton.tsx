import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { playClick } from '../../hooks/useSoundBus'

interface MechaButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  className?: string
  ariaLabel?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

const VARIANTS: Record<NonNullable<MechaButtonProps['variant']>, string> = {
  primary:
    'bg-yellow-walle text-charcoal border-yellow-deep hover:bg-yellow-soft shadow-[0_6px_0_0_var(--color-yellow-deep)] hover:shadow-[0_3px_0_0_var(--color-yellow-deep)] hover:translate-y-[3px]',
  outline:
    'bg-transparent text-cream border-cream/35 hover:border-yellow-walle hover:text-yellow-walle hover:bg-yellow-walle/5',
  ghost:
    'bg-charcoal-raised/70 text-cream/90 border-cream/10 hover:bg-charcoal-raised hover:text-cream',
}

/**
 * Industrial, tactile button: the pressed state drops its "bolt" shadow like
 * a physical key. Plays the UI click sound when sound is enabled.
 */
export function MechaButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ariaLabel,
  disabled,
  type = 'button',
}: MechaButtonProps) {
  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        playClick()
        onClick?.()
      }}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 1, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`group relative inline-flex cursor-pointer items-center gap-3 border-2 px-7 py-3.5 font-mono text-[0.72rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
