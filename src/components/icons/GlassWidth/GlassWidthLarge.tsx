import React from 'react';

interface GlassWidthLargeProps {
  className?: string;
  size?: number;
}

const GlassWidthLarge: React.FC<GlassWidthLargeProps> = ({ className = "", size = 28 }) => (
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
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M33.078 23.758c1.81-.434 2.422-1.98 2.422-3.82 0-1.694-.96-3.14-2.308-3.696m-26.27 7.516c-1.81-.434-2.422-1.98-2.422-3.82 0-1.694.96-3.14 2.308-3.696M20 35.5c1.397 0 13.078-2.651 13.078-15.5S26.222 4.5 20 4.5 6.922 7.151 6.922 20 18.603 35.5 20 35.5"
    />
  </svg>
);

export default GlassWidthLarge;
