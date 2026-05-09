import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './Button'
import { WA_LINK, INSTAGRAM_LINK } from '../../lib/constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 var(--section-px)',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background var(--transition-slow), border-color var(--transition-slow)',
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <a href="#hero" aria-label="Ale Tois — início">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            letterSpacing: '0.08em',
            color: 'var(--accent-gold)',
          }}
        >
          ALE TOIS
        </span>
      </a>

      {/* Nav links */}
      <div
        className="nav-links"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <a
          href={INSTAGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-instagram"
          style={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          Instagram
        </a>

        <Button href={WA_LINK} target="_blank" rel="noopener noreferrer" variant="primary" className="nav-cta" style={{ padding: '10px 20px', fontSize: '12px' }}>
          Falar no WhatsApp
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-instagram { display: none !important; }
          .nav-cta { padding: 8px 14px !important; font-size: 11px !important; }
        }
        @media (max-width: 380px) {
          .nav-cta span { display: none; }
        }
      `}</style>
    </motion.nav>
  )
}
