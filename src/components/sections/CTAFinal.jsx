import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { WA_LINK } from '../../lib/constants'
import { supabase } from '../../lib/supabase'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const GOALS = ['Emagrecer', 'Ganhar massa', 'Saúde', 'Performance']

function ContactForm() {
  const [values, setValues] = useState({ nome: '', whatsapp: '', objetivo: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!values.nome || !values.whatsapp || !values.objetivo) return

    if (supabase) {
      await supabase.from('leads').insert({
        nome: values.nome,
        whatsapp: values.whatsapp,
        objetivo: values.objetivo,
      })
    }

    const text = encodeURIComponent(
      `Olá, Ale! Vi seu site e tenho interesse na consultoria.\nMeu objetivo é: ${values.objetivo}\nMeu nome: ${values.nome}\nMeu WhatsApp: ${values.whatsapp}\nPode me contar mais sobre como funciona?`
    )
    window.open(`https://wa.me/5511947746827?text=${text}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 16px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  }

  if (sent) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 32px',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(201,168,76,0.06)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--accent-gold)' }}>
          Perfeito!
        </p>
        <p className="text-body" style={{ marginTop: '12px' }}>
          Te redirecionamos para o WhatsApp. O Ale entrará em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label
          htmlFor="nome"
          style={{ display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}
        >
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          placeholder="Seu nome completo"
          value={values.nome}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div>
        <label
          htmlFor="whatsapp"
          style={{ display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}
        >
          WhatsApp
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          placeholder="(11) 99999-9999"
          value={values.whatsapp}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div>
        <label
          htmlFor="objetivo"
          style={{ display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}
        >
          Objetivo
        </label>
        <select
          id="objetivo"
          name="objetivo"
          required
          value={values.objetivo}
          onChange={handleChange}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        >
          <option value="" disabled>Selecione seu objetivo</option>
          {GOALS.map((g) => (
            <option key={g} value={g} style={{ background: 'var(--bg-card)' }}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="primary"
        style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: '8px' }}
      >
        <Send size={16} />
        Enviar e conversar no WhatsApp
      </Button>
    </form>
  )
}

export function CTAFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="contato"
      className="section"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201, 168, 76, 0.06) 0%, transparent 70%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Top divider */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 'var(--section-px)',
          right: 'var(--section-px)',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent-gold-dk), transparent)',
          opacity: 0.4,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
          className="cta-grid"
        >
          {/* Left: copy */}
          <div>
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  boxShadow: '0 0 12px var(--accent-gold)',
                }}
              />
              Vagas limitadas por mês
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-display-lg cta-title"
              style={{ color: 'var(--text-primary)', marginBottom: '24px' }}
            >
              PRONTO PARA TRANSFORMAR SEU CORPO?
            </motion.h2>

            <motion.p variants={fadeUp} className="text-body-lg" style={{ marginBottom: '40px' }}>
              O próximo passo é simples. Entre em contato agora e descubra como
              um método personalizado pode mudar a sua história.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Button
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                style={{ padding: '18px 36px', fontSize: '15px' }}
              >
                <MessageCircle size={18} />
                Falar com o Ale agora
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUp}
              style={{
                marginTop: '20px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
              }}
            >
              Resposta em até 24h · Atendimento híbrido em SP e online
            </motion.p>
          </div>

          {/* Right: form */}
          <motion.div
            variants={fadeUp}
            className="cta-form-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              Ou preencha o formulário
            </p>
            <p className="text-body" style={{ marginBottom: '28px' }}>
              Envie seus dados e o Ale entrará em contato para uma conversa inicial gratuita.
            </p>
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cta-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 768px) {
          .cta-form-card { padding: 24px !important; }
          .cta-title { font-size: 40px !important; line-height: 1 !important; }
          .cta-grid { gap: 36px !important; }
        }
        @media (max-width: 480px) {
          .cta-form-card { padding: 20px !important; }
          .cta-title { font-size: 34px !important; }
        }
      `}</style>
    </section>
  )
}
