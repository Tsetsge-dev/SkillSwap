import React from 'react';

const BrandLogo = ({ className = '', style, ...props }) => (
  <img
    src="/skillswap-logo.svg"
    alt="SkillSwap"
    className={`block object-contain ${className}`.trim()}
    style={style}
    {...props}
  />
);

export default BrandLogo;

