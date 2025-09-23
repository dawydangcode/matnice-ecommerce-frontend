import { apiService } from './api.service';

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

class CartService {
  async addLensProductToCart(
    data: AddLensProductToCartRequest,
  ): Promise<AddLensProductToCartResponse> {
    try {
      const response = await apiService.post<AddLensProductToCartResponse>(
        `/api/v1/cart/add-lens-product`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error adding lens product to cart:', error);
      throw error;
    }
  }

  // Get or create cart for user
  async getOrCreateCart(): Promise<{ cartId: number }> {
    // For now, return a hardcoded cartId. In real implementation,
    // you would check if user has an active cart or create a new one
    return { cartId: 1 };
  }
}

const cartService = new CartService();
export default cartService;
