import React from 'react';

const BrandLogo = ({ className = '', ...props }) => (
  <img
    src="/logo.jpg"
    alt="SkillSwap"
    className={`block object-contain ${className}`.trim()}
    {...props}
  />
);

export default BrandLogo;
