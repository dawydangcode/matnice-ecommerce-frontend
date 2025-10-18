import { PageList } from '../types/page-list.model';
import { apiService } from './api.service';

export interface UserPrescription {
  id: number;
  userId: number;
  rightEyeSph: number;
  rightEyeCyl: number;
  rightEyeAxis: number;
  rightEyeAdd?: number;
  leftEyeSph: number;
  leftEyeCyl: number;
  leftEyeAxis: number;
  leftEyeAdd?: number;
  pdRight: number;
  pdLeft: number;
  isDefault: boolean;
  notes?: string;
  createdAt?: string;
}

export type CreateUserPrescriptionDto = Omit<
  UserPrescription,
  'id' | 'userId' | 'createdAt'
>;
export type UpdateUserPrescriptionDto = Partial<CreateUserPrescriptionDto>;

const userPrescriptionService = {
  async getPrescriptions(
    page = 1,
    limit = 10,
  ): Promise<PageList<UserPrescription>> {
    const response = await apiService.get<PageList<UserPrescription>>(
      `/api/v1/user-prescription/list`,
      { params: { page, limit } },
    );
    return response;
  },

  async getPrescriptionById(id: number): Promise<UserPrescription> {
    const response = await apiService.get<UserPrescription>(
      `/api/v1/user-prescription/${id}/detail`,
    );
    return response;
  },

  async createPrescription(
    data: CreateUserPrescriptionDto,
  ): Promise<UserPrescription> {
    const response = await apiService.post<UserPrescription>(
      '/api/v1/user-prescription/create',
      data,
    );
    return response;
  },

  async updatePrescription(
    id: number,
    data: Partial<UpdateUserPrescriptionDto>,
  ): Promise<UserPrescription> {
    const response = await apiService.put<UserPrescription>(
      `/api/v1/user-prescription/${id}/update`,
      data,
    );
    return response;
  },

  async setDefaultPrescription(id: number): Promise<void> {
    await apiService.put<void>(
      `/api/v1/user-prescription/${id}/set-default`,
      {},
    );
  },

  async deletePrescription(id: number): Promise<void> {
    await apiService.delete<void>(`/api/v1/user-prescription/${id}/delete`);
  },
};

export default userPrescriptionService;
