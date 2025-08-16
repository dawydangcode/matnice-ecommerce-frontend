import { apiService } from './api.service';

export interface CreateLensDetailDto {
  lensId: number;
  lensThicknessId?: number;
  lensQualityId?: number;
  tintId?: number;
  powerSphereLeft?: number;
  powerSphereRight?: number;
  powerCylinderLeft?: number;
  powerCylinderRight?: number;
  axisLeft?: number;
  axisRight?: number;
  pdLeft?: number;
  pdRight?: number;
  prescriptionDate?: Date;
  lensType: string;
  hasAxisCorrection: boolean;
  isNonPrescription: boolean;
}

export interface LensDetailModel {
  id: number;
  lensId: number;
  lensThicknessId?: number;
  lensQualityId?: number;
  tintId?: number;
  powerSphereLeft?: number;
  powerSphereRight?: number;
  powerCylinderLeft?: number;
  powerCylinderRight?: number;
  axisLeft?: number;
  axisRight?: number;
  pdLeft?: number;
  pdRight?: number;
  prescriptionDate?: Date;
  lensType: string;
  hasAxisCorrection: boolean;
  isNonPrescription: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  deletedAt?: Date;
  deletedBy?: number;
}

export interface LensDetailResponse {
  data: LensDetailModel[];
  message: string;
}

class LensDetailService {
  private readonly baseUrl = '/lens-details';

  async getLensDetails(): Promise<LensDetailModel[]> {
    const response = await apiService.get<LensDetailResponse>(this.baseUrl);
    return response.data;
  }

  async getLensDetailById(id: number): Promise<LensDetailModel> {
    const response = await apiService.get<{
      data: LensDetailModel;
      message: string;
    }>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getLensDetailsByLensId(lensId: number): Promise<LensDetailModel[]> {
    const response = await apiService.get<LensDetailResponse>(
      `${this.baseUrl}/lens/${lensId}`,
    );
    return response.data;
  }

  async createLensDetail(data: CreateLensDetailDto): Promise<LensDetailModel> {
    const response = await apiService.post<{
      data: LensDetailModel;
      message: string;
    }>(this.baseUrl, data);
    return response.data;
  }

  async updateLensDetail(
    id: number,
    data: Partial<CreateLensDetailDto>,
  ): Promise<LensDetailModel> {
    const response = await apiService.patch<{
      data: LensDetailModel;
      message: string;
    }>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteLensDetail(id: number): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }
}

export const lensDetailService = new LensDetailService();
