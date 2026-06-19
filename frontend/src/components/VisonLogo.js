import React from 'react';
import logoOnLight from '../assets/images/Asset 1.png';
import logoOnDark from '../assets/images/Asset 2.png';

export default function VisonLogo({ size = 'md', dark = false, className = '' }) {
  const sizes = {
    sm: { width: 82, height: 42 },
    md: { width: 112, height: 54 },
    lg: { width: 180, height: 104 }
  };
  const dimensions = sizes[size] || sizes.md;

  return (
    <img
      src={dark ? logoOnDark : logoOnLight}
      alt="CyberBoxSecur"
      className={className}
      width={dimensions.width}
      height={dimensions.height}
      style={{ display: 'block', maxWidth: '100%', objectFit: 'contain' }}
    />
  );
}
