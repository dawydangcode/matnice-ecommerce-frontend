import { apiService } from './api.service';
import {
  Lens,
  LensFilters,
  CreateLensDto,
  UpdateLensDto,
  LensResponse,
  LensQuality,
  LensQualityFilters,
  CreateLensQualityDto,
  UpdateLensQualityDto,
  LensQualityResponse,
  LensThickness,
  LensThicknessFilters,
  CreateLensThicknessDto,
  UpdateLensThicknessDto,
  LensThicknessResponse,
  LensTint,
  LensTintFilters,
  CreateLensTintDto,
  UpdateLensTintDto,
  LensTintResponse,
  TintColor,
  CreateTintColorDto,
  UpdateTintColorDto,
  LensUpgrade,
  LensUpgradeFilters,
  CreateLensUpgradeDto,
  UpdateLensUpgradeDto,
  LensUpgradeResponse,
  LensDetail,
  CreateLensDetailDto,
  UpdateLensDetailDto,
  LensDetailResponse,
  LensUpgradeDetail,
  CreateLensUpgradeDetailDto,
  UpdateLensUpgradeDetailDto,
  LensUpgradeDetailResponse,
} from '../types/lens.types';

class LensService {
  // =============== BASIC LENS METHODS ===============
  async getLenses(filters?: LensFilters): Promise<LensResponse> {
    try {
      console.log('Fetching lenses with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.name) params.append('name', filters.name);

      const response = await apiService.get<any>(
        `/api/v1/lens/list?${params.toString()}`,
      );
      console.log('Lens response:', response);

      // Handle both direct array and paginated response
      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lenses || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lenses:', error);
      throw error;
    }
  }

  async getLensById(id: number): Promise<Lens> {
    try {
      const response = await apiService.get<Lens>(`/api/v1/lens/${id}/detail`);
      return response;
    } catch (error) {
      console.error('Error fetching lens by id:', error);
      throw error;
    }
  }

  async createLens(data: CreateLensDto): Promise<Lens> {
    try {
      const response = await apiService.post<Lens>('/api/v1/lens/create', data);
      return response;
    } catch (error) {
      console.error('Error creating lens:', error);
      throw error;
    }
  }

  async updateLens(id: number, data: UpdateLensDto): Promise<Lens> {
    try {
      const response = await apiService.put<Lens>(
        `/api/v1/lens/${id}/update`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating lens:', error);
      throw error;
    }
  }

  async deleteLens(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting lens:', error);
      throw error;
    }
  }

  // =============== LENS QUALITY METHODS ===============
  async getLensQualities(
    filters?: LensQualityFilters,
  ): Promise<LensQualityResponse> {
    try {
      console.log('Fetching lens qualities with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.name) params.append('name', filters.name);
      if (filters?.uvProtection !== undefined)
        params.append('uvProtection', filters.uvProtection.toString());
      if (filters?.antiReflective !== undefined)
        params.append('antiReflective', filters.antiReflective.toString());
      if (filters?.nightDayOptimization !== undefined)
        params.append(
          'nightDayOptimization',
          filters.nightDayOptimization.toString(),
        );
      if (filters?.freeFormTechnology !== undefined)
        params.append(
          'freeFormTechnology',
          filters.freeFormTechnology.toString(),
        );

      const response = await apiService.get<any>(
        `/api/v1/lens-quality/list?${params.toString()}`,
      );
      console.log('Lens quality response:', response);

      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lensQualities || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lens qualities:', error);
      throw error;
    }
  }

  async getLensQualityById(id: number): Promise<LensQuality> {
    try {
      const response = await apiService.get<LensQuality>(
        `/api/v1/lens-quality/${id}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching lens quality by id:', error);
      throw error;
    }
  }

  async createLensQuality(data: CreateLensQualityDto): Promise<LensQuality> {
    try {
      const response = await apiService.post<LensQuality>(
        '/api/v1/lens-quality/create',
        data,
      );
      return response;
    } catch (error) {
      console.error('Error creating lens quality:', error);
      throw error;
    }
  }

  async updateLensQuality(
    id: number,
    data: UpdateLensQualityDto,
  ): Promise<LensQuality> {
    try {
      const response = await apiService.put<LensQuality>(
        `/api/v1/lens-quality/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating lens quality:', error);
      throw error;
    }
  }

  async deleteLensQuality(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens-quality/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting lens quality:', error);
      throw error;
    }
  }

  // =============== LENS THICKNESS METHODS ===============
  async getLensThicknesses(
    filters?: LensThicknessFilters,
  ): Promise<LensThicknessResponse> {
    try {
      console.log('Fetching lens thicknesses with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await apiService.get<any>(
        `/api/v1/lens-thickness/list?${params.toString()}`,
      );
      console.log('Lens thickness response:', response);

      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lensThicknesses || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lens thicknesses:', error);
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
      console.error('Error fetching lens thickness by id:', error);
      throw error;
    }
  }

  async createLensThickness(
    data: CreateLensThicknessDto,
  ): Promise<LensThickness> {
    try {
      const response = await apiService.post<LensThickness>(
        '/api/v1/lens-thickness/create',
        data,
      );
      return response;
    } catch (error) {
      console.error('Error creating lens thickness:', error);
      throw error;
    }
  }

  async updateLensThickness(
    id: number,
    data: UpdateLensThicknessDto,
  ): Promise<LensThickness> {
    try {
      console.log('Update request URL:', `/api/v1/lens-thickness/${id}/update`);
      console.log('Update request data:', data);

      const response = await apiService.put<LensThickness>(
        `/api/v1/lens-thickness/${id}/update`,
        data,
      );
      return response;
    } catch (error: any) {
      console.error('Error updating lens thickness:', error);
      console.error(
        'Response data:',
        JSON.stringify(error.response?.data, null, 2),
      );
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      throw error;
    }
  }

  async deleteLensThickness(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens-thickness/${id}/delete`);
      return true;
    } catch (error) {
      console.error('Error deleting lens thickness:', error);
      throw error;
    }
  }

  // =============== LENS TINT METHODS ===============
  async getLensTints(filters?: LensTintFilters): Promise<LensTintResponse> {
    try {
      console.log('Fetching lens tints with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await apiService.get<any>(
        `/api/v1/lens-tint/list?${params.toString()}`,
      );
      console.log('Lens tint response:', response);

      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lensTints || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lens tints:', error);
      throw error;
    }
  }

  async getLensTintById(id: number): Promise<LensTint> {
    try {
      const response = await apiService.get<LensTint>(
        `/api/v1/lens-tint/${id}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching lens tint by id:', error);
      throw error;
    }
  }

  async createLensTint(data: CreateLensTintDto): Promise<LensTint> {
    try {
      const response = await apiService.post<LensTint>(
        '/api/v1/lens-tint/create',
        data,
      );
      return response;
    } catch (error) {
      console.error('Error creating lens tint:', error);
      throw error;
    }
  }

  async updateLensTint(id: number, data: UpdateLensTintDto): Promise<LensTint> {
    try {
      const response = await apiService.put<LensTint>(
        `/api/v1/lens-tint/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating lens tint:', error);
      throw error;
    }
  }

  async deleteLensTint(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens-tint/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting lens tint:', error);
      throw error;
    }
  }

  // =============== TINT COLOR METHODS ===============
  async getTintColorsByTintId(tintId: number): Promise<TintColor[]> {
    try {
      const response = await apiService.get<TintColor[]>(
        `/api/v1/lens-tint/${tintId}/colors`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching tint colors by tint id:', error);
      throw error;
    }
  }

  async getAllTintColors(): Promise<TintColor[]> {
    try {
      const response = await apiService.get<TintColor[]>(
        '/api/v1/tint-color/list',
      );
      return response;
    } catch (error) {
      console.error('Error fetching all tint colors:', error);
      throw error;
    }
  }

  async getTintColorById(id: number): Promise<TintColor> {
    try {
      const response = await apiService.get<TintColor>(
        `/api/v1/tint-color/${id}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching tint color by id:', error);
      throw error;
    }
  }

  async createTintColor(data: CreateTintColorDto): Promise<TintColor> {
    try {
      console.log(
        'Creating tint color with payload:',
        JSON.stringify(data, null, 2),
      );
      const response = await apiService.post<TintColor>(
        '/api/v1/tint-color/create',
        data,
      );
      return response;
    } catch (error: any) {
      console.error('Error creating tint color:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  async uploadTintColorImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log(
        'Uploading tint color image:',
        file.name,
        file.type,
        file.size,
      );

      const response = await apiService.postFormData<{ imageUrl: string }>(
        '/api/v1/tint-color/upload-image',
        formData,
      );
      return response;
    } catch (error: any) {
      console.error('Error uploading tint color image:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  async updateTintColor(
    id: number,
    data: UpdateTintColorDto,
  ): Promise<TintColor> {
    try {
      const response = await apiService.put<TintColor>(
        `/api/v1/tint-color/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating tint color:', error);
      throw error;
    }
  }

  async deleteTintColor(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/tint-color/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting tint color:', error);
      throw error;
    }
  }

  // =============== LENS THICKNESS TINT COMPATIBILITY METHODS ===============
  async getCompatibleTintsForThickness(thicknessId: number): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(
        `/api/v1/lens-thickness/${thicknessId}/compatible-tints`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching compatible tints for thickness:', error);
      throw error;
    }
  }

  async getCompatibleThicknessesForTint(tintId: number): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(
        `/api/v1/lens-tint/${tintId}/compatible-thicknesses`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching compatible thicknesses for tint:', error);
      throw error;
    }
  }

  async createTintThicknessCompatibility(
    tintId: number,
    thicknessIds: number[],
  ): Promise<any[]> {
    try {
      const response = await apiService.post<any[]>(
        `/api/v1/lens-tint/${tintId}/add-thicknesses`,
        { lensThicknessIds: thicknessIds },
      );
      return response;
    } catch (error) {
      console.error('Error creating tint thickness compatibility:', error);
      throw error;
    }
  }

  async removeAllThicknessesFromTint(tintId: number): Promise<boolean> {
    try {
      await apiService.delete(
        `/api/v1/lens-tint/${tintId}/remove-all-thicknesses`,
      );
      return true;
    } catch (error) {
      console.error('Error removing all thicknesses from tint:', error);
      throw error;
    }
  }

  async createThicknessTintCompatibility(
    thicknessId: number,
    tintIds: number[],
  ): Promise<any[]> {
    try {
      const response = await apiService.post<any[]>(
        `/api/v1/lens-thickness/${thicknessId}/add-tints`,
        { tintIds: tintIds },
      );
      return response;
    } catch (error) {
      console.error('Error creating thickness tint compatibility:', error);
      throw error;
    }
  }

  async deleteThicknessTintRelationship(
    relationshipId: number,
  ): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens-thickness-tint/${relationshipId}`);
      return true;
    } catch (error) {
      console.error('Error deleting thickness tint relationship:', error);
      throw error;
    }
  }

  async getCompatibilityMatrix(): Promise<any> {
    try {
      const response = await apiService.get<any>(
        '/api/v1/lens-thickness-tint/compatibility-matrix',
      );
      return response;
    } catch (error) {
      console.error('Error fetching compatibility matrix:', error);
      throw error;
    }
  }

  // =============== LENS UPGRADE METHODS ===============
  async getLensUpgrades(
    filters?: LensUpgradeFilters,
  ): Promise<LensUpgradeResponse> {
    try {
      console.log('Fetching lens upgrades with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await apiService.get<any>(
        `/lens-upgrades?${params.toString()}`,
      );
      console.log('Lens upgrade response:', response);

      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lensUpgrades || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lens upgrades:', error);
      throw error;
    }
  }

  async getLensUpgradeById(id: number): Promise<LensUpgrade> {
    try {
      const response = await apiService.get<LensUpgrade>(
        `/lens-upgrades/${id}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching lens upgrade by id:', error);
      throw error;
    }
  }

  async createLensUpgrade(data: CreateLensUpgradeDto): Promise<LensUpgrade> {
    try {
      const response = await apiService.post<LensUpgrade>(
        '/lens-upgrades',
        data,
      );
      return response;
    } catch (error) {
      console.error('Error creating lens upgrade:', error);
      throw error;
    }
  }

  async updateLensUpgrade(
    id: number,
    data: UpdateLensUpgradeDto,
  ): Promise<LensUpgrade> {
    try {
      const response = await apiService.patch<LensUpgrade>(
        `/lens-upgrades/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating lens upgrade:', error);
      throw error;
    }
  }

  async deleteLensUpgrade(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/lens-upgrades/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting lens upgrade:', error);
      throw error;
    }
  }

  // =============== LENS DETAIL METHODS ===============
  async getLensDetails(filters?: {
    lensId?: number;
  }): Promise<LensDetailResponse> {
    try {
      console.log('Fetching lens details with filters:', filters);
      const params = new URLSearchParams();

      if (filters?.lensId) params.append('lensId', filters.lensId.toString());

      const response = await apiService.get<any>(
        `/lens-details?${params.toString()}`,
      );
      console.log('Lens detail response:', response);

      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lensDetails || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lens details:', error);
      throw error;
    }
  }

  async getLensDetailById(id: number): Promise<LensDetail> {
    try {
      const response = await apiService.get<LensDetail>(`/lens-details/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching lens detail by id:', error);
      throw error;
    }
  }

  async createLensDetail(data: CreateLensDetailDto): Promise<LensDetail> {
    try {
      const response = await apiService.post<LensDetail>('/lens-details', data);
      return response;
    } catch (error) {
      console.error('Error creating lens detail:', error);
      throw error;
    }
  }

  async updateLensDetail(
    id: number,
    data: UpdateLensDetailDto,
  ): Promise<LensDetail> {
    try {
      const response = await apiService.patch<LensDetail>(
        `/lens-details/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating lens detail:', error);
      throw error;
    }
  }

  async deleteLensDetail(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/lens-details/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting lens detail:', error);
      throw error;
    }
  }

  // =============== LENS UPGRADE DETAIL METHODS ===============
  async getLensUpgradeDetails(): Promise<LensUpgradeDetailResponse> {
    try {
      console.log('Fetching lens upgrade details');

      const response = await apiService.get<any>(
        '/api/v1/lens-upgrade-detail/list',
      );
      console.log('Lens upgrade detail response:', response);

      if (Array.isArray(response)) {
        return { data: response, total: response.length };
      }

      return {
        data: response.data || response.lensUpgradeDetails || [],
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Error fetching lens upgrade details:', error);
      throw error;
    }
  }

  async getLensUpgradeDetailById(id: number): Promise<LensUpgradeDetail> {
    try {
      const response = await apiService.get<LensUpgradeDetail>(
        `/api/v1/lens-upgrade-detail/${id}/detail`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching lens upgrade detail by id:', error);
      throw error;
    }
  }

  async createLensUpgradeDetail(
    data: CreateLensUpgradeDetailDto,
  ): Promise<LensUpgradeDetail> {
    try {
      const response = await apiService.post<LensUpgradeDetail>(
        '/api/v1/lens-upgrade-detail/create',
        data,
      );
      return response;
    } catch (error) {
      console.error('Error creating lens upgrade detail:', error);
      throw error;
    }
  }

  async updateLensUpgradeDetail(
    id: number,
    data: UpdateLensUpgradeDetailDto,
  ): Promise<LensUpgradeDetail> {
    try {
      const response = await apiService.put<LensUpgradeDetail>(
        `/api/v1/lens-upgrade-detail/${id}`,
        data,
      );
      return response;
    } catch (error) {
      console.error('Error updating lens upgrade detail:', error);
      throw error;
    }
  }

  async deleteLensUpgradeDetail(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/api/v1/lens-upgrade-detail/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting lens upgrade detail:', error);
      throw error;
    }
  }

  // =============== CALCULATION METHODS ===============
  async calculateLensPrice(lensDetailId: number): Promise<number> {
    try {
      const response = await apiService.get<{ price: number }>(
        `/lens-details/${lensDetailId}/price`,
      );
      return response.price || 0;
    } catch (error) {
      console.error('Error calculating lens price:', error);
      throw error;
    }
  }

  async calculateUpgradesPrice(upgradeIds: number[]): Promise<number> {
    try {
      const response = await apiService.post<{ totalPrice: number }>(
        '/lens-upgrades/calculate-price',
        {
          upgradeIds,
        },
      );
      return response.totalPrice || 0;
    } catch (error) {
      console.error('Error calculating upgrades price:', error);
      throw error;
    }
  }
}

export const lensService = new LensService();
