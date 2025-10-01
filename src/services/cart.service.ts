import { apiService } from './api.service';

export interface AddFrameOnlyToCartRequest {
  cartId: number;
  productId: number;
  quantity?: number;
  framePrice: number;
  totalPrice: number;
  discount?: number;
  selectedColorId?: number;
}

export interface AddFrameOnlyToCartResponse {
  frame: {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    framePrice: number;
    totalPrice: number;
    discount: number;
    addedAt: string;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt?: string;
    deletedBy?: number;
  };
}

export interface AddLensProductToCartRequest {
  cartId: number;
  frameData: {
    productId: number;
    framePrice: number;
    quantity?: number;
    selectedColorId?: number;
  };
  lensData: {
    lensVariantId: number;
    lensPrice: number;
    prescriptionValues: {
      rightEyeSphere: number;
      leftEyeSphere: number;
      rightEyeCylinder?: number;
      leftEyeCylinder?: number;
      rightEyeAxis?: number;
      leftEyeAxis?: number;
      pdLeft?: number;
      pdRight?: number;
      addLeft?: number;
      addRight?: number;
    };
    selectedCoatingIds: number[];
    selectedTintColorId?: number;
    prescriptionNotes?: string;
    lensNotes?: string;
  };
}

export interface AddLensProductToCartResponse {
  frame: {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    framePrice: number;
    totalPrice: number;
    discount: number;
    addedAt: string;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt?: string;
    deletedBy?: number;
  };
  lensDetail: {
    id: number;
    cartFrameId: number;
    lensVariantId: number;
    rightEyeSphere: number;
    rightEyeCylinder?: number;
    rightEyeAxis?: number;
    leftEyeSphere: number;
    leftEyeCylinder?: number;
    leftEyeAxis?: number;
    pdLeft?: number;
    pdRight?: number;
    addLeft?: number;
    addRight?: number;
    lensPrice: number;
    selectedCoatingIds: string | null; // JSON string
    selectedTintColorId: number | null;
    prescriptionNotes?: string;
    lensNotes?: string;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt?: string;
    deletedBy?: number;
  };
}

export interface CartSummary {
  cartId: number;
  items: CartItemSummary[];
  totalItems: number;
  totalFramePrice: number | string; // API might return string
  totalLensPrice: number | string; // API might return string
  totalDiscount: number | string; // API might return string
  grandTotal: number | string; // API might return string
}

export interface CartItemSummary {
  cartFrameId: number;
  productId: number;
  productName?: string;
  productImage?: string;
  frameColor?: string;
  selectedColor?: {
    id: number;
    colorName: string;
    colorCode?: string; // Made optional since API doesn't return this
    productVariantName?: string;
  } | null;
  quantity: number;
  framePrice: number | string; // API might return string
  totalPrice: number | string; // API might return string
  discount: number | string; // API might return string
  lensDetail?: {
    id: number;
    lensId: number | undefined;
    lensType: string | undefined;
    lensQuality: string;
    lensPrice: number | string; // API might return string
    totalUpgradesPrice: number | string; // API might return string
    selectedCoatings?: {
      id: number;
      name: string;
      price: number;
      description?: string;
    }[];
    selectedTintColor?: {
      id: number;
      name: string;
      colorCode?: string;
      price?: number;
      description?: string;
    } | null;
    prescription: {
      rightEye: {
        sphere: number | undefined;
        cylinder: number | undefined;
        axis: number | undefined;
      };
      leftEye: {
        sphere: number | undefined;
        cylinder: number | undefined;
        axis: number | undefined;
      };
      pdLeft: number | undefined;
      pdRight: number | undefined;
      addLeft: number | undefined;
      addRight: number | undefined;
    };
  };
  lensInfo?: {
    id: string;
    name: string;
    lensType: string;
    description?: string;
    origin?: string;
    image?: string;
  } | null;
  lensVariantInfo?: {
    id: number;
    design: string;
    material: string;
    price: string;
    lensThickness?: {
      id: number;
      name: string;
      indexValue: number;
      description: string;
    };
  } | null;
}

export interface CartItemWithDetails {
  frame: {
    id: number;
    cartId: number;
    productId: number;
    productName?: string;
    productImage?: string;
    selectedColor?: {
      id: number;
      colorName: string;
      colorCode?: string; // Made optional since API doesn't return this
      productVariantName?: string;
    } | null;
    quantity: number;
    framePrice: number | string; // API returns string
    totalPrice: number | string; // API returns string
    discount: number | string; // API returns string
    addedAt: string;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt?: string;
    deletedBy?: number;
  };
  lensDetail?: {
    id: number;
    cartFrameId: number;
    lensVariantId: number;
    rightEyeSphere: number | string; // API returns string
    rightEyeCylinder?: number | string; // API returns string
    rightEyeAxis?: number | string; // API can return string
    leftEyeSphere: number | string; // API returns string
    leftEyeCylinder?: number | string; // API returns string
    leftEyeAxis?: number | string; // API can return string
    pdLeft?: number | string; // API returns string
    pdRight?: number | string; // API returns string
    addLeft?: number | string; // API returns string
    addRight?: number | string; // API returns string
    lensPrice: number | string; // API returns string
    selectedCoatingIds: string | null; // JSON string
    selectedTintColorId: number | null;
    prescriptionNotes?: string;
    lensNotes?: string;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt?: string;
    deletedBy?: number;
  };
}

class CartService {
  async addFrameOnlyToCart(
    data: AddFrameOnlyToCartRequest,
  ): Promise<AddFrameOnlyToCartResponse> {
    try {
      console.log('Sending frame only data:', JSON.stringify(data, null, 2));
      const frameData = {
        frame: {
          cartId: data.cartId,
          productId: data.productId,
          quantity: data.quantity || 1,
          framePrice: data.framePrice,
          totalPrice: data.totalPrice,
          discount: data.discount || 0,
          selectedColorId: data.selectedColorId,
        },
        // lensDetail is optional, so we don't include it for frame only
      };

      const response = await apiService.post<AddFrameOnlyToCartResponse>(
        `/api/v1/cart-combined/item/create-complete`,
        frameData,
      );
      return response;
    } catch (error: any) {
      console.error('Error adding frame only to cart:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async addLensProductToCart(
    data: AddLensProductToCartRequest,
  ): Promise<AddLensProductToCartResponse> {
    try {
      console.log('Sending cart data:', JSON.stringify(data, null, 2));
      const response = await apiService.post<AddLensProductToCartResponse>(
        `/api/v1/cart-combined/add-lens-product`,
        data,
      );
      return response;
    } catch (error: any) {
      console.error('Error adding lens product to cart:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  // Get or create cart for user
  async getOrCreateCart(): Promise<{ cartId: number }> {
    try {
      // First try to get user's existing cart
      const response = await apiService.get<{ cartId: number }>(
        `/api/v1/cart/my-cart/id`,
      );
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Cart doesn't exist, create a new one
        console.log('No existing cart found, creating new cart...');
        const createResponse = await apiService.post<{ cartId: number }>(
          `/api/v1/cart/create`,
          {},
        );
        return createResponse;
      }
      throw error;
    }
  }

  // Get cart summary
  async getCartSummary(cartId: number): Promise<CartSummary> {
    try {
      const response = await apiService.get<CartSummary>(
        `/api/v1/cart-combined/${cartId}/summary`,
      );
      return response;
    } catch (error: any) {
      console.error('Error getting cart summary:', error);
      throw error;
    }
  }

  // Get cart items with full details
  async getCartItemsWithFullDetails(
    cartId: number,
  ): Promise<CartItemWithDetails[]> {
    try {
      const response = await apiService.get<CartItemWithDetails[]>(
        `/api/v1/cart-combined/${cartId}/items-with-details`,
      );
      return response;
    } catch (error: any) {
      console.error('Error getting cart items with details:', error);
      throw error;
    }
  }

  // Delete cart item
  async deleteCartItem(cartFrameId: number): Promise<boolean> {
    try {
      const response = await apiService.delete<boolean>(
        `/api/v1/cart-combined/item/${cartFrameId}/delete-complete`,
      );
      return response;
    } catch (error: any) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }

  // Clear cart
  async clearCart(cartId: number): Promise<boolean> {
    try {
      const response = await apiService.delete<boolean>(
        `/api/v1/cart-combined/${cartId}/clear`,
      );
      return response;
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get current user's cart items
  async getMyCartItemsWithFullDetails(): Promise<CartItemWithDetails[]> {
    try {
      const response = await apiService.get<CartItemWithDetails[]>(
        '/api/v1/cart/my-cart/items-with-details',
      );
      return response;
    } catch (error: any) {
      console.error('Error fetching my cart items:', error);
      throw error;
    }
  }

  // Get current user's cart summary
  async getMyCartSummary(): Promise<CartSummary> {
    try {
      const response = await apiService.get<CartSummary>(
        '/api/v1/cart/my-cart/summary',
      );
      return response;
    } catch (error: any) {
      console.error('Error fetching my cart summary:', error);
      throw error;
    }
  }
}

const cartService = new CartService();
export default cartService;
