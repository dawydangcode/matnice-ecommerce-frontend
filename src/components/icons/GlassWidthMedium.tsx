import React from 'react';

interface GlassWidthMediumProps {
  className?: string;
  size?: number;
}

const GlassWidthMedium: React.FC<GlassWidthMediumProps> = ({ className = "", size = 24 }) => (
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
      d="M31.09 23.758c1.8-.434 2.41-1.98 2.41-3.82 0-1.694-.956-3.14-2.297-3.696M8.91 23.758c-1.8-.434-2.411-1.98-2.411-3.82 0-1.694.956-3.14 2.298-3.696M20 35.5c1.184 0 11.09-2.651 11.09-15.5S25.275 4.5 20 4.5 8.91 7.151 8.91 20 18.817 35.5 20 35.5"
    />
  </svg>
);

export default GlassWidthMedium;
