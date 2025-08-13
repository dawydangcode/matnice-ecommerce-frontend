import React from 'react';

interface ShapeButterflyProps {
  className?: string;
  size?: number;
}

const ShapeButterflyAviator: React.FC<ShapeButterflyProps> = ({ className = "", size = 20 }) => (
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
    d="M17.635 17.669c.472-.558 1.354-.934 2.365-.934 1.01 0 1.893.376 2.365.934m-4.83-.392c-1.772-2.334-4.11-3.455-7.016-4.049q-4.33-.885-7.82 1.662a.5.5 0 0 0-.197.443q.95 10.695 7.123 11.597c4.124.603 6.791-2.713 8.002-9.261a.5.5 0 0 0-.092-.392m4.93 0c1.772-2.334 4.11-3.455 7.016-4.049q4.33-.885 7.82 1.662c.137.1.212.27.197.443q-.95 10.695-7.123 11.597c-4.125.603-6.791-2.713-8.002-9.261a.5.5 0 0 1 .092-.392"
    />
  </svg>
);

export default ShapeButterflyAviator;
