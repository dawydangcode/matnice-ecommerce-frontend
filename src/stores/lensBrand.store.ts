import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  LensBrand,
  CreateLensBrandDto,
  UpdateLensBrandDto,
  LensBrandPagination,
} from '../types/lensBrand.types';
import { apiService } from '../services/api.service';

interface LensBrandStore {
  lensBrands: LensBrand[];
  isLoading: boolean;
  error: string | null;
  pagination: LensBrandPagination;

  // Actions
  fetchLensBrands: (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }) => Promise<void>;
  createLensBrand: (data: CreateLensBrandDto) => Promise<void>;
  updateLensBrand: (id: number, data: UpdateLensBrandDto) => Promise<void>;
  deleteLensBrand: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useLensBrandStore = create<LensBrandStore>()(
  devtools(
    (set, get) => ({
      lensBrands: [],
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      fetchLensBrands: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response: any = await apiService.get(
            '/api/v1/brand-lens/list',
            {
              params,
            },
          );
          set({
            lensBrands: response.data || [],
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
            error: error.message || 'Failed to fetch lens brands',
            isLoading: false,
          });
        }
      },

      createLensBrand: async (data: CreateLensBrandDto) => {
        set({ error: null });
        try {
          await apiService.post('/api/v1/brand-lens/create', data);
          // Refresh the list
          await get().fetchLensBrands({
            page: get().pagination.page,
            limit: get().pagination.limit,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Failed to create lens brand';
          set({ error: errorMessage });
          throw error;
        }
      },

      updateLensBrand: async (id: number, data: UpdateLensBrandDto) => {
        set({ error: null });
        try {
          await apiService.put(`/api/v1/brand-lens/${id}/update`, data);
          // Refresh the list
          await get().fetchLensBrands({
            page: get().pagination.page,
            limit: get().pagination.limit,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Failed to update lens brand';
          set({ error: errorMessage });
          throw error;
        }
      },

      deleteLensBrand: async (id: number) => {
        set({ error: null });
        try {
          await apiService.delete(`/api/v1/brand-lens/${id}/delete`);
          // Refresh the list
          await get().fetchLensBrands({
            page: get().pagination.page,
            limit: get().pagination.limit,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Failed to delete lens brand';
          set({ error: errorMessage });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lens-brand-store',
    },
  ),
);
