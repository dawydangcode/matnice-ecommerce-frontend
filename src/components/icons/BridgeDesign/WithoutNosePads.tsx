import React from 'react';

interface WithoutNosePadsProps {
  className?: string;
  size?: number;
}

const WithoutNosePads: React.FC<WithoutNosePadsProps> = ({ className = "", size = 20 }) => (
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
    d="M25 15.167c0-2.136-2.239-3.867-5-3.867s-5 1.731-5 3.867m10 0c0 4.81 5.442 14.937 14 18.255M25 15.167c0-5.517 3.543-9.285 14-9.64V5.5H1v.027c10.457.355 14 4.123 14 9.64m0 0c0 4.81-5.442 14.937-14 18.255"
    />

  </svg>
);

export default WithoutNosePads;
