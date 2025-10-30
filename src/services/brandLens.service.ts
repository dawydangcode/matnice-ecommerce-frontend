import { apiService } from './api.service';

export interface BrandLens {
  brandLensId: number;
  name: string;
  description?: string;
}

export interface CategoryLens {
  categoryLensId: number;
  name: string;
  description?: string;
}

export interface LensThickness {
  id: number;
  name: string;
  indexValue: number;
  description?: string;
}

export const brandLensService = {
  // Get all lens brands for filter
  getBrandsForFilter: async (): Promise<BrandLens[]> => {
    try {
      const response = await apiService.get(
        '/api/v1/brand-lens/getBrandsForFilter',
      );
      console.log('Brand Lens API Response:', response);

      // Handle different response structures
      if (Array.isArray(response)) {
        return response;
      }

      if (response && typeof response === 'object') {
        const responseObj = response as any;

        // Check if data is nested
        if (Array.isArray(responseObj.data)) {
          return responseObj.data;
        }

        // Check if response itself contains the array properties
        if (responseObj.data && Array.isArray(responseObj.data.data)) {
          return responseObj.data.data;
        }
      }

      console.warn('Unexpected brand lens response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching brand lens:', error);
      return [];
    }
  },
};

export const categoryLensService = {
  // Get all lens categories for filter
  getCategoriesForFilter: async (): Promise<CategoryLens[]> => {
    try {
      const response = await apiService.get('/api/v1/lens-categories');
      console.log('Category Lens API Response:', response);

      // Handle different response structures
      if (Array.isArray(response)) {
        return response;
      }

      if (response && typeof response === 'object') {
        const responseObj = response as any;

        // Check if data is nested
        if (Array.isArray(responseObj.data)) {
          return responseObj.data;
        }

        // Check if response itself contains the array properties
        if (responseObj.data && Array.isArray(responseObj.data.data)) {
          return responseObj.data.data;
        }
      }

      console.warn('Unexpected category lens response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching category lens:', error);
      return [];
    }
  },
};

export const lensThicknessService = {
  // Get all lens thickness for filter
  getThicknessForFilter: async (): Promise<LensThickness[]> => {
    try {
      const response = await apiService.get('/api/v1/lens-thickness/list');
      console.log('Lens Thickness API Response:', response);

      // Handle different response structures
      if (Array.isArray(response)) {
        return response;
      }

      if (response && typeof response === 'object') {
        const responseObj = response as any;

        // Check if data is nested
        if (Array.isArray(responseObj.data)) {
          return responseObj.data;
        }

        // Check if response itself contains the array properties
        if (responseObj.data && Array.isArray(responseObj.data.data)) {
          return responseObj.data.data;
        }
      }

      console.warn('Unexpected lens thickness response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching lens thickness:', error);
      return [];
    }
  },
};
