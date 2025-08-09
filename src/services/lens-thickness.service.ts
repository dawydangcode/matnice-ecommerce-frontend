import { apiService } from './api.service';

export interface LensThickness {
  id: number;
  name: string;
  indexValue: number;
  price: number;
  description?: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  deletedAt?: Date;
  deletedBy?: number;
}

export class LensThicknessService {
  async getLensThicknessList(): Promise<LensThickness[]> {
    try {
      const response = await apiService.get<LensThickness[]>(
        '/api/v1/lens-thickness/list',
      );
      return response;
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
    price: number;
    description?: string;
  }): Promise<LensThickness> {
    try {
      const response = await apiService.post<LensThickness>(
        '/api/v1/lens-thickness/create',
        data,
      );
      return response;
    } catch (error) {
      console.error('Failed to create lens thickness:', error);
      throw error;
    }
  }

  async updateLensThickness(
    id: number,
    data: {
      name: string;
      indexValue: number;
      price: number;
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

  async deleteLensThickness(id: number): Promise<boolean> {
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
