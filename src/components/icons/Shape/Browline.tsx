import React from 'react';

interface ShapeBrowlineProps {
  className?: string;
  size?: number;
}

const ShapeBrowline: React.FC<ShapeBrowlineProps> = ({ className = "", size = 20 }) => (
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
    d="M22.924 18c0-1.105-1.357-2-2.924-2s-2.924.895-2.924 2m13.1 9c-4.251 0-6.11-1.182-7.04-7.09-.249-1.584-.508-3.634.586-4.87C24.642 14 27.706 14 30.21 14c2.331 0 5.569 0 6.497.929.928.928.785 3.574.785 5.311 0 5.72-2.134 6.76-7.315 6.76ZM9.825 27c4.251 0 6.11-1.182 7.04-7.09.249-1.584.508-3.634-.586-4.87C15.358 14 12.294 14 9.79 14c-2.331 0-5.569 0-6.497.929-.928.928-.785 3.574-.785 5.311 0 5.72 2.134 6.76 7.316 6.76Z"
    />
    <path
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    d="M22.92 17.483c.025-.916.226-1.792.802-2.443C24.643 14 27.71 14 30.217 14c2.333 0 5.574 0 6.503.929.572.571.737 1.794.78 3.055m-20.42-.501c-.025-.916-.226-1.792-.802-2.443C15.357 14 12.29 14 9.783 14c-2.333 0-5.574 0-6.503.929-.572.571-.737 1.794-.78 3.055"
    />
  </svg>
);

export default ShapeBrowline;
