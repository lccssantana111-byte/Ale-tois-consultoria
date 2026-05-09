export function Badge({ children, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        border: '1px solid var(--border-gold)',
        borderRadius: '100px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--accent-gold)',
        background: 'rgba(201, 168, 76, 0.06)',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
