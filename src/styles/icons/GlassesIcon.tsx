import React from 'react';

interface GlassesIconProps {
  className?: string;
  size?: number;
}

const GlassesIcon: React.FC<GlassesIconProps> = ({ className = "", size = 24 }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
    width={size}
    height={size}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M29.288 23.758C30.94 23.324 31.5 21.84 31.5 20c0-1.695-.877-3.201-2.108-3.758m-18.68 7.516C9.06 23.324 8.5 21.84 8.5 20c0-1.695.877-3.201 2.108-3.758M20 35.5c.992 0 9.288-2.651 9.288-15.5S24.418 4.5 20 4.5 10.711 7.151 10.711 20 19.008 35.5 20 35.5"
    />
  </svg>
);

export default GlassesIcon;
