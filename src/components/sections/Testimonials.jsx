import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'
import { SectionLabel } from '../ui/SectionLabel'
import { TESTIMONIALS } from '../../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function TestimonialCard({ t }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.3)' }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Quote mark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '16px',
          right: '24px',
          fontFamily: 'Georgia, serif',
          fontSize: '80px',
          color: 'var(--accent-gold)',
          opacity: 0.12,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        "
      </span>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
        ))}
      </div>

      {/* Text */}
      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
          flex: 1,
        }}
      >
        "{t.text}"
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent-gold)',
            }}
          >
            {t.initials}
          </span>
        </div>
        <div>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--accent-gold)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}
          >
            {t.goal}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="depoimentos" className="section section--alt">
      <div className="container">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>O que dizem os alunos</SectionLabel>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              alignItems: 'end',
              marginBottom: '56px',
            }}
            className="test-header"
          >
            <motion.h2
              variants={fadeUp}
              className="text-display-md"
              style={{ color: 'var(--text-primary)' }}
            >
              Transformações reais, histórias reais
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-lg">
              Os resultados falam por si. Cada depoimento é a prova de que
              método e acompanhamento fazem toda a diferença.
            </motion.p>
          </div>

          <motion.div
            variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
            className="test-grid"
          >
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .test-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .test-header { grid-template-columns: 1fr !important; gap: 20px !important; text-align: center !important; }
          .test-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
