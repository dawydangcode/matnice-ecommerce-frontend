import React from 'react';

interface ShapeNarrowProps {
  className?: string;
  size?: number;
}

const ShapeNarrowAviator: React.FC<ShapeNarrowProps> = ({ className = "", size = 20 }) => (
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
    d="M17.219 18.95c.319-.604 1.443-1.45 2.781-1.45s2.462.846 2.781 1.45m7.308 4.55c-4.303 0-6.184-.636-7.125-3.818-.252-.853-.514-1.957.593-2.622.931-.56 4.031-.56 6.566-.56 2.359 0 5.635.3 6.574.5s.795 1.925.795 2.86c0 3.08-.992 3.64-7.403 3.64Zm-20.178 0c4.303 0 6.184-.636 7.124-3.818.253-.853.515-1.957-.592-2.622-.931-.56-4.031-.56-6.566-.56-2.359 0-5.635.3-6.575.5-.939.2-.794 1.925-.794 2.86 0 3.08.992 3.64 7.403 3.64Z"
    />
  </svg>
);

export default ShapeNarrowAviator;
