import { motion } from 'framer-motion'

export function GlowCard({ children, style, glowOnHover = true }) {
  return (
    <motion.div
      whileHover={
        glowOnHover
          ? {
              borderColor: 'rgba(201, 168, 76, 0.4)',
              boxShadow: '0 0 40px rgba(201, 168, 76, 0.1)',
              y: -4,
            }
          : {}
      }
      transition={{ duration: 0.25 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}
