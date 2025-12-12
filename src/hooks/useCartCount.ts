import { useState, useEffect } from 'react';
import { localCartService } from '../services/localCart.service';

export const useCartCount = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initialize cart count
    const updateCartCount = () => {
      setCartCount(localCartService.getCartCount());
    };

    // Set initial count
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = (event: CustomEvent) => {
      // Safely handle event detail
      const count = event.detail?.count ?? 0;
      setCartCount(count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    // Also listen for storage changes (for cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'matnice_cart_count') {
        setCartCount(parseInt(event.newValue || '0'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(
        'cartUpdated',
        handleCartUpdate as EventListener,
      );
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return cartCount;
};
