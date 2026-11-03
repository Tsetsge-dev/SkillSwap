import React from 'react';

const BrandLogo = ({ className = '', style, ...props }) => (
  <img
    src="/logo.jpg"
    alt="SkillSwap"
    className={`block object-contain mix-blend-multiply ${className}`.trim()}
    style={{ filter: 'hue-rotate(-28deg) saturate(.76)', ...style }}
    {...props}
  />
);

export default BrandLogo;

