"use client";


function MTFBar({ mtf, direction }: { mtf?: any, direction?: string }) {
  if (!mtf) return null;
  const details = mtf.mtf_details || {};
  const score = mtf.mtf_score_with_daily ?? mtf.mtf_score ?? 0;
  const tfs = [
    { label: '15m', val: details['15m'] },
    { label: '1H',  val: details['1h'] },
    { label: '4H',  val: details['4h'] },
    { label: '1D',  val: details['1d'] },
  ];
  const filled = Math.round(score);
  const barColor = score >= 3 ? '#00ff88' : score >= 2 ? '#ffc800' : '#ff4466';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>MTF ALIGNMENT</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: barColor }}>{score}/4 timeframes bullish</span>
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < filled ? barColor : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {tfs.map(tf => {
          const bull = tf.val === 'BULL';
          const neutral = tf.val === 'NEUTRAL' || !tf.val;
          return (
            <div key={tf.label} style={{ flex: 1, background: bull ? 'rgba(0,255,136,0.07)' : neutral ? 'rgba(255,255,255,0.03)' : 'rgba(255,68,102,0.07)', border: `1px solid ${bull ? 'rgba(0,255,136,0.2)' : neutral ? 'rgba(255,255,255,0.06)' : 'rgba(255,68,102,0.2)'}`, borderRadius: 5, padding: '5px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>{tf.label}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: bull ? '#00ff88' : neutral ? 'rgba(255,255,255,0.3)' : '#ff4466' }}>
                {bull ? '▲' : neutral ? '—' : '▼'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MTFBar;
