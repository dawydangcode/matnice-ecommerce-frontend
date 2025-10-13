import { useEffect, useState } from 'react';
import { useWishlistStore } from '../stores/wishlist.store';
import { useAuthStore } from '../stores/auth.store';

export const useWishlistCount = () => {
  const { totalItems, fetchWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id, fetchWishlist]);

  useEffect(() => {
    setCount(user?.id ? totalItems : 0);
  }, [user?.id, totalItems]);

  return count;
};
