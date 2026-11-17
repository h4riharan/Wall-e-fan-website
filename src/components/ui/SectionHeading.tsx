import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface SectionHeadingProps {
  index: string
  label: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
}

/** Editorial section header: mono index label + huge display title. */
export function SectionHeading({ index, label, title, lead, align = 'left' }: SectionHeadingProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      <p className="text-label mb-4 flex items-center gap-3 text-yellow-walle">
        <span className="inline-block h-px w-10 bg-yellow-walle/60" aria-hidden />
        {index} · {label}
      </p>
      <h2 className="text-editorial text-cream text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {lead && <p className="mt-5 text-base leading-relaxed text-cream/65 sm:text-lg">{lead}</p>}
    </motion.div>
  )
}
