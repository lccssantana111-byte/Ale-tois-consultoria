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
        height: '100%',   // preenche o slot sem forçar aspectRatio
        gap: '1px',
        background: 'var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        minHeight: 0,     // permite que o flex pai comprima corretamente
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
          {/* Imagem de fundo — cobre o card inteiro */}
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
                filter: i === 0
                  ? 'grayscale(80%) brightness(0.55) contrast(1.1)'
                  : 'brightness(0.8) contrast(1.05) saturate(1.1)',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: i === 0
                  ? 'linear-gradient(160deg, #0e0e0e 0%, #1c1c1c 100%)'
                  : 'linear-gradient(160deg, rgba(201,168,76,0.07) 0%, #141414 55%, #0e0e0e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlaceholderImage side={label} />
            </div>
          )}

          {/* Overlay de gradiente — escurece base para legibilidade do texto */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: i === 0
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.75) 100%)'
                : 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 35%, transparent 50%, rgba(0,0,0,0.8) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Label faint no centro */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 8vw, 100px)',
                color: i === 0 ? '#ffffff' : 'var(--accent-gold)',
                opacity: 0.06,
                userSelect: 'none',
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </span>
          </div>

          {/* Badge topo — sobre a imagem */}
          <div style={{ position: 'absolute', top: '20px', left: '24px', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 11px',
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '100px',
                border: `1px solid ${i === 0 ? 'var(--border)' : 'var(--border-gold)'}`,
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: i === 0 ? 'var(--text-muted)' : 'var(--accent-gold)',
                }}
              >
                {label}
              </span>
            </div>
          </div>

          {/* Info base — sobre a imagem */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', zIndex: 2 }}>
            {i === 1 ? (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(10,10,10,0.82)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(13px, 1.2vw, 16px)',
                    color: 'var(--accent-gold)',
                    lineHeight: 1.1,
                    letterSpacing: '0.02em',
                    marginBottom: '3px',
                  }}
                >
                  {item.result}
                </p>
                <p
                  style={{
                    fontSize: '9px',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.goal} · {item.duration}
                </p>
                <p style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>
                  {item.name}
                </p>
              </div>
            ) : (
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(10,10,10,0.6)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  display: 'inline-block',
                }}
              >
                <p style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {item.goal}
                </p>
              </div>
            )}
          </div>
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
                fontSize: 'clamp(36px, 5vw, 64px)',
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
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
          <motion.div
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
              transition: 'opacity 0.4s',
              opacity: activeIndex === total - 1 ? 0.4 : 1,
            }}
          >
            {activeIndex === total - 1 ? 'Continue rolando' : 'Role para avançar'}
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

          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {activeIndex + 1} de {total}
          </p>
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
          .metrics-grid { grid-template-columns: 1fr !important; }
          .metric-card { border-right: none !important; border-bottom: 1px solid var(--border); }
          .metric-card-2 { border-bottom: none !important; }

          .carousel-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding: 12px 20px 10px !important;
          }
          .carousel-title {
            font-size: 26px !important;
            line-height: 1 !important;
          }
          .carousel-nav {
            gap: 12px !important;
          }
          .before-after-slot {
            padding: 6px 8px !important;
          }
        }
        @media (max-width: 480px) {
          .carousel-title {
            font-size: 22px !important;
          }
        }
      `}</style>
    </section>
  )
}
