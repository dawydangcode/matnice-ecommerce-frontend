import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when component mounts or location changes
 * @param smooth - Whether to use smooth scrolling (default: true)
 */
export const useScrollToTop = (smooth: boolean = true) => {
  const location = useLocation();

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
  }, [location.pathname, location.search, smooth]);
};

export default useScrollToTop;
