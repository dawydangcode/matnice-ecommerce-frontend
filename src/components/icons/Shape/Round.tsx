import React from 'react';

interface ShapeRoundProps {
  className?: string;
  size?: number;
}

const ShapeRoundAviator: React.FC<ShapeRoundProps> = ({ className = "", size = 20 }) => (
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
    d="M30.405 27c3.919 0 7.095-3.134 7.095-7s-3.176-7-7.095-7-7.094 3.134-7.094 7 3.176 7 7.094 7Z"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    strokeLinecap="round"
    d="M16.5 18c.333-.667 1.5-1.5 3.5-1.5s3.167 1 3.5 1.5"
    />
    <path
    stroke="currentColor"
    strokeWidth={1}
    d="M9.595 27c3.918 0 7.094-3.134 7.094-7s-3.176-7-7.094-7S2.5 16.134 2.5 20s3.176 7 7.095 7Z"
    />
  </svg>
);

export default ShapeRoundAviator;
