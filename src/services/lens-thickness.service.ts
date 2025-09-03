import { apiService } from './api.service';

export interface LensThickness {
  id: number; // API returns number, not string
  name: string;
  indexValue: number;
  description?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number | null;
  deletedAt?: string | null;
  deletedBy?: number | null;
}

export class LensThicknessService {
  async getLensThicknessList(): Promise<LensThickness[]> {
    try {
      const response = await apiService.get<any>('/api/v1/lens-thickness/list');

      console.log(
        'Raw lens thickness response:',
        JSON.stringify(response, null, 2),
      ); // Better debug log

      // Check if response has data property (pagination structure)
      if (response && response.data && Array.isArray(response.data)) {
        console.log('Found data array with', response.data.length, 'items'); // Debug
        return response.data;
      }

      // Check if response is directly an array
      if (Array.isArray(response)) {
        console.log('Response is direct array with', response.length, 'items'); // Debug
        return response;
      }

      console.error('Unexpected lens thickness response structure:', response);
      return [];
    } catch (error) {
      console.error('Failed to get lens thickness list:', error);
      throw error;
    }
  }

  async getLensThicknessById(id: number): Promise<LensThickness> {
    try {
      const response = await apiService.get<LensThickness>(
        `/api/v1/lens-thickness/${id}`,
      );
      return response;
    } catch (error) {
      console.error(`Failed to get lens thickness with ID ${id}:`, error);
      throw error;
    }
  }

  async createLensThickness(data: {
    name: string;
    indexValue: number;
    description?: string;
  }): Promise<LensThickness> {
    try {
      const response = await apiService.post<LensThickness>(
        '/api/v1/lens-thickness',
        data,
      );
      return response;
    } catch (error) {
      console.error('Failed to create lens thickness:', error);
      throw error;
    }
  }

  async updateLensThickness(
    id: string,
    data: {
      name: string;
      indexValue: number;
      description?: string;
    },
  ): Promise<LensThickness> {
    try {
      const response = await apiService.put<LensThickness>(
        `/api/v1/lens-thickness/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error(`Failed to update lens thickness with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteLensThickness(id: string): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens-thickness/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete lens thickness with ID ${id}:`, error);
      throw error;
    }
  }
}

export const lensThicknessService = new LensThicknessService();
