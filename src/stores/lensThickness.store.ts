import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  LensThickness,
  CreateLensThicknessDto,
  UpdateLensThicknessDto,
  LensThicknessPagination,
} from '../types/lensThickness.types';
import { apiService } from '../services/api.service';

interface LensThicknessStore {
  lensThicknesses: LensThickness[];
  isLoading: boolean;
  error: string | null;
  pagination: LensThicknessPagination;

  // Actions
  fetchLensThicknesses: (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }) => Promise<void>;
  createLensThickness: (data: CreateLensThicknessDto) => Promise<void>;
  updateLensThickness: (
    id: number,
    data: UpdateLensThicknessDto,
  ) => Promise<void>;
  deleteLensThickness: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useLensThicknessStore = create<LensThicknessStore>()(
  devtools(
    (set, get) => ({
      lensThicknesses: [],
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      fetchLensThicknesses: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response: any = await apiService.get(
            '/api/v1/lens-thickness/list',
            {
              params,
            },
          );

          if (response && response.data) {
            set({
              lensThicknesses: response.data,
              pagination: {
                page: response.page || 1,
                limit: response.limit || 10,
                total: response.total || 0,
                totalPages: response.totalPages || 0,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch lens thicknesses',
            isLoading: false,
          });
        }
      },

      createLensThickness: async (data: CreateLensThicknessDto) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.post('/api/v1/lens-thickness', data);
          // Refresh the list after creation
          await get().fetchLensThicknesses();
        } catch (error: any) {
          set({
            error: error.message || 'Failed to create lens thickness',
            isLoading: false,
          });
        }
      },

      updateLensThickness: async (id: number, data: UpdateLensThicknessDto) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.put(`/api/v1/lens-thickness/${id}`, data);
          // Refresh the list after update
          await get().fetchLensThicknesses();
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update lens thickness',
            isLoading: false,
          });
        }
      },

      deleteLensThickness: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.delete(`/api/v1/lens-thickness/${id}`);
          // Refresh the list after deletion
          await get().fetchLensThicknesses();
        } catch (error: any) {
          set({
            error: error.message || 'Failed to delete lens thickness',
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lens-thickness-store',
    },
  ),
);
