import React from 'react';

interface ShapeBrowlineProps {
  className?: string;
  size?: number;
}

const ShapeBrowlineAviator: React.FC<ShapeBrowlineProps> = ({ className = "", size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 40 40"
    role="img"
    className={className}
    width={size}
    height={size}
  >
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    d=""
    />
  </svg>
);

export default ShapeBrowlineAviator;
