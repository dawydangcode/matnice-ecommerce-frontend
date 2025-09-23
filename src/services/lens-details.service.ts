import { apiService } from './api.service';

export interface LensThickness {
  id: string;
  name: string;
  indexValue: number;
  price: string;
  description: string;
}

export interface RefractionRange {
  id: string;
  refractionType: string;
  minValue: string;
  maximumValue: string;
  stepValue: string;
}

export interface TintColor {
  id: string;
  name: string;
  colorCode: string;
  price: string;
}

export interface LensVariant {
  id: string;
  lensThicknessId: string;
  design: string;
  material: string;
  price: string;
  stock: number;
  refractionRanges: RefractionRange[];
  tintColors: TintColor[];
  lensThickness: LensThickness;
}

export interface LensCoating {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface LensImage {
  id: string;
  imageUrl: string;
  imageOrder: string;
  isThumbnail: boolean;
}

export interface BrandLens {
  id: string;
  name: string;
  description: string;
}

export interface LensCategory {
  id: string;
  name: string;
  description: string;
}

export interface LensFullDetails {
  lens: {
    id: string;
    name: string;
    origin: string;
    lensType: string;
    status: string;
    description: string;
    createdAt: string;
    brandLens: BrandLens;
  };
  categories: LensCategory[];
  variants: LensVariant[];
  coatings: LensCoating[];
  images: LensImage[];
  summary: {
    totalVariants: number;
    totalCoatings: number;
    totalImages: number;
    priceRange: {
      min: number;
      max: number;
    };
    availableStock: number;
  };
}

export interface SelectedLensOptions {
  variant?: LensVariant;
  coatings: LensCoating[];
  tintColor?: TintColor;
}

class LensDetailsService {
  private readonly baseURL = '/api/v1/lens';

  async getLensFullDetails(lensId: string): Promise<LensFullDetails> {
    const response = await apiService.get<LensFullDetails>(
      `${this.baseURL}/${lensId}/full-details`,
    );
    return response;
  }
}

const lensDetailsService = new LensDetailsService();
export default lensDetailsService;
