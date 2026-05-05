import React from 'react';

export default function VisonLogo({ size = 'md', dark = false }) {
  const sizes = { sm: { vis: '1rem', badge: '0.6rem', dot: 12 }, md: { vis: '1.4rem', badge: '0.7rem', dot: 14 }, lg: { vis: '2rem', badge: '0.95rem', dot: 18 } };
  const s = sizes[size];
  const bg = dark ? '#0d1117' : '#fff';
  const textColor = dark ? '#fff' : '#0d1117';
  const dotColor = dark ? '#fff' : '#0d1117';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: s.vis, color: dark ? '#fff' : '#0d1117', letterSpacing: '-0.02em' }}>VIS</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', background: bg, borderRadius: 20, padding: `2px 8px 2px 6px`, gap: 3, border: dark ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: s.badge, color: textColor, letterSpacing: '0.05em' }}>ON</span>
        <span style={{ width: s.dot, height: s.dot, background: dotColor, borderRadius: '50%', display: 'inline-block', marginLeft: 2 }} />
      </span>
    </span>
  );
}
