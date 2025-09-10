import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, File, FolderOpen, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/product.service';
import { product3DModelService } from '../../services/product3dModel.service';

interface ProductInfo {
  productId: number;
  productName: string;
  productNumber?: string;
}

interface FileUploadState {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

interface Model3DFormData {
  modelName: string;
  modelType: 'OBJ' | 'GLB';
  description: string;
  isActive: boolean;
  version: string;
  files: {
    modelFile: FileUploadState;
    mtlFile: FileUploadState;
    textureFiles: {
      diffuse?: FileUploadState;
      normal?: FileUploadState;
      metallic?: FileUploadState;
      roughness?: FileUploadState;
      pbr?: FileUploadState;
    };
  };
}

export const AddProduct3DModel: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Model3DFormData>({
    modelName: '',
    modelType: 'GLB',
    description: '',
    isActive: true,
    version: '1.0',
    files: {
      modelFile: { file: null, status: 'idle', progress: 0 },
      mtlFile: { file: null, status: 'idle', progress: 0 },
      textureFiles: {
        diffuse: { file: null, status: 'idle', progress: 0 },
        normal: { file: null, status: 'idle', progress: 0 },
        metallic: { file: null, status: 'idle', progress: 0 },
        roughness: { file: null, status: 'idle', progress: 0 },
        pbr: { file: null, status: 'idle', progress: 0 },
      }
    }
  });

  const loadProduct = useCallback(async () => {
    try {
      if (!productId) return;
      const response = await productService.getProductById(parseInt(productId));
      setProduct(response);
      
      // Auto-generate model name based on product
      setFormData(prev => ({
        ...prev,
        modelName: `${response.productName} - 3D Model`
      }));
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId, loadProduct]);

  const handleInputChange = (field: keyof Omit<Model3DFormData, 'files'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (fileType: string, textureType?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch (fileType) {
      case 'model':
        input.accept = formData.modelType === 'GLB' ? '.glb' : '.obj';
        break;
      case 'mtl':
        input.accept = '.mtl';
        break;
      case 'texture':
        input.accept = '.png,.jpg,.jpeg,.webp';
        break;
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        updateFileState(fileType, file, textureType);
      }
    };

    input.click();
  };

  const updateFileState = (fileType: string, file: File, textureType?: string) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      
      if (fileType === 'model') {
        newFormData.files.modelFile = {
          file,
          status: 'idle',
          progress: 0
        };
      } else if (fileType === 'mtl') {
        newFormData.files.mtlFile = {
          file,
          status: 'idle',
          progress: 0
        };
      } else if (fileType === 'texture' && textureType) {
        newFormData.files.textureFiles[textureType as keyof typeof newFormData.files.textureFiles] = {
          file,
          status: 'idle',
          progress: 0
        };
      }
      
      return newFormData;
    });
  };

  const removeFile = (fileType: string, textureType?: string) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      
      if (fileType === 'model') {
        newFormData.files.modelFile = { file: null, status: 'idle', progress: 0 };
      } else if (fileType === 'mtl') {
        newFormData.files.mtlFile = { file: null, status: 'idle', progress: 0 };
      } else if (fileType === 'texture' && textureType) {
        newFormData.files.textureFiles[textureType as keyof typeof newFormData.files.textureFiles] = {
          file: null,
          status: 'idle',
          progress: 0
        };
      }
      
      return newFormData;
    });
  };

  const uploadFile = async (fileState: FileUploadState, fileType: string, textureType?: string) => {
    if (!fileState.file || !productId) return;

    try {
      // Update status to uploading
      setFormData(prev => {
        const newFormData = { ...prev };
        if (fileType === 'model') {
          newFormData.files.modelFile.status = 'uploading';
        } else if (fileType === 'mtl') {
          newFormData.files.mtlFile.status = 'uploading';
        } else if (fileType === 'texture' && textureType) {
          const textureFile = newFormData.files.textureFiles[textureType as keyof typeof newFormData.files.textureFiles];
          if (textureFile) textureFile.status = 'uploading';
        }
        return newFormData;
      });

      const result = await product3DModelService.uploadFiles(
        [fileState.file],
        parseInt(productId)
      );

      // Update status to success
      setFormData(prev => {
        const newFormData = { ...prev };
        if (fileType === 'model') {
          newFormData.files.modelFile.status = 'success';
          newFormData.files.modelFile.url = result.files[0]?.url;
        } else if (fileType === 'mtl') {
          newFormData.files.mtlFile.status = 'success';
          newFormData.files.mtlFile.url = result.files[0]?.url;
        } else if (fileType === 'texture' && textureType) {
          const textureFile = newFormData.files.textureFiles[textureType as keyof typeof newFormData.files.textureFiles];
          if (textureFile) {
            textureFile.status = 'success';
            textureFile.url = result.files[0]?.url;
          }
        }
        return newFormData;
      });

      toast.success(`Upload ${fileType} file thành công!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Update status to error
      setFormData(prev => {
        const newFormData = { ...prev };
        if (fileType === 'model') {
          newFormData.files.modelFile.status = 'error';
          newFormData.files.modelFile.error = 'Upload failed';
        } else if (fileType === 'mtl') {
          newFormData.files.mtlFile.status = 'error';
          newFormData.files.mtlFile.error = 'Upload failed';
        } else if (fileType === 'texture' && textureType) {
          const textureFile = newFormData.files.textureFiles[textureType as keyof typeof newFormData.files.textureFiles];
          if (textureFile) {
            textureFile.status = 'error';
            textureFile.error = 'Upload failed';
          }
        }
        return newFormData;
      });

      toast.error(`Lỗi upload ${fileType} file`);
    }
  };

  const uploadAllFiles = async () => {
    const filesToUpload: Array<{ fileState: FileUploadState; fileType: string; textureType?: string }> = [];

    // Collect all files to upload
    if (formData.files.modelFile.file && formData.files.modelFile.status === 'idle') {
      filesToUpload.push({ fileState: formData.files.modelFile, fileType: 'model' });
    }
    if (formData.files.mtlFile.file && formData.files.mtlFile.status === 'idle') {
      filesToUpload.push({ fileState: formData.files.mtlFile, fileType: 'mtl' });
    }

    Object.entries(formData.files.textureFiles).forEach(([textureType, fileState]) => {
      if (fileState?.file && fileState.status === 'idle') {
        filesToUpload.push({ fileState, fileType: 'texture', textureType });
      }
    });

    // Upload all files
    for (const { fileState, fileType, textureType } of filesToUpload) {
      await uploadFile(fileState, fileType, textureType);
    }
  };

  const validateForm = () => {
    if (!formData.modelName.trim()) {
      toast.error('Vui lòng nhập tên model');
      return false;
    }
    if (!formData.files.modelFile.file) {
      toast.error('Vui lòng chọn file model');
      return false;
    }
    if (formData.modelType === 'OBJ' && !formData.files.mtlFile.file) {
      toast.error('File OBJ cần có file MTL đi kèm');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!productId) return;

    setLoading(true);
    try {
      // Upload all files first
      await uploadAllFiles();

      // Create 3D model entry
      const createData = {
        productId: parseInt(productId),
        modelName: formData.modelName,
        modelFilePath: formData.files.modelFile.url || '',
        modelType: formData.modelType,
        mtlFilePath: formData.files.mtlFile.url || '',
        textureBasePath: formData.files.textureFiles.diffuse?.url || '',
        isActive: formData.isActive,
        configJson: JSON.stringify({
          textureDiffusePath: formData.files.textureFiles.diffuse?.url || '',
          textureNormalPath: formData.files.textureFiles.normal?.url || '',
          textureMetallicPath: formData.files.textureFiles.metallic?.url || '',
          textureRoughnessPath: formData.files.textureFiles.roughness?.url || '',
          texturePbrPath: formData.files.textureFiles.pbr?.url || '',
          description: formData.description,
          version: formData.version
        })
      };

      await product3DModelService.create(createData);
      toast.success('Tạo 3D model thành công!');
      navigate(`/admin/products/${productId}/3d-models`);
    } catch (error) {
      console.error('Error creating 3D model:', error);
      toast.error('Lỗi tạo 3D model');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadCard: React.FC<{
    title: string;
    description: string;
    fileState: FileUploadState;
    onSelect: () => void;
    onRemove: () => void;
    onUpload: () => void;
    accept: string;
    required?: boolean;
  }> = ({ title, description, fileState, onSelect, onRemove, onUpload, accept, required = false }) => (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            {title}
            {required && <span className="text-red-500">*</span>}
          </h4>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xs text-gray-500 mt-1">Định dạng: {accept}</p>
        </div>
        {fileState.status === 'success' && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {fileState.status === 'error' && (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
      </div>

      {!fileState.file ? (
        <button
          onClick={onSelect}
          className="w-full flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <FolderOpen className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Chọn file {title.toLowerCase()}</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-sm">{fileState.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {fileState.status === 'uploading' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${fileState.progress}%` } as React.CSSProperties}
              />
            </div>
          )}

          {fileState.status === 'idle' && (
            <button
              onClick={onUpload}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          )}

          {fileState.status === 'success' && (
            <div className="text-green-600 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Upload thành công
            </div>
          )}

          {fileState.status === 'error' && (
            <div className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Upload thất bại: {fileState.error}
              <button
                onClick={onUpload}
                className="ml-2 text-blue-500 hover:underline"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/admin/products/${productId}/3d-models`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Thêm 3D Model mới
                </h1>
                <p className="text-sm text-gray-600">
                  {product.productName} (#{product.productNumber})
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/products/${productId}/3d-models`)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                Tạo 3D Model
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Thông tin cơ bản
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) => handleInputChange('modelName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên model..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại Model <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.modelType}
                  onChange={(e) => handleInputChange('modelType', e.target.value as 'OBJ' | 'GLB')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="GLB">GLB (Khuyến nghị)</option>
                  <option value="OBJ">OBJ (Cần file MTL)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  GLB là định dạng được khuyến nghị cho 3D models
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phiên bản
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả về model 3D này..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Kích hoạt model này
                </label>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-6">
            {/* Model File */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                File Model Chính
              </h2>
              
              <FileUploadCard
                title="Model File"
                description={`File model ${formData.modelType} chính`}
                fileState={formData.files.modelFile}
                onSelect={() => handleFileSelect('model')}
                onRemove={() => removeFile('model')}
                onUpload={() => uploadFile(formData.files.modelFile, 'model')}
                accept={formData.modelType === 'GLB' ? '.glb' : '.obj'}
                required
              />
            </div>

            {/* MTL File - Only for OBJ */}
            {formData.modelType === 'OBJ' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Material File
                </h2>
                
                <FileUploadCard
                  title="MTL File"
                  description="File material định nghĩa chất liệu cho model OBJ"
                  fileState={formData.files.mtlFile}
                  onSelect={() => handleFileSelect('mtl')}
                  onRemove={() => removeFile('mtl')}
                  onUpload={() => uploadFile(formData.files.mtlFile, 'mtl')}
                  accept=".mtl"
                  required
                />
              </div>
            )}

            {/* Texture Files */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Texture Files (Tùy chọn)
              </h2>
              
              <div className="space-y-4">
                <FileUploadCard
                  title="Diffuse Texture"
                  description="Texture màu sắc chính của model"
                  fileState={formData.files.textureFiles.diffuse!}
                  onSelect={() => handleFileSelect('texture', 'diffuse')}
                  onRemove={() => removeFile('texture', 'diffuse')}
                  onUpload={() => uploadFile(formData.files.textureFiles.diffuse!, 'texture', 'diffuse')}
                  accept=".png,.jpg,.jpeg,.webp"
                />

                <FileUploadCard
                  title="Normal Map"
                  description="Texture định nghĩa chi tiết bề mặt"
                  fileState={formData.files.textureFiles.normal!}
                  onSelect={() => handleFileSelect('texture', 'normal')}
                  onRemove={() => removeFile('texture', 'normal')}
                  onUpload={() => uploadFile(formData.files.textureFiles.normal!, 'texture', 'normal')}
                  accept=".png,.jpg,.jpeg,.webp"
                />

                <FileUploadCard
                  title="Metallic Map"
                  description="Texture định nghĩa độ kim loại"
                  fileState={formData.files.textureFiles.metallic!}
                  onSelect={() => handleFileSelect('texture', 'metallic')}
                  onRemove={() => removeFile('texture', 'metallic')}
                  onUpload={() => uploadFile(formData.files.textureFiles.metallic!, 'texture', 'metallic')}
                  accept=".png,.jpg,.jpeg,.webp"
                />

                <FileUploadCard
                  title="Roughness Map"
                  description="Texture định nghĩa độ nhám bề mặt"
                  fileState={formData.files.textureFiles.roughness!}
                  onSelect={() => handleFileSelect('texture', 'roughness')}
                  onRemove={() => removeFile('texture', 'roughness')}
                  onUpload={() => uploadFile(formData.files.textureFiles.roughness!, 'texture', 'roughness')}
                  accept=".png,.jpg,.jpeg,.webp"
                />

                <FileUploadCard
                  title="PBR Texture"
                  description="Texture tổng hợp cho Physically Based Rendering"
                  fileState={formData.files.textureFiles.pbr!}
                  onSelect={() => handleFileSelect('texture', 'pbr')}
                  onRemove={() => removeFile('texture', 'pbr')}
                  onUpload={() => uploadFile(formData.files.textureFiles.pbr!, 'texture', 'pbr')}
                  accept=".png,.jpg,.jpeg,.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct3DModel;
