export function SectionLabel({ children, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        ...style,
      }}
    >
      <span
        style={{
          display: 'block',
          width: '32px',
          height: '1px',
          background: 'var(--accent-gold)',
        }}
      />
      <span className="text-label">{children}</span>
    </div>
  )
}
