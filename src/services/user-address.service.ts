import { apiService } from './api.service';

export interface UserAddress {
  id: number;
  userId: number;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  notes?: string;
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
}

export interface CreateUserAddressRequest {
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  notes?: string;
}

export interface UpdateUserAddressRequest {
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  isDefault?: boolean;
  notes?: string;
}

class UserAddressService {
  // Get all addresses of current user
  async getUserAddresses(userId: number): Promise<UserAddress[]> {
    try {
      console.log(
        'UserAddressService.getUserAddresses: Fetching addresses for user:',
        userId,
      );

      const response = await apiService.get<UserAddress[]>(
        `/api/v1/user-address/${userId}/user`,
      );

      console.log('UserAddressService.getUserAddresses: Success', response);
      return response;
    } catch (error) {
      console.error('UserAddressService.getUserAddresses: Error', error);
      throw error;
    }
  }

  // Get address by ID
  async getUserAddressById(addressId: number): Promise<UserAddress> {
    try {
      console.log(
        'UserAddressService.getUserAddressById: Fetching address:',
        addressId,
      );

      const response = await apiService.get<UserAddress>(
        `/api/v1/user-address/${addressId}/detail`,
      );

      console.log('UserAddressService.getUserAddressById: Success', response);
      return response;
    } catch (error) {
      console.error('UserAddressService.getUserAddressById: Error', error);
      throw error;
    }
  }

  // Create new address
  async createUserAddress(
    userId: number,
    addressData: CreateUserAddressRequest,
  ): Promise<UserAddress> {
    try {
      console.log(
        'UserAddressService.createUserAddress: Creating address for user:',
        userId,
        addressData,
      );

      const response = await apiService.post<UserAddress>(
        `/api/v1/user-address/create?userId=${userId}`,
        addressData,
      );

      console.log('UserAddressService.createUserAddress: Success', response);
      return response;
    } catch (error) {
      console.error('UserAddressService.createUserAddress: Error', error);
      throw error;
    }
  }

  // Update address
  async updateUserAddress(
    addressId: number,
    addressData: UpdateUserAddressRequest,
  ): Promise<UserAddress> {
    try {
      console.log(
        'UserAddressService.updateUserAddress: Updating address:',
        addressId,
        addressData,
      );

      const response = await apiService.put<UserAddress>(
        `/api/v1/user-address/${addressId}/update`,
        addressData,
      );

      console.log('UserAddressService.updateUserAddress: Success', response);
      return response;
    } catch (error) {
      console.error('UserAddressService.updateUserAddress: Error', error);
      throw error;
    }
  }

  // Delete address
  async deleteUserAddress(addressId: number): Promise<boolean> {
    try {
      console.log(
        'UserAddressService.deleteUserAddress: Deleting address:',
        addressId,
      );

      await apiService.delete(`/api/v1/user-address/${addressId}/delete`);

      console.log('UserAddressService.deleteUserAddress: Success');
      return true;
    } catch (error) {
      console.error('UserAddressService.deleteUserAddress: Error', error);
      throw error;
    }
  }

  // Set address as default
  async setDefaultAddress(addressId: number): Promise<UserAddress> {
    try {
      console.log(
        'UserAddressService.setDefaultAddress: Setting default address:',
        addressId,
      );

      const response = await apiService.put<UserAddress>(
        `/api/v1/user-address/${addressId}/set-default`,
      );

      console.log('UserAddressService.setDefaultAddress: Success', response);
      return response;
    } catch (error) {
      console.error('UserAddressService.setDefaultAddress: Error', error);
      throw error;
    }
  }

  // Format full address
  formatFullAddress(address: UserAddress): string {
    const parts = [
      address.addressDetail,
      address.ward,
      address.district,
      address.province,
    ].filter((part) => part && part.trim());

    return parts.join(', ');
  }
}

const userAddressService = new UserAddressService();
export default userAddressService;
