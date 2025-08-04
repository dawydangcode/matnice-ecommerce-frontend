import { create } from "zustand";
import {
  Brand,
  BrandFilters,
  CreateBrandDto,
  UpdateBrandDto,
} from "../types/brand.types";
import { brandService } from "../services/brand.service";
import { toast } from "react-hot-toast";

interface BrandStore {
  brands: Brand[];
  selectedBrand: Brand | null;
  isLoading: boolean;
  error: string | null;
  filters: BrandFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // Actions
  setBrands: (brands: Brand[]) => void;
  setSelectedBrand: (brand: Brand | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: BrandFilters) => void;
  setPagination: (pagination: Partial<BrandStore["pagination"]>) => void;
  clearError: () => void;

  // API Actions
  fetchBrands: (filters?: BrandFilters) => Promise<void>;
  fetchBrandById: (id: number) => Promise<void>;
  createBrand: (data: CreateBrandDto) => Promise<Brand | null>;
  updateBrand: (id: number, data: UpdateBrandDto) => Promise<Brand | null>;
  deleteBrand: (id: number) => Promise<boolean>;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: [],
  selectedBrand: null,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 10 },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  // Actions
  setBrands: (brands) => set({ brands }),
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  clearError: () => set({ error: null }),

  // API Actions
  fetchBrands: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      const mergedFilters = { ...get().filters, ...filters };

      const response = await brandService.getBrands({
        page: mergedFilters.page || 1,
        limit: mergedFilters.limit || 10,
        q: mergedFilters.q,
      });

      // Assuming response is an array or has a data property
      const brands = Array.isArray(response)
        ? (response as Brand[])
        : (((response as any).data || []) as Brand[]);

      // Calculate total pages (assume total is available in response)
      const total = (response as any).total || brands.length;
      const limit = mergedFilters.limit || 10;
      const totalPages = Math.ceil(total / limit);

      set({
        brands,
        filters: mergedFilters,
        pagination: {
          total,
          page: mergedFilters.page || 1,
          limit,
          totalPages,
        },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch brands";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBrandById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const brand = await brandService.getBrandById(id);
      set({ selectedBrand: brand });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch brand";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createBrand: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const brand = await brandService.createBrand(data);

      // Add to current brands list
      set((state) => ({
        brands: [brand, ...state.brands],
      }));

      toast.success("Brand created successfully");
      return brand;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create brand";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBrand: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedBrand = await brandService.updateBrand(id, data);

      // Update in current brands list
      set((state) => ({
        brands: state.brands.map((brand) =>
          brand.id === id ? updatedBrand : brand
        ),
        selectedBrand:
          state.selectedBrand?.id === id ? updatedBrand : state.selectedBrand,
      }));

      toast.success("Brand updated successfully");
      return updatedBrand;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update brand";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBrand: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await brandService.deleteBrand(id);

      // Remove from current brands list
      set((state) => ({
        brands: state.brands.filter((brand) => brand.id !== id),
        selectedBrand:
          state.selectedBrand?.id === id ? null : state.selectedBrand,
      }));

      toast.success("Brand deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete brand";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
