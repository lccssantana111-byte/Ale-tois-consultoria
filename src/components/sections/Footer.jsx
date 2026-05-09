import { Instagram, MessageCircle } from 'lucide-react'
import { WA_LINK, INSTAGRAM_LINK } from '../../lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="footer"
      className="footer-wrapper"
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-primary)',
        padding: '48px var(--section-px)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '32px',
        }}
        className="footer-grid"
      >
        {/* Left: logo + tagline */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--accent-gold)',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            ALE TOIS
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Personal Trainer · Nutrição Esportiva
          </p>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            CREF: [PREENCHER] · São Paulo, SP
          </p>
        </div>

        {/* Center: divider line */}
        <div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(180deg, transparent, var(--border), transparent)',
          }}
        />

        {/* Right: socials + copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram do Ale Tois"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.color = 'var(--accent-gold)'
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Instagram size={17} />
            </a>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp do Ale Tois"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-gold)'
                e.currentTarget.style.color = 'var(--accent-gold)'
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <MessageCircle size={17} />
            </a>
          </div>

          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}
          >
            © {year} Ale Tois. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 20px !important;
          }
          .footer-grid > div:last-child {
            align-items: center !important;
          }
          .footer-grid > div:nth-child(2) {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .footer-wrapper {
            padding-top: 36px !important;
            padding-bottom: 36px !important;
          }
        }
      `}</style>
    </footer>
  )
}
