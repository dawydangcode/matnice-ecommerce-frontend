import React from 'react';

interface ShapeProps {
  className?: string;
  size?: number;
}

const ShapeAviator: React.FC<ShapeProps> = ({ className = "", size = 20 }) => (
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
    d="M10 26c3 0 6.69-2.134 6.69-6S13 14 10 14c-5 0-7.5 3-7.5 5 0 4 3.5 7 7.5 7Z"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap='round'
    d="M16.5 18.5c.167-.667 1.1-2 3.5-2s3.333 1.333 3.5 2"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    d="M30 26c4 0 7.5-3 7.5-7 0-2-2.5-5-7.5-5-3 0-6.69 2.134-6.69 6S27 26 30 26Z"
    />
  </svg>
);

export default ShapeAviator;
