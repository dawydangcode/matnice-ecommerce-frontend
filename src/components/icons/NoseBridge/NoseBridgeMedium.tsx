import React from 'react';

interface NoseBridgeMediumProps {
  className?: string;
  size?: number;
}

const NoseBridgeMedium: React.FC<NoseBridgeMediumProps> = ({ className = "", size = 32 }) => (
  <svg 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" viewBox="0 0 40 40" 
  width={size} height={size} 
  className={className}
  >
    <path 
    stroke="currentColor" 
    strokeWidth={1} 
    strokeLinecap="round" 
    d="M15.5 5.5c0 19.5-6 17.5-6 23.5 0 1 0 2.5 4 4.5m11-28c0 19.5 6 17.5 6 23.5 0 1 0 2.5-4 4.5m-14-3c4.5 1 3.5 4 7.5 4s3-3 7.5-4"
    />
  </svg>
);

export default NoseBridgeMedium;
