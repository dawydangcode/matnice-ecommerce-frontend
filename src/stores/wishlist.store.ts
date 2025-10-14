import { create } from 'zustand';
import wishlistService, { WishlistItem } from '../services/wishlist.service';
import { useAuthStore } from './auth.store';

interface WishlistStore {
  items: WishlistItem[];
  totalItems: number;
  loading: boolean;
  error: string | null;

  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (
    itemType: 'product' | 'lens',
    itemId: number,
    selectedColorId?: number,
  ) => Promise<void>;
  removeFromWishlist: (wishlistItemId: number) => Promise<void>;
  removeItemByProductId: (
    itemType: 'product' | 'lens',
    itemId: number,
    selectedColorId?: number,
  ) => Promise<void>;
  checkItemInWishlist: (
    itemType: 'product' | 'lens',
    itemId: number,
  ) => Promise<boolean>;
  clearWishlist: () => void;
  isItemInWishlist: (
    itemType: 'product' | 'lens',
    itemId: number,
    selectedColorId?: number,
  ) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  totalItems: 0,
  loading: false,
  error: null,

  fetchWishlist: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.log('[WishlistStore] No user found, skipping fetch');
      return;
    }

    set({ loading: true, error: null });
    try {
      console.log('[WishlistStore] Fetching wishlist for user:', user.id);
      const response = await wishlistService.getWishlist();
      console.log('[WishlistStore] Raw API response:', response);
      console.log('[WishlistStore] Response.data:', response.data);
      console.log('[WishlistStore] Response.total:', response.total);
      
      const validItems = (response.data || []).filter((item) => {
        const isValid = item != null;
        if (!isValid) {
          console.log('[WishlistStore] Filtering out null item:', item);
        }
        return isValid;
      });
      
      console.log(
        '[WishlistStore] Fetched wishlist:',
        validItems.length,
        'items',
        validItems,
      );
      set({
        items: validItems,
        totalItems: response.total || validItems.length,
        loading: false,
      });
    } catch (error) {
      console.error('[WishlistStore] Error fetching wishlist:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch wishlist',
        loading: false,
      });
    }
  },

  addToWishlist: async (
    itemType: 'product' | 'lens',
    itemId: number,
    selectedColorId?: number,
  ) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error('Please login to add items to wishlist');
    }

    set({ loading: true, error: null });
    try {
      const data = {
        itemType,
        ...(itemType === 'product'
          ? { productId: itemId }
          : { lensId: itemId }),
        ...(selectedColorId && { selectedColorId }),
      };

      console.log('[WishlistStore] Adding to wishlist:', data);
      const newItem = await wishlistService.addToWishlist(data);
      console.log('[WishlistStore] Added item:', newItem);

      const currentItems = get().items || [];
      const validItems = currentItems.filter((item) => item != null);
      console.log(
        '[WishlistStore] Current items before add:',
        validItems.length,
      );
      set({
        items: newItem ? [newItem, ...validItems] : validItems,
        totalItems: newItem ? validItems.length + 1 : validItems.length,
        loading: false,
      });
      console.log(
        '[WishlistStore] Updated wishlist, total items:',
        newItem ? validItems.length + 1 : validItems.length,
      );
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);

      // If it's a 409 conflict (item already exists), re-fetch the wishlist to sync state
      if (error?.response?.status === 409) {
        await get().fetchWishlist();
        throw new Error('Item already in wishlist');
      }

      set({
        error:
          error instanceof Error ? error.message : 'Failed to add to wishlist',
        loading: false,
      });
      throw error;
    }
  },

  removeFromWishlist: async (wishlistItemId: number) => {
    set({ loading: true, error: null });
    try {
      await wishlistService.removeFromWishlist(wishlistItemId);

      const currentItems = get().items || [];
      const updatedItems = currentItems.filter(
        (item) => item.id !== wishlistItemId,
      );

      set({
        items: updatedItems,
        totalItems: updatedItems.length,
        loading: false,
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to remove from wishlist',
        loading: false,
      });
      throw error;
    }
  },

  removeItemByProductId: async (
    itemType: 'product' | 'lens',
    itemId: number,
    selectedColorId?: number,
  ) => {
    const items = get().items || [];
    const itemToRemove = items.find((item) => {
      if (!item || item.itemType !== itemType) return false;

      if (itemType === 'product') {
        // Ensure both values are numbers for comparison
        const itemProductId =
          typeof item.productId === 'string'
            ? parseInt(item.productId)
            : item.productId;
        const matchesProduct = itemProductId === itemId;
        if (selectedColorId) {
          return matchesProduct && item.selectedColorId === selectedColorId;
        }
        return matchesProduct;
      }

      if (itemType === 'lens') {
        return item.lensId === itemId;
      }

      return false;
    });

    if (itemToRemove) {
      await get().removeFromWishlist(itemToRemove.id);
    }
  },

  checkItemInWishlist: async (itemType: 'product' | 'lens', itemId: number) => {
    try {
      return await wishlistService.checkItemInWishlist(itemType, itemId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  isItemInWishlist: (
    itemType: 'product' | 'lens',
    itemId: number,
    selectedColorId?: number,
  ) => {
    const items = get().items || [];
    console.log(
      '[WishlistStore] Checking if item is in wishlist:',
      itemType,
      itemId,
      'Total items:',
      items.length,
    );
    const result = items.some((item) => {
      if (!item || item.itemType !== itemType) return false;

      if (itemType === 'product') {
        // Ensure both values are numbers for comparison
        const itemProductId =
          typeof item.productId === 'string'
            ? parseInt(item.productId)
            : item.productId;
        const matchesProduct = itemProductId === itemId;
        console.log(
          '[WishlistStore] Comparing product:',
          itemProductId,
          '===',
          itemId,
          '=',
          matchesProduct,
        );
        if (selectedColorId) {
          return matchesProduct && item.selectedColorId === selectedColorId;
        }
        return matchesProduct;
      }

      if (itemType === 'lens') {
        const itemLensId =
          typeof item.lensId === 'string' ? parseInt(item.lensId) : item.lensId;
        return itemLensId === itemId;
      }

      return false;
    });
    console.log('[WishlistStore] Item in wishlist result:', result);
    return result;
  },

  clearWishlist: () => {
    set({
      items: [],
      totalItems: 0,
      error: null,
    });
  },
}));
