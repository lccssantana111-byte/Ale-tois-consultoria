import { motion } from 'framer-motion'

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 28px',
    transition: 'all var(--transition-base)',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  primary: {
    background: 'var(--accent-gold)',
    color: '#0A0A0A',
    boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--accent-gold)',
    border: '1px solid var(--border-gold)',
  },
}

export function Button({ children, variant = 'primary', href, onClick, style, ...props }) {
  const variantStyle = styles[variant] || styles.primary
  const combinedStyle = { ...styles.base, ...variantStyle, ...style }

  const motionProps = {
    whileHover: {
      scale: 1.02,
      ...(variant === 'primary' && {
        boxShadow: '0 0 30px rgba(201, 168, 76, 0.4)',
        background: 'var(--accent-gold-lt)',
      }),
      ...(variant === 'outline' && { borderColor: 'var(--text-muted)' }),
      ...(variant === 'ghost' && { borderColor: 'var(--accent-gold)', background: 'rgba(201, 168, 76, 0.08)' }),
    },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.18 },
  }

  if (href) {
    return (
      <motion.a href={href} style={combinedStyle} {...motionProps} {...props}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button onClick={onClick} style={combinedStyle} {...motionProps} {...props}>
      {children}
    </motion.button>
  )
}
