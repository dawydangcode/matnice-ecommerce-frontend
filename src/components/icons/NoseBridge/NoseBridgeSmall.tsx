import React from 'react';

interface NoseBridgeSmallProps {
  className?: string;
  size?: number;
}

const NoseBridgeSmall: React.FC<NoseBridgeSmallProps> = ({ className = "", size = 20 }) => (
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
    d="M16.5 5.5c0 18.5-5 18.5-5 24.5 0 1 0 2.5 3 4.5m9-29c0 18.5 5 18.5 5 24.5 0 1 0 2.5-3 4.5m-11-3c2.5 1 2.46 3 5.5 3s3-2 5.5-3"
    />
  </svg>
);

export default NoseBridgeSmall;
