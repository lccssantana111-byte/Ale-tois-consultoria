import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { MessageCircle, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { WA_LINK } from '../../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
}

export function Hero() {
  const wrapperRef = useRef(null)
  const videoRef = useRef(null)

  const scrollProgress = useMotionValue(0)
  const bgY = useTransform(scrollProgress, [0, 1], ['0%', '20%'])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    if (!wrapper || !video) return

    let unlocked = false

    const getProgress = () => {
      const total = wrapper.offsetHeight - window.innerHeight
      if (total <= 0) return 0
      const scrolled = window.scrollY - wrapper.offsetTop
      return Math.min(Math.max(scrolled / total, 0), 1)
    }

    const applySeek = () => {
      if (!unlocked) return
      const dur = video.duration
      if (!dur || isNaN(dur)) return
      const progress = getProgress()
      scrollProgress.set(progress)
      video.currentTime = progress * dur
    }

    // Desbloqueia seek: play() seguido de pause() imediato.
    // O seek é aplicado DENTRO do .then() para garantir que o
    // browser não reinicia a reprodução após o pause.
    const unlock = () => {
      if (unlocked) return
      video.play().then(() => {
        video.pause()
        unlocked = true
        applySeek()
      }).catch(() => {
        // Fallback para browsers que rejeitam play() (raro com muted)
        unlocked = true
        applySeek()
      })
    }

    // Escuta seeking para pausar imediatamente se o browser tentar reproduzir
    const onSeeking = () => { if (unlocked) video.pause() }
    video.addEventListener('seeking', onSeeking)

    if (video.readyState >= 1) {
      unlock()
    } else {
      video.addEventListener('loadedmetadata', unlock, { once: true })
    }

    window.addEventListener('scroll', applySeek, { passive: true })

    return () => {
      window.removeEventListener('scroll', applySeek)
      video.removeEventListener('loadedmetadata', unlock)
      video.removeEventListener('seeking', onSeeking)
    }
  }, [scrollProgress])

  return (
    <div
      ref={wrapperRef}
      id="hero"
      className="hero-wrapper"
      style={{ height: '300vh', position: 'relative' }}
    >
      {/* Conteúdo sticky — fica fixo enquanto o wrapper é scrollado */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'clip', /* clip não quebra position:sticky no iOS Safari, diferente de hidden */
        }}
      >
        {/* Glow de fundo com parallax */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-20%',
            y: bgY,
            background: `
              radial-gradient(ellipse 55% 65% at 72% 50%, rgba(201,168,76,0.08) 0%, transparent 65%),
              radial-gradient(ellipse 40% 40% at 18% 80%, rgba(201,168,76,0.04) 0%, transparent 60%)
            `,
            pointerEvents: 'none',
          }}
        />

        {/* Linha horizontal decorativa */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.12) 30%, rgba(201,168,76,0.12) 70%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Espaço da navbar */}
        <div style={{ height: '72px', flexShrink: 0 }} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div className="container hero-container" style={{ width: '100%', height: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(32px, 5vw, 72px)',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
              }}
              className="hero-grid"
            >
              {/* ── Esquerda: texto ── */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="hero-text-col"
                style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vh, 24px)' }}
              >
                <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
                  <Badge>Co-fundador da Academia Gaviões</Badge>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  transition={{ duration: 0.55 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(52px, 7.5vw, 110px)',
                    lineHeight: 0.93,
                    letterSpacing: '0.02em',
                    color: 'var(--text-primary)',
                  }}
                >
                  SEU{' '}
                  <span style={{ color: 'var(--accent-gold)' }}>CORPO.</span>
                  <br />
                  SEU{' '}
                  <span style={{ color: 'var(--accent-gold)' }}>OBJETIVO.</span>
                  <br />
                  MEU MÉTODO.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontSize: 'clamp(14px, 1.2vw, 17px)',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    maxWidth: '420px',
                  }}
                >
                  Consultoria personalizada de treino e dieta com quem já transformou
                  centenas de vidas. Em São Paulo e online — para qualquer objetivo.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                >
                  <Button
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    style={{ padding: '14px 28px', fontSize: '13px' }}
                  >
                    <MessageCircle size={15} />
                    Quero minha consultoria
                  </Button>
                  <Button
                    href="#resultados"
                    variant="outline"
                    style={{ padding: '14px 24px', fontSize: '13px' }}
                  >
                    Ver resultados
                  </Button>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-gold)">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    500+ alunos transformados · São Paulo, SP
                  </span>
                </motion.div>
              </motion.div>

              {/* ── Direita: vídeo ── */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                className="hero-image-wrapper"
              >
                {/* Frame decorativo */}
                <div
                  className="hero-frame-deco"
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    width: '55%',
                    height: '55%',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />

                {/* Vídeo — sincronizado com scroll */}
                <div
                  className="hero-video-frame"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxHeight: 'calc(100vh - 72px - 48px)',
                    aspectRatio: '3/4',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: '0 0 60px rgba(201,168,76,0.15)',
                    background: '#0a0a0a',
                  }}
                >
                  <video
                    ref={videoRef}
                    src="/media/video_generator_task_19e8cce0-81a2-4f82-9c2b-9e9ba7a61a03.mp4"
                    muted
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      display: 'block',
                    }}
                  />
                  {/* Overlay gradiente sutil */}
                  <div
                    aria-hidden="true"
                    className="hero-video-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `
                        linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, transparent 25%, transparent 70%, rgba(10,10,10,0.5) 100%),
                        linear-gradient(to right, transparent 70%, rgba(10,10,10,0.3) 100%)
                      `,
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Card flutuante de stat */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="hero-floating-card"
                  style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-24px',
                    background: 'rgba(26,26,26,0.92)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 20px',
                    zIndex: 2,
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--accent-gold)', lineHeight: 1 }}>
                    500+
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
                    Vidas transformadas
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Tablet: empilha em 1 coluna ── */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            align-items: start !important;
            padding-top: 16px;
            padding-bottom: 16px;
          }
          .hero-image-wrapper {
            max-width: 320px;
            margin: 0 auto;
          }
          .hero-floating-card {
            left: 8px !important;
          }
        }

        /* ── Mobile: vídeo em background fullscreen, texto na frente ── */
        @media (max-width: 768px) {
          /* Container sem padding lateral para o vídeo poder ir até a borda */
          .hero-container {
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: none !important;
          }

          /* Grid ocupa toda a altura disponível */
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            position: relative;
            height: 100% !important;
            align-items: flex-end !important;
            justify-items: center !important;
            padding: 0 var(--section-px) 56px !important;
          }

          /* Vídeo posicionado como background absoluto */
          .hero-image-wrapper {
            position: absolute !important;
            inset: 0 !important;
            max-width: none !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            z-index: 0;
          }

          /* Frame do vídeo cobre tudo */
          .hero-video-frame {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: none !important;
            aspect-ratio: unset !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }

          /* Overlay com gradiente denso na base para texto legível */
          .hero-video-overlay {
            background: linear-gradient(
              to bottom,
              rgba(10,10,10,0.1) 0%,
              rgba(10,10,10,0.05) 30%,
              rgba(10,10,10,0.6) 65%,
              rgba(10,10,10,0.95) 100%
            ) !important;
          }

          /* Elementos decorativos removidos no mobile */
          .hero-frame-deco,
          .hero-floating-card {
            display: none !important;
          }

          /* Texto com z-index acima do vídeo, alinhado à esquerda igual à headline */
          .hero-text-col {
            position: relative;
            z-index: 2;
            text-align: left !important;
            align-items: flex-start !important;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .hero-grid {
            padding-bottom: 36px !important;
          }
        }

        @media (max-height: 700px) {
          .hero-grid {
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
