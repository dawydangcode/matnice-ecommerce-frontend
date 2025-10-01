import { apiService } from './api.service';

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface UserDetail {
  id: number;
  userId: number;
  name?: string;
  dob?: Date;
  gender?: GenderType;
  created_at: Date;
  created_by: number;
  updated_at: Date;
  updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
}

export interface CreateUserDetailRequest {
  userId: number;
  name?: string;
  dob?: Date;
  gender?: GenderType;
}

export interface UpdateUserDetailRequest {
  userId?: number;
  name?: string;
  dob?: Date;
  gender?: GenderType;
}

class UserDetailService {
  // Get user detail by user ID
  async getUserDetailByUserId(userId: number): Promise<UserDetail> {
    try {
      console.log(
        'UserDetailService.getUserDetailByUserId: Fetching user detail for user:',
        userId,
      );

      const response = await apiService.get<UserDetail>(
        `/api/v1/user/${userId}/user-detail`,
      );

      console.log('UserDetailService.getUserDetailByUserId: Success', response);
      return response;
    } catch (error) {
      console.error('UserDetailService.getUserDetailByUserId: Error', error);
      throw error;
    }
  }

  // Get user detail by ID
  async getUserDetail(userDetailId: number): Promise<UserDetail> {
    try {
      console.log(
        'UserDetailService.getUserDetail: Fetching user detail:',
        userDetailId,
      );

      const response = await apiService.get<UserDetail>(
        `/api/v1/user-detail/${userDetailId}/detail`,
      );

      console.log('UserDetailService.getUserDetail: Success', response);
      return response;
    } catch (error) {
      console.error('UserDetailService.getUserDetail: Error', error);
      throw error;
    }
  }

  // Create user detail
  async createUserDetail(
    detailData: CreateUserDetailRequest,
  ): Promise<UserDetail> {
    try {
      console.log(
        'UserDetailService.createUserDetail: Creating user detail:',
        detailData,
      );

      const response = await apiService.post<UserDetail>(
        '/api/v1/user-detail/create',
        detailData,
      );

      console.log('UserDetailService.createUserDetail: Success', response);
      return response;
    } catch (error) {
      console.error('UserDetailService.createUserDetail: Error', error);
      throw error;
    }
  }

  // Update user detail
  async updateUserDetail(
    userDetailId: number,
    detailData: UpdateUserDetailRequest,
  ): Promise<UserDetail> {
    try {
      console.log(
        'UserDetailService.updateUserDetail: Updating user detail:',
        userDetailId,
        detailData,
      );

      const response = await apiService.put<UserDetail>(
        `/api/v1/user-detail/${userDetailId}/update`,
        detailData,
      );

      console.log('UserDetailService.updateUserDetail: Success', response);
      return response;
    } catch (error) {
      console.error('UserDetailService.updateUserDetail: Error', error);
      throw error;
    }
  }

  // Delete user detail
  async deleteUserDetail(userDetailId: number): Promise<boolean> {
    try {
      console.log(
        'UserDetailService.deleteUserDetail: Deleting user detail:',
        userDetailId,
      );

      await apiService.delete(`/api/v1/user-detail/${userDetailId}/delete`);

      console.log('UserDetailService.deleteUserDetail: Success');
      return true;
    } catch (error) {
      console.error('UserDetailService.deleteUserDetail: Error', error);
      throw error;
    }
  }

  // Format gender display name
  getGenderDisplayName(gender?: GenderType): string {
    const genderMap: Record<GenderType, string> = {
      [GenderType.MALE]: 'Nam',
      [GenderType.FEMALE]: 'Nữ',
      [GenderType.OTHER]: 'Khác',
    };
    return gender ? genderMap[gender] : 'Chưa xác định';
  }

  // Format date of birth
  formatDateOfBirth(dob?: Date): string {
    if (!dob) return 'Chưa cập nhật';
    return new Date(dob).toLocaleDateString('vi-VN');
  }

  // Calculate age from date of birth
  calculateAge(dob?: Date): number | null {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

const userDetailService = new UserDetailService();
export default userDetailService;
