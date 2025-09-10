import { apiService } from './api.service';

export interface Product3DModel {
  id: number;
  productId: number;
  modelName: string;
  modelFilePath: string;
  modelType: string;
  mtlFilePath?: string;
  textureBasePath?: string;
  configJson?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy?: number;
  updatedAt: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
}

export interface CreateProduct3DModelRequest {
  productId: number;
  modelName: string;
  modelFilePath: string;
  modelType: string;
  mtlFilePath?: string;
  textureBasePath?: string;
  configJson?: string;
  isActive?: boolean;
}

export interface UpdateProduct3DModelRequest {
  modelName?: string;
  modelFilePath?: string;
  modelType?: string;
  mtlFilePath?: string;
  textureBasePath?: string;
  configJson?: string;
  isActive?: boolean;
}

export interface Model3DConfig {
  id: number;
  modelId: number;
  offsetX: number;
  offsetY: number;
  positionOffsetX: number;
  positionOffsetY: number;
  positionOffsetZ: number;
  initialScale: number;
  rotationSensitivity: number;
  yawLimit: number;
  pitchLimit: number;
  createdAt: Date;
  createdBy?: number;
  updatedAt: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
}

export interface CreateModel3DConfigRequest {
  modelId: number;
  offsetX?: number;
  offsetY?: number;
  positionOffsetX?: number;
  positionOffsetY?: number;
  positionOffsetZ?: number;
  initialScale?: number;
  rotationSensitivity?: number;
  yawLimit?: number;
  pitchLimit?: number;
}

export interface UpdateModel3DConfigRequest {
  offsetX?: number;
  offsetY?: number;
  positionOffsetX?: number;
  positionOffsetY?: number;
  positionOffsetZ?: number;
  initialScale?: number;
  rotationSensitivity?: number;
  yawLimit?: number;
  pitchLimit?: number;
}

export interface StorageStats {
  totalFiles: number;
  activeFiles: number;
  byType: Record<string, number>;
}

export interface UploadedFile {
  originalName: string;
  fileName: string;
  url: string;
  size: number;
  mimeType: string;
  fileType: string;
}

export interface UploadResponse {
  message: string;
  files: UploadedFile[];
  folderName: string;
  productId: number;
}

class Product3DModelService {
  private readonly baseURL = '/product-3d-model';
  private readonly configBaseURL = '/api/v1/model-3d-config';

  // Product 3D Model CRUD operations
  async getAll(): Promise<Product3DModel[]> {
    return await apiService.get<Product3DModel[]>(this.baseURL);
  }

  async getByProductId(productId: number): Promise<Product3DModel> {
    return await apiService.get<Product3DModel>(
      `${this.baseURL}/product/${productId}`,
    );
  }

  async getActiveByProductId(productId: number): Promise<Product3DModel[]> {
    return await apiService.get<Product3DModel[]>(
      `${this.baseURL}/product/${productId}/active`,
    );
  }

  async getById(id: number): Promise<Product3DModel> {
    return await apiService.get<Product3DModel>(`${this.baseURL}/${id}`);
  }

  async create(data: CreateProduct3DModelRequest): Promise<Product3DModel> {
    return await apiService.post<Product3DModel>(this.baseURL, data);
  }

  async update(
    id: number,
    data: UpdateProduct3DModelRequest,
  ): Promise<Product3DModel> {
    return await apiService.patch<Product3DModel>(
      `${this.baseURL}/${id}`,
      data,
    );
  }

  async setActive(id: number, isActive: boolean): Promise<Product3DModel> {
    return await apiService.patch<Product3DModel>(
      `${this.baseURL}/${id}/set-active`,
      {
        isActive,
      },
    );
  }

  async delete(id: number): Promise<boolean> {
    await apiService.delete(`${this.baseURL}/${id}`);
    return true;
  }

  async getByModelType(modelType: string): Promise<Product3DModel[]> {
    return await apiService.get<Product3DModel[]>(
      `${this.baseURL}/type/${modelType}`,
    );
  }

  async getStorageStats(): Promise<StorageStats> {
    return await apiService.get<StorageStats>(`${this.baseURL}/stats/storage`);
  }

  async uploadFiles(
    files: File[],
    productId: number,
    folderName?: string,
    onProgress?: (progress: number) => void,
  ): Promise<UploadResponse> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('productId', productId.toString());
    if (folderName) {
      formData.append('folderName', folderName);
    }

    // Use postFormData for file uploads
    return await apiService.postFormData<UploadResponse>(
      `${this.baseURL}/upload`,
      formData,
    );
  }

  // Model 3D Config CRUD operations
  async getConfigByModelId(modelId: number): Promise<Model3DConfig | null> {
    try {
      // Since backend doesn't have endpoint to get by modelId, we'll get all and filter
      // This is not optimal but matches current backend structure
      const allConfigs = await apiService.get<Model3DConfig[]>(
        `${this.configBaseURL}/list`,
      );
      const config = allConfigs.find((c) => c.modelId === modelId);
      return config || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getConfigById(id: number): Promise<Model3DConfig> {
    return await apiService.get<Model3DConfig>(
      `${this.configBaseURL}/${id}/detail`,
    );
  }

  async createConfig(data: CreateModel3DConfigRequest): Promise<Model3DConfig> {
    return await apiService.post<Model3DConfig>(
      `${this.configBaseURL}/create`,
      data,
    );
  }

  async updateConfig(
    id: number,
    data: UpdateModel3DConfigRequest,
  ): Promise<Model3DConfig> {
    return await apiService.put<Model3DConfig>(
      `${this.configBaseURL}/${id}/update`,
      data,
    );
  }

  async deleteConfig(id: number): Promise<boolean> {
    await apiService.delete(`${this.configBaseURL}/${id}/delete`);
    return true;
  }
}

export const product3DModelService = new Product3DModelService();
