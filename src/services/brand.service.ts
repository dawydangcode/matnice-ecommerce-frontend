import { apiService } from "./api.service";

// Updated interfaces to match backend API
export interface BrandData {
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

export interface CreateBrandData {
  name: string;
  description?: string;
}

export interface UpdateBrandData {
  name?: string;
  description?: string;
}

export interface BrandListParams {
  page: number;
  limit: number;
  q?: string;
}

export const brandService = {
  // Get all brands with pagination
  getBrands: async (params: BrandListParams) => {
    console.log("Fetching brands with params:", params);

    // Build query parameters correctly for backend validation
    const queryParams = new URLSearchParams();

    // Ensure page and limit are positive numbers
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Only add q if it's a non-empty string
    if (params.q && typeof params.q === "string" && params.q.trim()) {
      queryParams.append("q", params.q.trim());
    }

    const endpoint = `/api/v1/brand/list?${queryParams.toString()}`;

    try {
      console.log(`🔍 Trying brand endpoint: ${endpoint}`);
      const result = await apiService.get(endpoint);
      console.log(`✅ SUCCESS with: ${endpoint}`, result);
      return result;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.log(
        `❌ Failed: ${endpoint} - Status: ${status}, Message: ${message}`
      );

      // Log detailed error for debugging
      if (error.response?.data) {
        console.log(`Error details:`, error.response.data);
      }

      throw error;
    }
  },

  // Get brand by ID
  getBrandById: async (brandId: number): Promise<BrandData> => {
    return await apiService.get<BrandData>(`/api/v1/brand/${brandId}/detail`);
  },

  // Create brand
  createBrand: async (data: CreateBrandData): Promise<BrandData> => {
    return await apiService.post<BrandData>("/api/v1/brand/create", data);
  },

  // Update brand
  updateBrand: async (
    brandId: number,
    data: UpdateBrandData
  ): Promise<BrandData> => {
    return await apiService.put<BrandData>(
      `/api/v1/brand/${brandId}/update`,
      data
    );
  },

  // Delete brand
  deleteBrand: async (brandId: number): Promise<boolean> => {
    return await apiService.delete<boolean>(`/api/v1/brand/${brandId}/delete`);
  },
};
