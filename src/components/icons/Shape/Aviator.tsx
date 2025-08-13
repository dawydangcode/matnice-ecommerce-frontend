import React from 'react';

interface ShapeAviatorProps {
  className?: string;
  size?: number;
}

const ShapeAviator: React.FC<ShapeAviatorProps> = ({ className = "", size = 20 }) => (
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
    d="M37.182 17.233c-.926-3.733-5.556-3.733-7.408-3.733-5.557 0-7.41 1.867-7.41 4.667s3.744 9.333 9.3 9.333 6.444-6.533 5.518-10.267Zm-34.364 0C3.744 13.5 8.374 13.5 10.226 13.5c5.557 0 7.41 1.867 7.41 4.667s-3.744 9.333-9.3 9.333-6.445-6.533-5.518-10.267Z"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M22.365 18.166c0-1.03-1.059-1.866-2.365-1.866s-2.365.835-2.365 1.866"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M22.365 18.166c0-1.03-1.059-1.866-2.365-1.866s-2.365.835-2.365 1.866"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    d="M10.54 13.5h18.92"
    />
  </svg>
);

export default ShapeAviator;
