import { create } from "zustand";
import {
  Product,
  ProductsResponse,
  CreateProductRequest,
  ProductQueryParams,
  Category,
  Brand,
  ProductImage,
} from "../types/product.types";
import { productService } from "../services/product.service";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: Category[];
  brands: Brand[];
  productImages: ProductImage[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

interface ProductActions {
  // Products
  fetchProducts: (params?: ProductQueryParams) => Promise<void>;
  fetchProductById: (productId: number) => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<Product>;
  updateProduct: (
    productId: number,
    productData: Partial<CreateProductRequest>
  ) => Promise<Product>;
  deleteProduct: (productId: number) => Promise<void>;

  // Categories & Brands
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;

  // Images
  fetchProductImages: (productId: number) => Promise<void>;
  uploadProductImages: (
    productId: number,
    images: File[]
  ) => Promise<ProductImage[]>;
  uploadImages: (images: File[]) => Promise<string[]>;
  deleteProductImage: (imageId: number) => Promise<void>;

  // Utils
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearCurrentProduct: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>()((set, get) => ({
  // Initial state
  products: [],
  currentProduct: null,
  categories: [],
  brands: [],
  productImages: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },

  // Actions
  fetchProducts: async (params?: ProductQueryParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await productService.getProducts(params);
      set({
        products: response.products || [],
        pagination: {
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      const product = await productService.getProductById(productId);
      set({
        currentProduct: product,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch product",
        isLoading: false,
      });
    }
  },

  createProduct: async (productData: CreateProductRequest) => {
    console.log("ProductStore.createProduct called with:", productData);
    set({ isLoading: true, error: null });

    try {
      console.log("Calling productService.createProduct...");
      const newProduct = await productService.createProduct(productData);
      console.log("ProductStore.createProduct success:", newProduct);

      // Add to products list
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));

      return newProduct;
    } catch (error: any) {
      console.error("ProductStore.createProduct failed:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);
      set({
        error: error.message || "Failed to create product",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProduct: async (
    productId: number,
    productData: Partial<CreateProductRequest>
  ) => {
    set({ isLoading: true, error: null });

    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        productData
      );

      // Update in products list
      set((state) => ({
        products: state.products.map((p) =>
          p.productId === productId ? updatedProduct : p
        ),
        currentProduct:
          state.currentProduct?.productId === productId
            ? updatedProduct
            : state.currentProduct,
        isLoading: false,
      }));

      return updatedProduct;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update product",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      await productService.deleteProduct(productId);

      // Remove from products list
      set((state) => ({
        products: state.products.filter((p) => p.productId !== productId),
        currentProduct:
          state.currentProduct?.productId === productId
            ? null
            : state.currentProduct,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete product",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      console.log("Store fetchCategories - received:", categories);
      set({ categories: Array.isArray(categories) ? categories : [] });
    } catch (error: any) {
      console.error("Store fetchCategories - error:", error);
      set({
        categories: [], // Đảm bảo categories luôn là array
        error: error.message || "Failed to fetch categories",
      });
    }
  },

  fetchBrands: async () => {
    try {
      const brands = await productService.getBrands();
      console.log("Store fetchBrands - received:", brands);
      set({ brands: Array.isArray(brands) ? brands : [] });
    } catch (error: any) {
      console.error("Store fetchBrands - error:", error);
      set({
        brands: [], // Đảm bảo brands luôn là array
        error: error.message || "Failed to fetch brands",
      });
    }
  },

  fetchProductImages: async (productId: number) => {
    try {
      const images = await productService.getProductImages(productId);
      set({ productImages: images });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch product images" });
    }
  },

  uploadProductImages: async (productId: number, images: File[]) => {
    set({ isLoading: true, error: null });

    try {
      const uploadedImages = await productService.uploadProductImages(
        productId,
        images
      );

      // Add to product images
      set((state) => ({
        productImages: [...state.productImages, ...uploadedImages],
        isLoading: false,
      }));

      return uploadedImages;
    } catch (error: any) {
      set({
        error: error.message || "Failed to upload images",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadImages: async (images: File[]) => {
    set({ isLoading: true, error: null });

    try {
      const uploadedUrls = await productService.uploadImages(images);
      set({ isLoading: false });
      return uploadedUrls;
    } catch (error: any) {
      set({
        error: error.message || "Failed to upload images",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProductImage: async (imageId: number) => {
    try {
      await productService.deleteProductImage(imageId);

      // Remove from product images
      set((state) => ({
        productImages: state.productImages.filter((img) => img.id !== imageId),
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete image" });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
