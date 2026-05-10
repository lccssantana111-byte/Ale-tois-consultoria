import { useRef, useEffect } from 'react'
import { getLenis } from '../../lib/lenis'
import { WA_LINK } from '../../lib/constants'

const FRAMES_BASE = '/media/Gym_facade_animation_reveal_202605101031_frames/'
const FRAMES_NAME = 'Gym_facade_animation_reveal_202605101031_'
const TOTAL_FRAMES = 144

const frameUrl = (i) =>
  `${FRAMES_BASE}${FRAMES_NAME}${String(i + 1).padStart(3, '0')}.jpg`

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
  const wrapperRef    = useRef(null)
  const canvasDesktop = useRef(null)
  const canvasMobile  = useRef(null)
  const imagesRef     = useRef([])
  const frameIdxRef   = useRef(0)
  const rafRef        = useRef(null)
  const beatRefs      = [useRef(null), useRef(null), useRef(null)]
  const beatMobileRefs = [useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const isMobile   = window.innerWidth < 768
    const frameCount = isMobile ? Math.ceil(TOTAL_FRAMES / 2) : TOTAL_FRAMES
    const urlFor     = isMobile ? (j) => frameUrl(j * 2) : frameUrl

    function drawOnCanvas(c, idx) {
      if (!c) return
      const ctx = c.getContext('2d')
      if (!ctx) return
      const img = imagesRef.current[idx]
      if (!img || !img.complete || img.naturalWidth === 0) return
      const w = c.width, h = c.height
      if (!w || !h) return
      const ia = img.naturalWidth / img.naturalHeight
      const ca = w / h
      let sx, sy, sw, sh
      if (ia > ca) {
        sh = img.naturalHeight; sw = sh * ca
        sx = (img.naturalWidth - sw) / 2; sy = 0
      } else {
        sw = img.naturalWidth; sh = sw / ca
        sx = 0; sy = (img.naturalHeight - sh) / 2
      }
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
    }

    // desenha no canvas visível (ambos se ambos tiverem tamanho)
    function drawFrame(idx) {
      drawOnCanvas(canvasDesktop.current, idx)
      drawOnCanvas(canvasMobile.current, idx)
    }

    // Preload
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

    // Resize — sincroniza os dois canvas com seus tamanhos CSS reais
    function resizeCanvas(c) {
      if (!c) return false
      const rect = c.getBoundingClientRect()
      const dpr  = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(rect.width  * dpr)
      const h = Math.round(rect.height * dpr)
      if (!w || !h || (w === c.width && h === c.height)) return false
      c.width  = w
      c.height = h
      return true
    }
    function resize() {
      resizeCanvas(canvasDesktop.current)
      resizeCanvas(canvasMobile.current)
      drawFrame(frameIdxRef.current)
    }
    const ro = new ResizeObserver(resize)
    if (canvasDesktop.current) ro.observe(canvasDesktop.current)
    if (canvasMobile.current)  ro.observe(canvasMobile.current)
    resize()
    const layoutTimer = setTimeout(resize, 120)

    // Scroll
    function onScroll() {
      const scrollY = window.scrollY
      const top     = wrapper.getBoundingClientRect().top + scrollY
      const range   = wrapper.offsetHeight - window.innerHeight
      if (range <= 0) return
      const p = Math.min(Math.max((scrollY - top) / range, 0), 1)

      const idx = Math.min(Math.round(p * (frameCount - 1)), frameCount - 1)
      if (idx !== frameIdxRef.current) {
        frameIdxRef.current = idx
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(idx))
      }

      BEATS.forEach((beat, i) => {
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
        const y = `translateY(${(1 - Math.min(alpha * 1.5, 1)) * 22}px)`
        // anima desktop e mobile refs em paralelo
        ;[beatRefs[i], beatMobileRefs[i]].forEach(r => {
          if (!r.current) return
          r.current.style.opacity   = alpha
          r.current.style.transform = y
        })
      })

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
    <div ref={wrapperRef} id="legado" className="gym-wrapper" style={{ height: '420vh', position: 'relative' }}>

      {/* ── DESKTOP: split 50/50 ── */}
      <div className="gym-sticky gym-sticky--desktop">

        {/* Esquerda: canvas contido em 16:9 */}
        <div className="gym-frame-col">
          <div className="gym-canvas-wrap">
            <canvas ref={canvasDesktop} className="gym-canvas" />
            <div className="gym-frame-edge-overlay" aria-hidden="true" />
            <div className="gym-frame-overlay" aria-hidden="true" />
            <div className="gym-frame-border" aria-hidden="true" />
          </div>
          <div className="gym-frame-footer">
            <span className="gym-frame-credit">Academia Gaviões · São Paulo</span>
          </div>
        </div>

        {/* Direita: texto */}
        <div className="gym-text-col">
          <div className="gym-progress-line">
            <div className="gym-line-fill" />
          </div>
          <div className="gym-beats-wrap">
            {BEATS.map((beat, i) => (
              <div key={i} ref={beatRefs[i]} className="gym-beat" style={{ opacity: 0, transform: 'translateY(22px)' }}>
                <p className="gym-beat-eyebrow">{beat.eyebrow}</p>
                <h2 className="gym-beat-title">
                  {beat.title.split('\n').map((line, j) => (
                    <span key={j} className="gym-beat-title-line">{line}</span>
                  ))}
                </h2>
                <p className="gym-beat-body">{beat.body}</p>
                {beat.cta && (
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="gym-beat-cta">
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
          <div className="gym-signature">
            <span className="gym-signature-name">ALE TOIS</span>
            <span className="gym-signature-title">Personal Trainer &amp; Consultor</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE: frame natural 16:9 + texto abaixo ── */}
      <div className="gym-mobile-wrap">

        {/* Canvas 16:9 sticky — fica fixo no topo enquanto o texto rola */}
        <div className="gym-mobile-frame-sticky">
          <canvas ref={canvasMobile} className="gym-canvas-mobile" />
          <div className="gym-frame-overlay" aria-hidden="true" />
          <div className="gym-frame-border" style={{ borderRadius: 0 }} aria-hidden="true" />
        </div>

        {/* Texto abaixo do frame — cada beat em bloco separado */}
        <div className="gym-mobile-beats">
          {BEATS.map((beat, i) => (
            <div key={i} ref={beatMobileRefs[i]} className="gym-mobile-beat-block" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
              <p className="gym-beat-eyebrow gym-beat-eyebrow--mobile">{beat.eyebrow}</p>
              <h2 className="gym-beat-title gym-beat-title--mobile">
                {beat.title.split('\n').map((line, j) => (
                  <span key={j} className="gym-beat-title-line">{line}</span>
                ))}
              </h2>
              <p className="gym-beat-body gym-beat-body--mobile">{beat.body}</p>
              {beat.cta && (
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="gym-beat-cta gym-beat-cta--mobile">
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
      </div>

      <style>{`
        /* ── Sticky base ── */
        .gym-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        /* ── Desktop: split 50/50 ── */
        .gym-sticky--desktop {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .gym-sticky--mobile { display: none; }
        .gym-mobile-wrap    { display: none; }

        /* ── Coluna esquerda: frame ── */
        .gym-frame-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: clamp(24px, 4vw, 56px);
          gap: 14px;
        }

        .gym-canvas-wrap {
          position: relative;
          width: 100%;
          max-height: calc(100vh - 120px);
          aspect-ratio: 16 / 9;
          max-width: calc((100vh - 120px) * 16 / 9);
          border-radius: 10px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.15),
            0 24px 80px rgba(0,0,0,0.7);
        }
        .gym-canvas { display: block; width: 100%; height: 100%; }

        .gym-frame-edge-overlay {
          position: absolute; top: 0; right: 0;
          width: 80px; height: 100%;
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.5));
          pointer-events: none;
        }
        .gym-frame-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.45) 100%);
          pointer-events: none;
        }
        .gym-frame-border {
          position: absolute; inset: 0;
          border-radius: 10px;
          border: 1px solid rgba(201,168,76,0.2);
          pointer-events: none;
        }
        .gym-frame-footer { align-self: flex-start; }
        .gym-frame-credit {
          font-family: var(--font-body);
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #777;
        }

        /* ── Coluna direita: texto ── */
        .gym-text-col {
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(48px, 8vh, 100px) clamp(32px, 5vw, 72px) clamp(48px, 8vh, 100px) clamp(24px, 3vw, 48px);
          position: relative;
          border-left: 1px solid rgba(255,255,255,0.08);
        }
        .gym-progress-line {
          position: absolute; left: -1px; top: 20%; height: 60%; width: 2px;
          background: rgba(201,168,76,0.18); overflow: hidden;
        }
        .gym-line-fill {
          width: 100%; height: 0%;
          background: linear-gradient(to bottom, var(--accent-gold-dk), var(--accent-gold));
        }
        .gym-beats-wrap {
          position: relative; flex: 1;
          display: flex; align-items: center;
        }
        .gym-beat {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: center;
          will-change: opacity, transform;
        }
        .gym-beat-eyebrow {
          font-family: var(--font-body);
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .gym-beat-eyebrow::before {
          content: ''; display: block;
          width: 24px; height: 1px;
          background: var(--accent-gold); flex-shrink: 0;
        }
        .gym-beat-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 5.5vw, 80px);
          line-height: 0.93; letter-spacing: 0.02em;
          color: var(--text-primary);
          margin-bottom: 28px;
          display: flex; flex-direction: column;
        }
        .gym-beat-title-line { display: block; }
        .gym-beat-body {
          font-family: var(--font-body);
          font-size: clamp(15px, 1.2vw, 18px);
          line-height: 1.75; color: #C8C8C8;
          max-width: 400px; margin-bottom: 36px;
        }
        .gym-beat-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-body);
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--accent-gold); text-decoration: none;
          transition: gap 0.2s ease, opacity 0.2s ease;
        }
        .gym-beat-cta:hover { gap: 14px; opacity: 0.85; }
        .gym-beat-cta-dot {
          display: block; width: 7px; height: 7px;
          border-radius: 50%; background: var(--accent-gold);
          box-shadow: 0 0 10px var(--accent-gold); flex-shrink: 0;
        }
        .gym-signature {
          display: flex; flex-direction: column; gap: 4px;
          padding-top: 32px; border-top: 1px solid var(--border);
        }
        .gym-signature-name {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 32px);
          letter-spacing: 0.1em; color: rgba(201,168,76,0.85); line-height: 1;
        }
        .gym-signature-title {
          font-family: var(--font-body);
          font-size: 11px; letter-spacing: 0.14em;
          text-transform: uppercase; color: #888;
        }

        /* ── Mobile: mesmo sticky, grid empilhado ── */
        @media (max-width: 768px) {
          /* Scroll range reduzido: ~1 rolagem por beat */
          .gym-wrapper { height: 220vh !important; }

          /* Grid vira 1 coluna: frame em cima (45vh), texto embaixo (55vh) */
          .gym-sticky--desktop {
            grid-template-columns: 1fr !important;
            grid-template-rows: 45vh 55vh !important;
          }

          /* Frame col: sem padding lateral, canvas preenche toda a largura */
          .gym-frame-col {
            padding: 0 !important;
            gap: 0 !important;
            align-items: stretch !important;
          }
          .gym-canvas-wrap {
            width: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            aspect-ratio: unset !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            height: 100% !important;
          }
          .gym-frame-footer  { display: none !important; }
          .gym-frame-border  { border-radius: 0 !important; }

          /* Coluna de texto: padding ajustado, sem borda lateral */
          .gym-text-col {
            padding: 20px 24px 24px !important;
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            justify-content: center !important;
          }
          .gym-progress-line { display: none !important; }
          .gym-signature     { display: none !important; }

          /* Beats com tipografia mobile — centralizado */
          .gym-text-col { align-items: center !important; text-align: center !important; }
          .gym-beats-wrap { width: 100% !important; }
          .gym-beat { align-items: center !important; }
          .gym-beat-eyebrow {
            margin-bottom: 14px !important;
            justify-content: center !important;
          }
          .gym-beat-eyebrow::before { display: none !important; }
          .gym-beat-title {
            font-size: clamp(48px, 12vw, 68px) !important;
            margin-bottom: 18px !important;
            align-items: center !important;
          }
          .gym-beat-title-line { display: inline !important; }
          .gym-beat-title-line:not(:last-child)::after { content: ' ' !important; }
          .gym-beat-body {
            font-size: 16px !important;
            line-height: 1.65 !important;
            margin-bottom: 24px !important;
            max-width: 100% !important;
            text-align: center !important;
          }
          .gym-beat-cta { justify-content: center !important; }
        }
      `}</style>
    </div>
  )
}
