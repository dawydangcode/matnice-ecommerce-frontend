import React from 'react';

interface ShapeRectangleProps {
  className?: string;
  size?: number;
}

const ShapeRectangle: React.FC<ShapeRectangleProps> = ({ className = "", size = 20 }) => (
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
    d="M17.219 18.5c.319-.863 1.443-1.5 2.781-1.5s2.462.637 2.781 1.5M30.09 25c-4.303 0-6.184-.91-7.125-5.454-.252-1.218-.514-2.796.593-3.746.931-.8 4.031-.8 6.566-.8 2.359 0 5.635.429 6.574.714.94.286.795 2.75.795 4.086 0 4.4-2.16 5.2-7.403 5.2ZM9.91 25c4.303 0 6.184-.91 7.124-5.454.253-1.218.515-2.796-.592-3.746-.931-.8-4.031-.8-6.566-.8-2.359 0-5.635.429-6.575.714-.939.286-.794 2.75-.794 4.086 0 4.4 2.16 5.2 7.403 5.2Z"
    />
  </svg>
);

export default ShapeRectangle;
