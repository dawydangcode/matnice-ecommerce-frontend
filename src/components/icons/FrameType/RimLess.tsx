import React from 'react';

interface RimlessProps {
  className?: string;
  size?: number;
}

const Rimless: React.FC<RimlessProps> = ({ className = "", size = 20 }) => (
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
    strokeLinejoin="round"
    d="M29.916 25c-4.143 0-5.955-.91-6.86-5.454-.244-1.218-.496-2.796.57-3.746.896-.8 3.884-.8 6.323-.8 8.051 0 7.096 3.464 7.096 4.8 0 4.4-2.08 5.2-7.13 5.2Zm-19.804 0c4.143 0 5.955-.91 6.86-5.454.243-1.218.496-2.796-.57-3.746-.897-.8-3.885-.8-6.324-.8-8.05 0-7.095 3.464-7.095 4.8 0 4.4 2.08 5.2 7.129 5.2Z"
    />
    <path
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M23 19c0-.97-1.43-2-3-2s-3 1.03-3 2m20-1h.75m-35.5 0H3"
    />

  </svg>
);

export default Rimless;
