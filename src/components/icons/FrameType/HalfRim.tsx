import React from 'react';

interface HalfRimProps {
  className?: string;
  size?: number;
}

const HalfRim: React.FC<HalfRimProps> = ({ className = "", size = 20 }) => (
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
    d="M29.834 25c-4.143 0-5.955-.91-6.861-5.454-.243-1.218-.495-2.796.57-3.746.897-.8 3.885-.8 6.324-.8 8.05 0 7.096 3.464 7.096 4.8 0 4.4-2.08 5.2-7.13 5.2Zm-19.67 0c4.143 0 5.955-.91 6.86-5.454.244-1.218.496-2.796-.57-3.746-.896-.8-3.884-.8-6.323-.8-8.051 0-7.096 3.464-7.096 4.8 0 4.4 2.08 5.2 7.13 5.2Z"
    />
    <path
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M22.973 19.546c-.243-1.218-.495-2.796.57-3.746.897-.8 3.885-.8 6.324-.8 8.05 0 7.096 3.464 7.096 4.8m-19.938-.255c.243-1.218.495-2.795-.57-3.745-.897-.8-3.885-.8-6.324-.8-8.051 0-7.096 3.464-7.096 4.8m19.8-1.042c0-.971-1.273-1.758-2.843-1.758s-2.842.787-2.842 1.758M37 18h1M2 18h1"
    />
  </svg>
);

export default HalfRim;
