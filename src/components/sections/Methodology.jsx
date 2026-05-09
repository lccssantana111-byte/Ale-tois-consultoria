import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionLabel } from '../ui/SectionLabel'
import { METHODOLOGY_STEPS } from '../../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}


function Step({ step, index, total }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isLast = index === total - 1

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: '32px',
        position: 'relative',
      }}
      className="step-item"
    >
      {/* Number + connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '1px solid var(--border-gold)',
            background: 'rgba(201,168,76,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              color: 'var(--accent-gold)',
              letterSpacing: '0.04em',
            }}
          >
            {step.number}
          </span>
        </div>

        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: 'easeInOut' }}
            style={{
              width: '1px',
              flex: 1,
              minHeight: '60px',
              background: 'linear-gradient(180deg, var(--accent-gold-dk) 0%, transparent 100%)',
              transformOrigin: 'top',
              marginTop: '8px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className={!isLast ? 'step-content' : ''} style={{ paddingBottom: isLast ? 0 : '48px', paddingTop: '12px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
            marginBottom: '12px',
            lineHeight: 1,
          }}
        >
          {step.title}
        </h3>
        <p className="text-body-lg" style={{ maxWidth: '520px' }}>
          {step.description}
        </p>
      </div>
    </motion.div>
  )
}

export function Methodology() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="metodologia" className="section">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
          className="method-grid"
        >
          {/* Left: header sticky */}
          <motion.div
            ref={ref}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{ position: 'sticky', top: '100px' }}
            className="method-header"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Como Funciona</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-display-md"
              style={{ color: 'var(--text-primary)', marginBottom: '24px' }}
            >
              Do primeiro contato ao resultado real
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-lg">
              Um processo estruturado e transparente. Cada etapa foi pensada para
              garantir que sua evolução seja constante, mensurável e duradoura.
            </motion.p>

            {/* Decorative accent */}
            <motion.div
              variants={fadeUp}
              style={{
                marginTop: '48px',
                padding: '28px 32px',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(201,168,76,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '80px',
                  color: 'var(--accent-gold)',
                  lineHeight: 1,
                  opacity: 1,
                }}
              >
                4
              </p>
              <div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--accent-gold)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Etapas
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  do processo
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: steps */}
          <div style={{ paddingTop: '8px' }}>
            {METHODOLOGY_STEPS.map((step, i) => (
              <Step key={step.number} step={step} index={i} total={METHODOLOGY_STEPS.length} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .method-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .method-header { position: static !important; }
        }
        @media (max-width: 768px) {
          .method-grid { gap: 36px !important; }
          .step-item { grid-template-columns: 56px 1fr !important; gap: 16px !important; }
          .step-content { padding-bottom: 32px !important; }
        }
        @media (max-width: 480px) {
          .step-item { grid-template-columns: 48px 1fr !important; gap: 12px !important; }
          .step-content { padding-bottom: 24px !important; }
        }
      `}</style>
    </section>
  )
}
