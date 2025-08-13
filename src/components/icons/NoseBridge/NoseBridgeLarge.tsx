import React from 'react';

interface NoseBridgeLargeProps {
  className?: string;
  size?: number;
}

const NoseBridgeLarge: React.FC<NoseBridgeLargeProps> = ({ className = "", size = 32 }) => (
  <svg 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" viewBox="0 0 40 40" 
  width={size} height={size} 
  className={className}>
    <path 
    stroke="currentColor" 
    strokeWidth={1} 
    strokeLinecap="round" 
    d="M13.5 5.5c0 20.5-5 17.5-5 23.5 0 1 1 3.5 5 4.5m13-28c0 20.5 5 17.5 5 23.5 0 1-1 3.5-5 4.5m-14-3c4.5 0 3.5 4 7.5 4s3.003-3.997 7.5-4"/>
  </svg>
);

export default NoseBridgeLarge;
