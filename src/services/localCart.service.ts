import { apiService } from './api.service';

// Local storage cart item interface
export interface LocalCartItem {
  id: string; // temporary ID for local storage
  productId: number;
  quantity: number;
  framePrice: number;
  totalPrice: number;
  discount: number;
  selectedColorId?: number;
  lensData?: any; // For lens products
  addedAt: string;
  type: 'frame' | 'sunglasses' | 'prescription' | 'lens';
}

// Local storage cart interface
export interface LocalCart {
  items: LocalCartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: string;
}

export class LocalCartService {
  private readonly CART_STORAGE_KEY = 'matnice_cart';
  private readonly CART_COUNT_KEY = 'matnice_cart_count';

  // Get cart from localStorage
  getLocalCart(): LocalCart {
    try {
      const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
      if (cartData) {
        return JSON.parse(cartData);
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
    }

    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Save cart to localStorage
  saveLocalCart(cart: LocalCart): void {
    try {
      cart.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem(this.CART_COUNT_KEY, cart.totalItems.toString());

      // Dispatch event for cart count update
      window.dispatchEvent(
        new CustomEvent('cartUpdated', {
          detail: { count: cart.totalItems },
        }),
      );
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  // Add frame to local cart
  addFrameToLocalCart(productData: {
    productId: number;
    quantity?: number;
    framePrice: number;
    totalPrice: number;
    discount?: number;
    selectedColorId?: number;
    type?: 'frame' | 'sunglasses';
  }): LocalCartItem {
    const cart = this.getLocalCart();

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId === productData.productId &&
        item.selectedColorId === productData.selectedColorId,
    );

    const newItem: LocalCartItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      productId: productData.productId,
      quantity: productData.quantity || 1,
      framePrice: productData.framePrice,
      totalPrice: productData.totalPrice,
      discount: productData.discount || 0,
      selectedColorId: productData.selectedColorId,
      addedAt: new Date().toISOString(),
      type: productData.type || 'frame',
    };

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += newItem.quantity;
      cart.items[existingItemIndex].totalPrice += newItem.totalPrice;
    } else {
      // Add new item
      cart.items.push(newItem);
    }

    // Update cart totals
    this.updateCartTotals(cart);
    this.saveLocalCart(cart);

    return newItem;
  }

  // Remove item from local cart
  removeFromLocalCart(itemId: string): void {
    const cart = this.getLocalCart();
    cart.items = cart.items.filter((item) => item.id !== itemId);
    this.updateCartTotals(cart);
    this.saveLocalCart(cart);
  }

  // Update item quantity in local cart
  updateLocalCartItemQuantity(itemId: string, quantity: number): void {
    const cart = this.getLocalCart();
    const item = cart.items.find((item) => item.id === itemId);

    if (item) {
      item.quantity = quantity;
      item.totalPrice = item.framePrice * quantity - item.discount;
      this.updateCartTotals(cart);
      this.saveLocalCart(cart);
    }
  }

  // Clear local cart
  clearLocalCart(): void {
    localStorage.removeItem(this.CART_STORAGE_KEY);
    localStorage.removeItem(this.CART_COUNT_KEY);
    window.dispatchEvent(
      new CustomEvent('cartUpdated', {
        detail: { count: 0 },
      }),
    );
  }

  // Get cart count for display
  getCartCount(): number {
    const cart = this.getLocalCart();
    return cart.totalItems;
  }

  // Update cart totals
  private updateCartTotals(cart: LocalCart): void {
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }

  // Check if user is authenticated
  private isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Sync local cart with backend when user logs in
  async syncCartWithBackend(): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    const localCart = this.getLocalCart();
    if (localCart.items.length === 0) {
      return;
    }

    try {
      // Get or create backend cart
      const backendCart = await apiService
        .get<{ cartId: number }>('/api/v1/cart/my-cart/id')
        .catch(async () => {
          return await apiService.post<{ cartId: number }>(
            '/api/v1/cart/create',
            {},
          );
        });

      // Add each local item to backend cart
      for (const item of localCart.items) {
        try {
          const frameData = {
            frame: {
              cartId: backendCart.cartId,
              productId: item.productId,
              quantity: item.quantity,
              framePrice: item.framePrice,
              totalPrice: item.totalPrice,
              discount: item.discount,
              selectedColorId: item.selectedColorId,
            },
          };

          await apiService.post(
            '/api/v1/cart-combined/item/create-complete',
            frameData,
          );
        } catch (error) {
          console.error('Error syncing item to backend:', error);
        }
      }

      // Clear local cart after successful sync
      this.clearLocalCart();
      console.log('Cart synced with backend successfully');
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  }

  // Smart add to cart - decides between local storage or backend
  async smartAddToCart(productData: {
    productId: number;
    quantity?: number;
    framePrice: number;
    totalPrice?: number;
    lensPrice?: number;
    discount?: number;
    selectedColorId?: number;
    type?: 'frame' | 'sunglasses' | 'lens';
    lensData?: string;
    cartData?: any; // For backend lens cart data
  }): Promise<{ success: boolean; message: string; isLocal: boolean }> {
    const calculatedTotalPrice =
      productData.totalPrice ||
      productData.framePrice + (productData.lensPrice || 0);

    if (this.isAuthenticated()) {
      // User is logged in - use backend
      try {
        if (productData.type === 'lens' && productData.cartData) {
          // Handle lens product with complex data using existing cart API
          const cartResult = await apiService
            .get<{ cartId: number }>('/api/v1/cart/my-cart/id')
            .catch(async () => {
              return await apiService.post<{ cartId: number }>(
                '/api/v1/cart/create',
                {},
              );
            });

          const lensCartData = {
            ...productData.cartData,
            cartId: cartResult.cartId,
          };

          await apiService.post('/api/v1/cart/add-lens-product', lensCartData);
        } else {
          // Handle regular frame/sunglasses products
          const cartData = await apiService
            .get<{ cartId: number }>('/api/v1/cart/my-cart/id')
            .catch(async () => {
              return await apiService.post<{ cartId: number }>(
                '/api/v1/cart/create',
                {},
              );
            });

          const frameData = {
            frame: {
              cartId: cartData.cartId,
              productId: productData.productId,
              quantity: productData.quantity || 1,
              framePrice: productData.framePrice,
              totalPrice: calculatedTotalPrice,
              discount: productData.discount || 0,
              selectedColorId: productData.selectedColorId,
            },
          };

          await apiService.post(
            '/api/v1/cart-combined/item/create-complete',
            frameData,
          );
        }

        return {
          success: true,
          message: 'Added to cart successfully!',
          isLocal: false,
        };
      } catch (error) {
        console.error('Backend cart error, falling back to local:', error);
        // Fallback to local storage
        const localData = {
          ...productData,
          totalPrice: calculatedTotalPrice,
          type: (productData.type === 'lens' ? 'frame' : productData.type) as
            | 'frame'
            | 'sunglasses',
        };
        this.addFrameToLocalCart(localData);
        return {
          success: true,
          message: 'Added to local cart successfully!',
          isLocal: true,
        };
      }
    } else {
      // User not logged in - use local storage
      const localData = {
        ...productData,
        totalPrice: calculatedTotalPrice,
        type: (productData.type === 'lens' ? 'frame' : productData.type) as
          | 'frame'
          | 'sunglasses',
      };
      this.addFrameToLocalCart(localData);
      return {
        success: true,
        message: 'Added to cart! Sign in to sync across devices.',
        isLocal: true,
      };
    }
  }
}

export const localCartService = new LocalCartService();
