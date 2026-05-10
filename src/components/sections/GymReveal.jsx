import { useRef, useEffect } from 'react'
import { getLenis } from '../../lib/lenis'
import { WA_LINK } from '../../lib/constants'

const FRAMES_BASE = '/media/Gym_facade_animation_reveal_202605101031_frames/'
const FRAMES_NAME = 'Gym_facade_animation_reveal_202605101031_'
const TOTAL_FRAMES = 144

const frameUrl = (i) =>
  `${FRAMES_BASE}${FRAMES_NAME}${String(i + 1).padStart(3, '0')}.jpg`

// Cada beat define o que aparece no painel de texto enquanto os frames avançam
const BEATS = [
  {
    progress: 0.0,
    eyebrow: 'Co-fundador · Academia Gaviões',
    title: 'CONSTRUÍDO\nPOR QUEM\nVIVEU ISSO.',
    body: 'Ale Tois não aprendeu fitness em sala de aula. Aprendeu no ferro, no suor e na construção de um espaço que se tornou referência em São Paulo.',
  },
  {
    progress: 0.4,
    eyebrow: 'Método próprio',
    title: 'ANOS DE\nEXPERIÊNCIA.\nEM CADA PLANO.',
    body: 'Cada consultoria carrega o know-how de quem já transformou centenas de alunos — e continua evoluindo junto com a ciência.',
  },
  {
    progress: 0.72,
    eyebrow: 'Sua vez',
    title: 'O PRÓXIMO\nCAPÍTULO É\nO SEU.',
    body: 'Treino. Dieta. Acompanhamento real. Tudo personalizado para o seu objetivo — seja emagrecimento, hipertrofia, saúde ou performance.',
    cta: true,
  },
]

export function GymReveal() {
  const wrapperRef  = useRef(null)
  const canvasRef   = useRef(null)
  const imagesRef   = useRef([])
  const frameIdxRef = useRef(0)
  const rafRef      = useRef(null)

  // Refs para os painéis de texto (animados direto no DOM, sem re-render)
  const beatRefs = [useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    const canvas  = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const isMobile   = window.innerWidth < 768
    const frameCount = isMobile ? Math.ceil(TOTAL_FRAMES / 2) : TOTAL_FRAMES
    const urlFor     = isMobile ? (j) => frameUrl(j * 2) : frameUrl

    // ── Draw — 1:1, sem crop, sem upscale ────────────────────────
    function drawFrame(idx) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const img = imagesRef.current[idx]
      if (!img || !img.complete || img.naturalWidth === 0) return
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    // ── Preload ───────────────────────────────────────────────────
    const images = new Array(frameCount)
    imagesRef.current = images
    function loadImg(j) {
      const img = new Image()
      images[j] = img
      img.onload = () => { if (j === 0) drawFrame(0) }
      img.src = urlFor(j)
    }
    const EAGER = Math.min(20, frameCount)
    for (let j = 0; j < EAGER; j++) loadImg(j)
    const deferred = setTimeout(() => {
      for (let j = EAGER; j < frameCount; j++) loadImg(j)
    }, 60)

    // ── Resize — canvas segue o elemento CSS exato ────────────────
    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr  = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(rect.width  * dpr)
      const h = Math.round(rect.height * dpr)
      if (w === canvas.width && h === canvas.height) return
      canvas.width  = w
      canvas.height = h
      drawFrame(frameIdxRef.current)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const layoutTimer = setTimeout(resize, 120)

    // ── Scroll ────────────────────────────────────────────────────
    function onScroll() {
      const scrollY = window.scrollY
      const top     = wrapper.getBoundingClientRect().top + scrollY
      const range   = wrapper.offsetHeight - window.innerHeight
      if (range <= 0) return
      const p = Math.min(Math.max((scrollY - top) / range, 0), 1)

      // Frame index
      const idx = Math.min(Math.round(p * (frameCount - 1)), frameCount - 1)
      if (idx !== frameIdxRef.current) {
        frameIdxRef.current = idx
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(idx))
      }

      // Beat text cross-fade
      BEATS.forEach((beat, i) => {
        const ref = beatRefs[i].current
        if (!ref) return
        const next  = BEATS[i + 1]
        const start = beat.progress
        const end   = next ? next.progress : 1.05

        const IN  = 0.07
        const OUT = 0.055
        const fadeOutStart = end - OUT

        let alpha = 0
        if (p >= start && p < end) {
          const enterT = Math.min((p - start) / IN, 1)
          const exitT  = next ? Math.max((p - fadeOutStart) / OUT, 0) : 0
          alpha = enterT * (1 - exitT)
        }

        ref.style.opacity   = alpha
        ref.style.transform = `translateY(${(1 - Math.min(alpha * 1.5, 1)) * 22}px)`
      })

      // Progress line
      const fill = wrapper.querySelector('.gym-line-fill')
      if (fill) fill.style.height = `${p * 100}%`
    }

    const lenis = getLenis()
    let unsub = null
    if (lenis) unsub = lenis.on('scroll', onScroll)
    else window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      clearTimeout(deferred)
      clearTimeout(layoutTimer)
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (unsub) unsub()
      else window.removeEventListener('scroll', onScroll)
      imagesRef.current.forEach((img) => { if (img) img.src = '' })
      imagesRef.current = []
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={wrapperRef}
      id="legado"
      style={{ height: '420vh', position: 'relative' }}
    >
      <div className="gym-sticky">

        {/* ══ ESQUERDA — canvas do frame ══════════════════════════ */}
        <div className="gym-frame-col">

          {/* Canvas 16:9 — nunca estica além da resolução nativa */}
          <div className="gym-canvas-wrap">
            <canvas ref={canvasRef} className="gym-canvas" />

            {/* Overlay lateral direito — faz o frame sangrar para o texto */}
            <div className="gym-frame-edge-overlay" aria-hidden="true" />

            {/* Overlay base — leve escurecimento cinematográfico */}
            <div className="gym-frame-overlay" aria-hidden="true" />

            {/* Borda dourada */}
            <div className="gym-frame-border" aria-hidden="true" />
          </div>

          {/* Rodapé do frame — crédito sutil */}
          <div className="gym-frame-footer">
            <span className="gym-frame-credit">Academia Gaviões · São Paulo</span>
          </div>
        </div>

        {/* ══ DIREITA — texto do Ale ══════════════════════════════ */}
        <div className="gym-text-col">

          {/* Linha de progresso vertical */}
          <div className="gym-progress-line">
            <div className="gym-line-fill" />
          </div>

          {/* Beats sobrepostos — animados via opacity/transform no DOM */}
          <div className="gym-beats-wrap">
            {BEATS.map((beat, i) => (
              <div
                key={i}
                ref={beatRefs[i]}
                className="gym-beat"
                style={{ opacity: 0, transform: 'translateY(22px)' }}
              >
                <p className="gym-beat-eyebrow">{beat.eyebrow}</p>

                <h2 className="gym-beat-title">
                  {beat.title.split('\n').map((line, j) => (
                    <span key={j} className="gym-beat-title-line">{line}</span>
                  ))}
                </h2>

                <p className="gym-beat-body">{beat.body}</p>

                {beat.cta && (
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gym-beat-cta"
                  >
                    <span className="gym-beat-cta-dot" />
                    Falar com o Ale
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Assinatura fixa no rodapé do painel */}
          <div className="gym-signature">
            <span className="gym-signature-name">ALE TOIS</span>
            <span className="gym-signature-title">Personal Trainer &amp; Consultor</span>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Sticky container — split layout ── */
        .gym-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #000;
          overflow: hidden;
        }

        /* ── Coluna esquerda: frame ── */
        .gym-frame-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: clamp(24px, 4vw, 56px) clamp(16px, 3vw, 40px) clamp(24px, 4vw, 56px) clamp(24px, 4vw, 56px);
          position: relative;
          gap: 14px;
        }

        /* Canvas wrapper — aspect 16:9, nunca estica além do espaço disponível */
        .gym-canvas-wrap {
          position: relative;
          width: 100%;
          /* Limita pela altura do viewport para não estourar verticalmente */
          max-height: calc(100vh - 120px);
          aspect-ratio: 16 / 9;
          /* Se a altura limitar antes da largura, ajusta a largura proporcionalmente */
          max-width: calc((100vh - 120px) * 16 / 9);
          border-radius: 10px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.15),
            0 24px 80px rgba(0,0,0,0.7),
            0 0 60px rgba(0,0,0,0.5);
        }

        .gym-canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .gym-frame-edge-overlay {
          position: absolute;
          top: 0; right: 0;
          width: 80px;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.5));
          pointer-events: none;
        }

        .gym-frame-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.45) 100%);
          pointer-events: none;
        }

        .gym-frame-border {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          border: 1px solid rgba(201,168,76,0.2);
          pointer-events: none;
        }

        .gym-frame-footer {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gym-frame-credit {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #777777;
        }

        /* ── Coluna direita: texto ── */
        .gym-text-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(48px, 8vh, 100px) clamp(32px, 5vw, 72px) clamp(48px, 8vh, 100px) clamp(24px, 3vw, 48px);
          position: relative;
          border-left: 1px solid rgba(255,255,255,0.08);
        }

        /* Linha de progresso vertical */
        .gym-progress-line {
          position: absolute;
          left: -1px;
          top: 20%;
          height: 60%;
          width: 2px;
          background: rgba(201,168,76,0.18);
          overflow: hidden;
        }
        .gym-line-fill {
          width: 100%;
          height: 0%;
          background: linear-gradient(to bottom, var(--accent-gold-dk), var(--accent-gold));
        }

        /* Beats */
        .gym-beats-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .gym-beat {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          will-change: opacity, transform;
        }

        .gym-beat-eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gym-beat-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--accent-gold);
          flex-shrink: 0;
        }

        .gym-beat-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 5.5vw, 80px);
          line-height: 0.93;
          letter-spacing: 0.02em;
          color: var(--text-primary);
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
        }

        .gym-beat-title-line {
          display: block;
        }

        .gym-beat-body {
          font-family: var(--font-body);
          font-size: clamp(15px, 1.2vw, 18px);
          line-height: 1.75;
          color: #C8C8C8;
          max-width: 400px;
          margin-bottom: 36px;
        }

        .gym-beat-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-gold);
          text-decoration: none;
          transition: gap 0.2s ease, opacity 0.2s ease;
        }
        .gym-beat-cta:hover {
          gap: 14px;
          opacity: 0.85;
        }
        .gym-beat-cta-dot {
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-gold);
          box-shadow: 0 0 10px var(--accent-gold);
          flex-shrink: 0;
        }

        /* Assinatura */
        .gym-signature {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
        }
        .gym-signature-name {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 32px);
          letter-spacing: 0.1em;
          color: rgba(201,168,76,0.85);
          line-height: 1;
        }
        .gym-signature-title {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888888;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          /* Sticky vira coluna única: frame em cima (40%), texto embaixo (60%) */
          .gym-sticky {
            grid-template-columns: 1fr;
            grid-template-rows: 40vh 1fr;
            align-items: stretch;
          }

          /* Frame ocupa 40vh — impacto visual sem sufocar o texto */
          .gym-frame-col {
            padding: 16px 20px 10px;
            gap: 0;
            justify-content: flex-end;
          }
          .gym-canvas-wrap {
            /* 16:9 contido dentro dos 40vh disponíveis */
            width: 100%;
            max-width: 100%;
            max-height: 100%;
            aspect-ratio: 16 / 9;
          }
          .gym-frame-edge-overlay { display: none; }
          .gym-frame-footer { display: none; }

          /* Painel de texto ocupa o restante — sem overflow */
          .gym-text-col {
            padding: 20px 24px 28px;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.08);
            justify-content: center;
            overflow: hidden;
          }
          .gym-progress-line { display: none; }

          /* Beats — centralizados verticalmente dentro do painel */
          .gym-beats-wrap {
            flex: unset;
            position: relative;
            min-height: 200px;
            height: 100%;
            max-height: calc(60vh - 100px);
          }

          .gym-beat {
            justify-content: center;
          }

          .gym-beat-eyebrow {
            font-size: 10px;
            margin-bottom: 12px;
          }

          .gym-beat-title {
            font-size: clamp(28px, 7.5vw, 44px);
            margin-bottom: 14px;
            line-height: 0.96;
          }

          .gym-beat-body {
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 20px;
            max-width: 100%;
          }

          .gym-beat-cta {
            font-size: 12px;
          }

          .gym-signature {
            display: none;
          }
        }

        /* Telas muito pequenas (375px) — ajuste fino */
        @media (max-width: 390px) {
          .gym-beat-title { font-size: 26px; }
          .gym-beat-body { font-size: 12.5px; }
        }
      `}</style>
    </div>
  )
}
