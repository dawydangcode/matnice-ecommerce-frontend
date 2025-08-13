import React from 'react';

interface ShapeSquareProps {
  className?: string;
  size?: number;
}

const ShapeSquare: React.FC<ShapeSquareProps> = ({ className = "", size = 20 }) => (
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
    d="M23.058 19.864c.934 6.363 2.803 7.636 7.078 7.636 5.21 0 7.356-1.12 7.356-7.28 0-1.87.144-4.72-.79-5.72-.932-1-4.188-1-6.531-1-2.519 0-5.6 0-6.525 1.12-1.1 1.33-.839 3.538-.588 5.244"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M22.838 17.5c0-1.105-1.27-2-2.838-2-1.567 0-2.838.895-2.838 2"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M16.942 19.864c-.934 6.363-2.803 7.636-7.078 7.636-5.21 0-7.356-1.12-7.356-7.28 0-1.87-.144-4.72.79-5.72.932-1 4.188-1 6.531-1 2.519 0 5.6 0 6.525 1.12 1.1 1.33.839 3.538.588 5.244"
    />
  </svg>
);

export default ShapeSquare;
