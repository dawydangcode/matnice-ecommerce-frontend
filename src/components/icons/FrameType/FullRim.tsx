import React from 'react';

interface FullRimProps {
  className?: string;
  size?: number;
}

const FullRim: React.FC<FullRimProps> = ({ className = "", size = 20 }) => (
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
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M22.78 18.758C22.78 17.787 21.537 17 20 17s-2.78.787-2.78 1.758M36.763 18h.986m-35.5 0h.986m26.456 7c-4.089 0-5.876-.91-6.77-5.454-.24-1.218-.489-2.796.563-3.746.885-.8 3.833-.8 6.24-.8 7.944 0 7.009 2 7.001 4.8-.012 4.4-2.052 5.2-7.034 5.2m-19.384 0c4.089 0 5.876-.91 6.77-5.454.24-1.218.489-2.796-.563-3.746-.885-.8-3.833-.8-6.24-.8-7.944 0-7.009 2-7.001 4.8.012 4.4 2.052 5.2 7.034 5.2"
    />

  </svg>
);

export default FullRim;
