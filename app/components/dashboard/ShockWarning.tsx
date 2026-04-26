"use client";


function ShockWarning({ shock }: { shock?: any }) {
  if (!shock) return null;
  return (
    <div style={{
      background: 'rgba(255,140,0,0.08)',
      border: '1px solid rgba(255,140,0,0.3)',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 14,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 16, marginTop: 1 }}>⚡</span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#ffa500',
          letterSpacing: '0.1em', marginBottom: 4 }}>SECTOR SHOCK DETECTED</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.5 }}>{shock.warning}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,140,0,0.7)',
          marginTop: 4, fontWeight: 600 }}>
          ⚠ Reduce position size — correlation risk elevated
        </div>
      </div>
    </div>
  );
}

export default ShockWarning;
