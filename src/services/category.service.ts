import { apiService } from './api.service';

// Updated interfaces to match backend API
export interface CategoryData {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  q?: string;
}

export const categoryService = {
  // Get all categories with pagination
  getCategories: async (params: CategoryListParams = {}) => {
    const queryParams = new URLSearchParams();

    // Ensure page and limit are positive numbers
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);

    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    // Only add q if it's a non-empty string
    if (params.q && typeof params.q === 'string' && params.q.trim()) {
      queryParams.append('q', params.q.trim());
    }

    return await apiService.get(
      `/api/v1/category/list?${queryParams.toString()}`,
    );
  },

  // Get all categories without pagination (for navigation)
  getAllCategories: async (): Promise<CategoryData[]> => {
    try {
      const response = await apiService.get<any>(
        `/api/v1/category/list?page=1&limit=100`, // Get a large number to get all categories
      );

      // Check if response has data property (pagination structure)
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // Check if response is directly an array
      if (Array.isArray(response)) {
        return response;
      }

      console.error('Unexpected category response structure:', response);
      return [];
    } catch (error) {
      console.error('Failed to get all categories:', error);
      return [];
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId: number): Promise<CategoryData> => {
    return await apiService.get<CategoryData>(
      `/api/v1/category/${categoryId}/details`,
    );
  },

  // Create category
  createCategory: async (data: CreateCategoryData): Promise<CategoryData> => {
    return await apiService.post<CategoryData>('/api/v1/category/create', data);
  },

  // Update category
  updateCategory: async (
    categoryId: number,
    data: UpdateCategoryData,
  ): Promise<CategoryData> => {
    return await apiService.put<CategoryData>(
      `/api/v1/category/${categoryId}/update`,
      data,
    );
  },

  // Delete category
  deleteCategory: async (categoryId: number): Promise<boolean> => {
    return await apiService.delete<boolean>(
      `/api/v1/category/${categoryId}/delete`,
    );
  },
};
