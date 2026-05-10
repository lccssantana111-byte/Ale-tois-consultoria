import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useRef, useState } from 'react'
import { SectionLabel } from '../ui/SectionLabel'
import { METRICS, BEFORE_AFTER } from '../../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function MetricCard({ value, label, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      style={{
        textAlign: 'center',
        padding: '40px 24px',
        borderRight: index < 2 ? '1px solid var(--border)' : 'none',
      }}
      className={`metric-card metric-card-${index}`}
    >
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(56px, 8vw, 96px)',
          color: 'var(--accent-gold)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          textShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
        }}
      >
        {value}
      </motion.p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginTop: '12px',
        }}
      >
        {label}
      </p>
    </motion.div>
  )
}

function PlaceholderImage({ side }) {
  const isAfter = side === 'DEPOIS'
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        opacity: 0.4,
      }}
    >
      <svg width="56" height="84" viewBox="0 0 64 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="14" rx="11" ry="11" fill={isAfter ? '#C9A84C' : '#555'} />
        <rect x="20" y="28" width="24" height="34" rx="4" fill={isAfter ? '#C9A84C' : '#555'} />
        <path d="M20 58 L14 88 Q13 92 17 92 Q20 92 21 88 L26 68 L38 68 L43 88 Q44 92 47 92 Q51 92 50 88 L44 58 Z" fill={isAfter ? '#C9A84C' : '#555'} />
        <rect x="8" y="28" width="10" height="28" rx="5" fill={isAfter ? '#C9A84C' : '#555'} />
        <rect x="46" y="28" width="10" height="28" rx="5" fill={isAfter ? '#C9A84C' : '#555'} />
      </svg>
      <p
        style={{
          fontSize: '9px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: isAfter ? 'var(--accent-gold)' : 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
        }}
      >
        Foto em breve
      </p>
    </div>
  )
}

function BeforeAfterCard({ item }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        height: '100%',
        gap: '2px',
        background: '#111',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {['ANTES', 'DEPOIS'].map((label, i) => (
        <div
          key={label}
          style={{
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            minHeight: 0,
          }}
        >
          {/* Imagem */}
          {(i === 0 ? item.imageBefore : item.imageAfter) ? (
            <img
              src={i === 0 ? item.imageBefore : item.imageAfter}
              alt={`${label} - ${item.name}`}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
                filter: i === 0 ? 'grayscale(100%) brightness(0.6)' : 'brightness(0.85)',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: i === 0 ? '#111' : '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlaceholderImage side={label} />
            </div>
          )}

          {/* Gradiente base — legibilidade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Label topo — simples, sem box */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2 }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: i === 0 ? 'rgba(255,255,255,0.45)' : 'var(--accent-gold)',
              }}
            >
              {label}
            </span>
          </div>

          {/* Info base — apenas no DEPOIS, sem box */}
          {i === 1 && (
            <div style={{ position: 'absolute', bottom: '22px', left: '20px', right: '20px', zIndex: 2 }}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(15px, 1.4vw, 20px)',
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}
              >
                {item.result}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {item.name} · {item.duration}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StickyCarousel() {
  const wrapperRef = useRef(null)
  const total = BEFORE_AFTER.length
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(total - 1) * 100}vw`])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveIndex(Math.min(Math.round(v * (total - 1)), total - 1))
  })

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${total * 100}vh`, position: 'relative' }}
    >
      <div
        className="carousel-sticky"
        style={{
          position: 'sticky',
          top: '72px',
          height: 'calc(100vh - 72px)',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── HEADER ── */}
        <div
          className="carousel-header"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '16px clamp(20px, 5vw, 80px) 14px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            zIndex: 10,
            gap: '24px',
          }}
        >
          {/* Esquerda: label + título empilhados */}
          <div>
            <SectionLabel style={{ marginBottom: '4px' }}>Antes &amp; Depois</SectionLabel>
            <p
              className="carousel-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 7vw, 96px)',
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                lineHeight: 0.95,
              }}
            >
              Transformações Reais
            </p>
          </div>

          {/* Direita: dots + contador */}
          <div className="carousel-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {BEFORE_AFTER.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === activeIndex ? 'var(--accent-gold)' : 'var(--border)',
                    transition: 'all 0.35s ease',
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.8vw, 38px)',
                color: 'var(--accent-gold)',
                lineHeight: 1,
                letterSpacing: '0.04em',
              }}
            >
              {String(activeIndex + 1).padStart(2, '0')}
              <span style={{ fontSize: '0.55em', color: 'var(--text-muted)', marginLeft: '3px' }}>
                / {String(total).padStart(2, '0')}
              </span>
            </p>
          </div>
        </div>

        {/* ── TRACK DE CARDS — preenche exatamente o espaço restante ── */}
        <div className="carousel-track-wrapper" style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
          <motion.div
            className="carousel-motion-track"
            style={{
              display: 'flex',
              width: `${total * 100}vw`,
              height: '100%',
              x,
            }}
          >
            {BEFORE_AFTER.map((item, i) => (
              <div
                key={i}
                className="before-after-slot"
                style={{
                  width: '100vw',
                  height: '100%',
                  flexShrink: 0,
                  minHeight: 0,
                  padding: '8px clamp(12px, 2vw, 24px)',
                  boxSizing: 'border-box',
                }}
              >
                <BeforeAfterCard item={item} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RODAPÉ: hint + barra de progresso ── */}
        <div
          style={{
            flexShrink: 0,
            padding: '14px clamp(20px, 5vw, 80px)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            background: 'var(--bg-primary)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {activeIndex + 1} de {total}
          </p>

          <div style={{ flex: 1, height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%',
                width: progressWidth,
                background: 'linear-gradient(90deg, var(--accent-gold-dk), var(--accent-gold))',
                borderRadius: '1px',
              }}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export function Results() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="resultados">
      {/* Métricas — padding normal */}
      <div className="section">
        <div className="container">
          <motion.div
            ref={ref}
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Resultados Comprovados</SectionLabel>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '40px',
                marginBottom: '80px',
              }}
              className="results-header"
            >
              <motion.h2
                variants={fadeUp}
                className="text-display-md"
                style={{ color: 'var(--text-primary)', maxWidth: '480px' }}
              >
                Números que provam a transformação
              </motion.h2>

              <div
                style={{ width: '1px', height: '80px', background: 'var(--border)', alignSelf: 'center' }}
                className="results-divider"
              />

              <motion.p variants={fadeUp} className="text-body-lg" style={{ maxWidth: '380px' }}>
                Cada número representa uma vida transformada, um objetivo alcançado,
                uma pessoa que decidiu mudar com a orientação certa.
              </motion.p>
            </div>

            <motion.div
              variants={stagger}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
              }}
              className="metrics-grid"
            >
              {METRICS.map((m, i) => (
                <MetricCard key={m.label} value={m.value} label={m.label} index={i} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sticky horizontal carousel — fullscreen */}
      <StickyCarousel />

      <style>{`
        @media (max-width: 768px) {
          .results-header { grid-template-columns: 1fr !important; }
          .results-divider { display: none !important; }
          .results-header h2, .results-header p { text-align: center !important; }
          .metrics-grid { grid-template-columns: 1fr !important; }
          .metric-card { border-right: none !important; border-bottom: 1px solid var(--border); }
          .metric-card-2 { border-bottom: none !important; }

          .carousel-sticky {
            top: 72px !important;
            height: calc(100vh - 72px) !important;
          }
          .carousel-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding: 12px 20px 10px !important;
          }
          .carousel-title {
            font-size: clamp(48px, 7vw, 96px) !important;
            line-height: 0.95 !important;
          }
          .carousel-nav { gap: 12px !important; }
          .before-after-slot { padding: 6px 8px !important; }
        }
      `}</style>
    </section>
  )
}
