import { apiService } from './api.service';

export interface PrescriptionData {
  sphereLeft?: number;
  sphereRight?: number;
  cylinderLeft?: number;
  cylinderRight?: number;
  addLeft?: number;
  addRight?: number;
  page?: number;
  limit?: number;
}

export interface FilteredLens {
  id: string;
  name: string;
  description: string;
  lensType: string;
  origin: string;
  status: string;
  basePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  brandLens: {
    id: string;
    name: string;
    description: string;
  } | null;
  imageUrl: string;
  imageOrder: string;
  isThumbnail: boolean;
}

export interface LensPrescriptionFilterResponse {
  data: FilteredLens[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class LensPrescriptionService {
  async filterLensesByPrescription(
    prescriptionData: PrescriptionData,
    lensType?: string,
  ): Promise<LensPrescriptionFilterResponse> {
    try {
      const params = new URLSearchParams();

      if (prescriptionData.sphereLeft !== undefined) {
        params.append('sphereLeft', prescriptionData.sphereLeft.toString());
      }
      if (prescriptionData.sphereRight !== undefined) {
        params.append('sphereRight', prescriptionData.sphereRight.toString());
      }
      if (prescriptionData.cylinderLeft !== undefined) {
        params.append('cylinderLeft', prescriptionData.cylinderLeft.toString());
      }
      if (prescriptionData.cylinderRight !== undefined) {
        params.append(
          'cylinderRight',
          prescriptionData.cylinderRight.toString(),
        );
      }
      if (prescriptionData.addLeft !== undefined) {
        params.append('addLeft', prescriptionData.addLeft.toString());
      }
      if (prescriptionData.addRight !== undefined) {
        params.append('addRight', prescriptionData.addRight.toString());
      }

      // Add lens type filter
      if (lensType) {
        params.append('lensType', lensType);
      }

      params.append('page', (prescriptionData.page || 1).toString());
      params.append('limit', (prescriptionData.limit || 12).toString());

      const response = await apiService.get<LensPrescriptionFilterResponse>(
        `/api/v1/lens/filter-by-prescription?${params.toString()}`,
      );
      return response;
    } catch (error) {
      console.error('Error filtering lenses by prescription:', error);
      throw error;
    }
  }
}

const lensPrescriptionService = new LensPrescriptionService();
export default lensPrescriptionService;
