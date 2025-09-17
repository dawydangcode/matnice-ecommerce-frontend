import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  LensCategory,
  CreateLensCategoryDto,
  UpdateLensCategoryDto,
  LensCategoryPagination,
} from '../types/lensCategory.types';
import { apiService } from '../services/api.service';

interface LensCategoryStore {
  lensCategories: LensCategory[];
  isLoading: boolean;
  error: string | null;
  pagination: LensCategoryPagination;

  // Actions
  fetchLensCategories: (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }) => Promise<void>;
  createLensCategory: (data: CreateLensCategoryDto) => Promise<void>;
  updateLensCategory: (
    id: number,
    data: UpdateLensCategoryDto,
  ) => Promise<void>;
  deleteLensCategory: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useLensCategoryStore = create<LensCategoryStore>()(
  devtools(
    (set, get) => ({
      lensCategories: [],
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      fetchLensCategories: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response: any = await apiService.get(
            '/api/v1/category-lens/list',
            {
              params,
            },
          );
          set({
            lensCategories: response.data || [],
            pagination: response.pagination || {
              page: params.page || 1,
              limit: params.limit || 10,
              total: (response.data || []).length,
              totalPages: 1,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch lens categories',
            isLoading: false,
          });
        }
      },

      createLensCategory: async (data: CreateLensCategoryDto) => {
        set({ error: null });
        try {
          await apiService.post('/api/v1/category-lens/create', data);
          // Refresh the list
          await get().fetchLensCategories({
            page: get().pagination.page,
            limit: get().pagination.limit,
          });
        } catch (error: any) {
          const errorMessage =
            error.message || 'Failed to create lens category';
          set({ error: errorMessage });
          throw error;
        }
      },

      updateLensCategory: async (id: number, data: UpdateLensCategoryDto) => {
        set({ error: null });
        try {
          await apiService.put(`/api/v1/category-lens/${id}/update`, data);
          // Refresh the list
          await get().fetchLensCategories({
            page: get().pagination.page,
            limit: get().pagination.limit,
          });
        } catch (error: any) {
          const errorMessage =
            error.message || 'Failed to update lens category';
          set({ error: errorMessage });
          throw error;
        }
      },

      deleteLensCategory: async (id: number) => {
        set({ error: null });
        try {
          await apiService.delete(`/api/v1/category-lens/${id}/delete`);
          // Refresh the list
          await get().fetchLensCategories({
            page: get().pagination.page,
            limit: get().pagination.limit,
          });
        } catch (error: any) {
          const errorMessage =
            error.message || 'Failed to delete lens category';
          set({ error: errorMessage });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lens-category-store',
    },
  ),
);
