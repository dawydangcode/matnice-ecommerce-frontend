import { useEffect } from 'react';

/**
 * Custom hook to scroll to top when component mounts
 * @param smooth - Whether to use smooth scrolling (default: true)
 */
export const useScrollToTop = (smooth: boolean = true) => {
  useEffect(() => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [smooth]);
};

export default useScrollToTop;
