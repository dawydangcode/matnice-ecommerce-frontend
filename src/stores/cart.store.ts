import { create } from 'zustand';
import { apiService } from '../services/api.service';

// API Response interfaces
export interface ApiCartFrame {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  framePrice: number;
  totalPrice: number;
  discount: number;
  addedAt: string;
  productName: string;
  productImage: string;
}

export interface ApiLensDetail {
  id: number;
  cartFrameId: number;
  rightEyeSphere: number;
  rightEyeCylinder: number;
  rightEyeAxis: number;
  leftEyeSphere: number;
  leftEyeCylinder: number;
  leftEyeAxis: number;
  pdLeft: number;
  pdRight: number;
  totalUpgradesPrice: number;
  lensPrice: number;
  prescriptionNotes: string;
  lensNotes: string;
  selectedCoatingIds: string | null;
  selectedTintColorId: string | null;
  lensVariantId: string;
}

export interface ApiCartItem {
  frame: ApiCartFrame;
  lensDetail?: ApiLensDetail;
}

// Client-side CartItem interface
export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  imageUrl?: string;
  framePrice: number;
  lensPrice: number;
  totalPrice: number;
  quantity: number;
  lensNotes?: string;
  prescriptionNotes?: string;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCartItems: () => Promise<void>;
  removeItem: (frameId: number) => Promise<void>;
  updateQuantity: (frameId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  calculateTotals: () => void;
  loadSampleData: () => void;
}

// Transform API data to client data
const transformApiCartItem = (apiItem: ApiCartItem): CartItem => {
  const { frame, lensDetail } = apiItem;

  return {
    id: frame.id.toString(),
    productId: frame.productId,
    productName: frame.productName,
    imageUrl: frame.productImage,
    framePrice: frame.framePrice,
    lensPrice: lensDetail?.lensPrice || 0,
    totalPrice: frame.framePrice + (lensDetail?.lensPrice || 0),
    quantity: frame.quantity,
    lensNotes: lensDetail?.lensNotes,
    prescriptionNotes: lensDetail?.prescriptionNotes,
  };
};

// API functions using apiService
const fetchCartItemsFromAPI = async (): Promise<ApiCartItem[]> => {
  return await apiService.get<ApiCartItem[]>(
    '/api/v1/cart/my-cart/items-with-details',
  );
};

const removeItemFromAPI = async (frameId: number): Promise<void> => {
  await apiService.delete(`/api/v1/cart/frame/${frameId}`);
};

const updateItemQuantityAPI = async (
  frameId: number,
  quantity: number,
): Promise<void> => {
  await apiService.put(`/api/v1/cart/frame/${frameId}`, { quantity });
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,

  fetchCartItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiItems = await fetchCartItemsFromAPI();
      const items = apiItems.map(transformApiCartItem);
      set({ items, isLoading: false });
      get().calculateTotals();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  removeItem: async (frameId: number) => {
    try {
      await removeItemFromAPI(frameId);
      const items = get().items.filter((item) => parseInt(item.id) !== frameId);
      set({ items });
      get().calculateTotals();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove item',
      });
    }
  },

  updateQuantity: async (frameId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(frameId);
      return;
    }

    try {
      await updateItemQuantityAPI(frameId, quantity);
      const items = get().items.map((item) =>
        parseInt(item.id) === frameId
          ? {
              ...item,
              quantity,
              totalPrice: (item.framePrice + item.lensPrice) * quantity,
            }
          : item,
      );
      set({ items });
      get().calculateTotals();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update quantity',
      });
    }
  },

  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },

  calculateTotals: () => {
    const items = get().items;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    set({ totalItems, totalPrice });
  },

  loadSampleData: () => {
    // Sample data from your API response
    const sampleApiData: ApiCartItem[] = [
      {
        frame: {
          id: 21,
          cartId: 1,
          productId: 3,
          quantity: 1,
          framePrice: 560000,
          totalPrice: 560000,
          discount: 0,
          addedAt: '2025-09-27T02:18:20.000Z',
          productName: 'DB 1106',
          productImage:
            'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7673795_db-1106/7673795_a.png',
        },
        lensDetail: {
          id: 18,
          cartFrameId: 21,
          rightEyeSphere: 0,
          rightEyeCylinder: 0,
          rightEyeAxis: 0,
          leftEyeSphere: 0,
          leftEyeCylinder: 0,
          leftEyeAxis: 0,
          pdLeft: 31.5,
          pdRight: 31.5,
          totalUpgradesPrice: 0,
          lensPrice: 0,
          prescriptionNotes: 'Từ trang Lens Selection',
          lensNotes: 'Loại tròng: SINGLE_VISION',
          selectedCoatingIds: '[8]',
          selectedTintColorId: null,
          lensVariantId: '8',
        },
      },
      {
        frame: {
          id: 20,
          cartId: 1,
          productId: 2,
          quantity: 1,
          framePrice: 120000,
          totalPrice: 120000,
          discount: 0,
          addedAt: '2025-09-24T05:06:41.000Z',
          productName: 'Glasses Test',
          productImage:
            'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/11111_glasses-test/11111_a.png',
        },
        lensDetail: {
          id: 17,
          cartFrameId: 20,
          rightEyeSphere: 0,
          rightEyeCylinder: 0,
          rightEyeAxis: 0,
          leftEyeSphere: 0,
          leftEyeCylinder: 0,
          leftEyeAxis: 0,
          pdLeft: 31.5,
          pdRight: 31.5,
          totalUpgradesPrice: 0,
          lensPrice: 200000,
          prescriptionNotes: 'Từ trang Lens Selection',
          lensNotes: 'Loại tròng: SINGLE_VISION',
          selectedCoatingIds: '[7]',
          selectedTintColorId: '1',
          lensVariantId: '7',
        },
      },
    ];

    const items = sampleApiData.map(transformApiCartItem);
    set({ items });
    get().calculateTotals();
  },
}));
