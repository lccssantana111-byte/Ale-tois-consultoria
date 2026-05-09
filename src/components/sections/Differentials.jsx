import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Fingerprint,
  FlaskConical,
  MessageCircle,
  Dumbbell,
  Apple,
  TrendingUp,
} from 'lucide-react'
import { SectionLabel } from '../ui/SectionLabel'
import { GlowCard } from '../ui/GlowCard'
import { DIFFERENTIALS } from '../../lib/constants'

const ICONS = { Fingerprint, FlaskConical, MessageCircle, Dumbbell, Apple, TrendingUp }

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

export function Differentials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="diferenciais" className="section section--alt">
      <div className="container">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Por que Ale Tois</SectionLabel>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              alignItems: 'end',
              marginBottom: '64px',
            }}
            className="diff-header"
          >
            <motion.h2
              variants={fadeUp}
              className="text-display-md"
              style={{ color: 'var(--text-primary)' }}
            >
              O método que realmente funciona
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-lg">
              Não existe fórmula mágica. Existe método, ciência e
              acompanhamento real. É isso que diferencia quem transforma de quem
              apenas tenta.
            </motion.p>
          </div>

          <motion.div
            variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
            className="diff-grid"
          >
            {DIFFERENTIALS.map((d) => {
              const Icon = ICONS[d.icon]
              return (
                <motion.div key={d.title} variants={fadeUp}>
                  <GlowCard style={{ height: '100%' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(201, 168, 76, 0.1)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      {Icon && <Icon size={20} color="var(--accent-gold)" strokeWidth={1.5} />}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {d.title}
                    </h3>
                    <p className="text-body">{d.description}</p>
                  </GlowCard>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .diff-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .diff-header { grid-template-columns: 1fr !important; gap: 20px !important; }
          .diff-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
