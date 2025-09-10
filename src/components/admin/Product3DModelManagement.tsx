import React, { useState, useEffect } from 'react';
import { Package, Box, Upload, Eye, Plus, Edit, Trash2, Settings, Download, AlertTriangle } from 'lucide-react';
import { productService } from '../../services/product.service';
import { Product } from '../../types/product.types';
import { 
  product3DModelService, 
  Product3DModel, 
  Model3DConfig,
  CreateProduct3DModelRequest,
  UpdateProduct3DModelRequest,
  CreateModel3DConfigRequest,
  UpdateModel3DConfigRequest
} from '../../services/product3dModel.service';
import './Product3DModelManagement.css';

const showNotification = (type: 'success' | 'error', message: string) => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    background: ${type === 'success' ? '#52c41a' : '#ff4d4f'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    animation: slideIn 0.3s ease-out forwards;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 3000);
};

export const Product3DModelManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [product3DModels, setProduct3DModels] = useState<Product3DModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<Product3DModel | null>(null);
  const [modelConfig, setModelConfig] = useState<Model3DConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModelForm, setShowModelForm] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingModel, setEditingModel] = useState<Product3DModel | null>(null);
  const [editingConfig, setEditingConfig] = useState<Model3DConfig | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productResponse = await productService.getProducts({ limit: 100 });
      const productList = productResponse.products || [];
      setProducts(productList);
    } catch (error) {
      console.error('Failed to load products:', error);
      showNotification('error', 'Không thể tải danh sách sản phẩm');
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedModel(null);
    setModelConfig(null);
    loadProduct3DModels(product.productId);
  };

  const loadProduct3DModels = async (productId: number) => {
    setLoading(true);
    try {
      // Try to get active models first, fallback to single model if needed
      let models: Product3DModel[] = [];
      try {
        models = await product3DModelService.getActiveByProductId(productId);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Try to get single model if no active models found
          try {
            const singleModel = await product3DModelService.getByProductId(productId);
            models = [singleModel];
          } catch (singleError: any) {
            if (singleError.response?.status !== 404) {
              throw singleError;
            }
            // No models found at all
            models = [];
          }
        } else {
          throw error;
        }
      }
      setProduct3DModels(models);
    } catch (error) {
      console.error('Failed to load 3D models:', error);
      showNotification('error', 'Không thể tải danh sách 3D models');
      setProduct3DModels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model: Product3DModel) => {
    setSelectedModel(model);
    loadModelConfig(model.id);
  };

  const handleCreateModel = async (modelData: CreateProduct3DModelRequest) => {
    try {
      await product3DModelService.create(modelData);
      showNotification('success', 'Tạo 3D model thành công');
      if (selectedProduct) {
        loadProduct3DModels(selectedProduct.productId);
      }
    } catch (error) {
      console.error('Failed to create model:', error);
      showNotification('error', 'Không thể tạo 3D model');
    }
  };

  const handleUpdateModel = async (modelId: number, modelData: UpdateProduct3DModelRequest) => {
    try {
      await product3DModelService.update(modelId, modelData);
      showNotification('success', 'Cập nhật 3D model thành công');
      if (selectedProduct) {
        loadProduct3DModels(selectedProduct.productId);
      }
    } catch (error) {
      console.error('Failed to update model:', error);
      showNotification('error', 'Không thể cập nhật 3D model');
    }
  };

  const handleDeleteModel = async (modelId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa 3D model này?')) {
      try {
        await product3DModelService.delete(modelId);
        showNotification('success', 'Xóa 3D model thành công');
        if (selectedProduct) {
          loadProduct3DModels(selectedProduct.productId);
        }
        if (selectedModel && selectedModel.id === modelId) {
          setSelectedModel(null);
          setModelConfig(null);
        }
      } catch (error) {
        console.error('Failed to delete model:', error);
        showNotification('error', 'Không thể xóa 3D model');
      }
    }
  };

  const handleToggleModelActive = async (modelId: number, isActive: boolean) => {
    try {
      await product3DModelService.setActive(modelId, isActive);
      showNotification('success', `${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} 3D model thành công`);
      if (selectedProduct) {
        loadProduct3DModels(selectedProduct.productId);
      }
    } catch (error) {
      console.error('Failed to toggle model active:', error);
      showNotification('error', 'Không thể thay đổi trạng thái 3D model');
    }
  };

  const handleCreateConfig = async (configData: CreateModel3DConfigRequest) => {
    try {
      const config = await product3DModelService.createConfig(configData);
      setModelConfig(config);
      showNotification('success', 'Tạo cấu hình thành công');
    } catch (error) {
      console.error('Failed to create config:', error);
      showNotification('error', 'Không thể tạo cấu hình');
    }
  };

  const handleUpdateConfig = async (configId: number, configData: UpdateModel3DConfigRequest) => {
    try {
      const config = await product3DModelService.updateConfig(configId, configData);
      setModelConfig(config);
      showNotification('success', 'Cập nhật cấu hình thành công');
    } catch (error) {
      console.error('Failed to update config:', error);
      showNotification('error', 'Không thể cập nhật cấu hình');
    }
  };

  const loadModelConfig = async (modelId: number) => {
    try {
      const config = await product3DModelService.getConfigByModelId(modelId);
      setModelConfig(config);
    } catch (error) {
      console.error('Failed to load model config:', error);
      showNotification('error', 'Không thể tải cấu hình model');
      setModelConfig(null);
    }
  };

  const renderModelTypeIcon = (modelType: string) => {
    switch (modelType.toLowerCase()) {
      case 'glb':
      case 'gltf':
        return <Box className="w-4 h-4 text-blue-500" />;
      case 'obj':
        return <Box className="w-4 h-4 text-green-500" />;
      case 'fbx':
        return <Box className="w-4 h-4 text-purple-500" />;
      default:
        return <Box className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderModelStatus = (model: Product3DModel) => {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${model.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span className={`text-xs ${model.isActive ? 'text-green-600' : 'text-gray-500'}`}>
          {model.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };

  return (
    <div className="product-3d-model-management p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Panel - Product Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">1. Chọn Sản Phẩm</h2>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map(product => (
              <div
                key={product.productId}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedProduct?.productId === product.productId
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{product.productName}</h3>
                    <p className="text-xs text-gray-500">#{product.productId}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                        Brand ID: {product.brandId}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Models</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedProduct?.productId === product.productId ? product3DModels.length : '-'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Panel - 3D Models List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Box className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">2. 3D Models</h2>
            </div>
            {selectedProduct && (
              <button
                onClick={() => setShowModelForm(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Model</span>
              </button>
            )}
          </div>

          {selectedProduct ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : product3DModels.length > 0 ? (
                product3DModels.map(model => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedModel?.id === model.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {renderModelTypeIcon(model.modelType)}
                          <h3 className="font-medium text-gray-900 text-sm">{model.modelName}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{model.modelFilePath}</p>
                        {renderModelStatus(model)}
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModel(model);
                            setShowModelForm(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Chỉnh sửa model"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleModelActive(model.id, !model.isActive);
                          }}
                          className={`p-1 transition-colors ${
                            model.isActive 
                              ? 'text-gray-400 hover:text-orange-600' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title={model.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteModel(model.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa model"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Box className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có 3D model nào</p>
                  <p className="text-sm">Thêm model đầu tiên cho sản phẩm này</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Package className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg mb-2">Chọn sản phẩm</p>
              <p className="text-sm text-center">Vui lòng chọn một sản phẩm để xem danh sách 3D models</p>
            </div>
          )}
        </div>

        {/* Right Panel - Model Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">3. Cấu Hình</h2>
            </div>
            {selectedModel && (
              <button
                onClick={() => {
                  setEditingConfig(modelConfig);
                  setShowConfigForm(true);
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>{modelConfig ? 'Chỉnh sửa' : 'Tạo'} Cấu Hình</span>
              </button>
            )}
          </div>

          {selectedModel ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{selectedModel.modelName}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedModel.modelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${selectedModel.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedModel.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {modelConfig ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Thông Số Cấu Hình</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Position X</div>
                      <div className="text-sm font-medium text-gray-900">{modelConfig.positionOffsetX}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Position Y</div>
                      <div className="text-sm font-medium text-gray-900">{modelConfig.positionOffsetY}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Scale</div>
                      <div className="text-sm font-medium text-gray-900">{modelConfig.initialScale}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-xs text-purple-600 font-medium">Rotation</div>
                      <div className="text-sm font-medium text-gray-900">{modelConfig.rotationSensitivity}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Limits</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yaw Limit:</span>
                        <span className="font-medium">{modelConfig.yawLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pitch Limit:</span>
                        <span className="font-medium">{modelConfig.pitchLimit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                  <p className="text-gray-600">Chưa có cấu hình</p>
                  <p className="text-sm text-gray-500">Tạo cấu hình cho model này</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Settings className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg mb-2">Chọn 3D Model</p>
              <p className="text-sm text-center">Chọn một 3D model để xem và chỉnh sửa cấu hình</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Quick Actions</span>
            </div>
            {selectedModel && (
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  <span>Replace</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div>Total Products: {products.length}</div>
            <div>Total Models: {product3DModels.length}</div>
            {selectedProduct && (
              <div>Selected: {selectedProduct.productName}</div>
            )}
          </div>
        </div>
      </div>

      {/* Model Form Modal */}
      {showModelForm && (
        <ModelFormModal
          isOpen={showModelForm}
          onClose={() => {
            setShowModelForm(false);
            setEditingModel(null);
          }}
          onSubmit={(data) => {
            if (editingModel) {
              handleUpdateModel(editingModel.id, data);
            } else {
              handleCreateModel({
                ...data,
                productId: selectedProduct!.productId,
              });
            }
            setShowModelForm(false);
            setEditingModel(null);
          }}
          initialData={editingModel}
          isEditing={!!editingModel}
          productId={selectedProduct?.productId}
        />
      )}

      {/* Config Form Modal */}
      {showConfigForm && selectedModel && (
        <ConfigFormModal
          isOpen={showConfigForm}
          onClose={() => {
            setShowConfigForm(false);
            setEditingConfig(null);
          }}
          onSubmit={(data) => {
            if (editingConfig) {
              handleUpdateConfig(editingConfig.id, data);
            } else {
              handleCreateConfig({
                ...data,
                modelId: selectedModel.id,
              });
            }
            setShowConfigForm(false);
            setEditingConfig(null);
          }}
          initialData={editingConfig}
          isEditing={!!editingConfig}
        />
      )}
    </div>
  );
};

// Model Form Modal Component
interface ModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Product3DModel | null;
  isEditing: boolean;
  productId?: number;
}

const ModelFormModal: React.FC<ModelFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  productId = 1, // Default productId
}) => {
  const [formData, setFormData] = useState({
    modelName: '',
    modelFilePath: '',
    modelType: 'GLB',
    mtlFilePath: '',
    textureBasePath: '',
    configJson: '',
    isActive: true,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        modelName: initialData.modelName,
        modelFilePath: initialData.modelFilePath,
        modelType: initialData.modelType,
        mtlFilePath: initialData.mtlFilePath || '',
        textureBasePath: initialData.textureBasePath || '',
        configJson: initialData.configJson || '',
        isActive: initialData.isActive,
      });
    } else {
      setFormData({
        modelName: '',
        modelFilePath: '',
        modelType: 'GLB',
        mtlFilePath: '',
        textureBasePath: '',
        configJson: '',
        isActive: true,
      });
    }
  }, [initialData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadFiles = async (productId: number) => {
    if (selectedFiles.length === 0) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const result = await product3DModelService.uploadFiles(
        selectedFiles, 
        productId, 
        undefined, // folderName
        (progress) => setUploadProgress(progress)
      );
      
      // Auto-fill form with upload results
      const modelFiles = result.files.filter(f => 
        f.fileType === 'model' || 
        f.originalName.toLowerCase().includes('.glb') ||
        f.originalName.toLowerCase().includes('.gltf') ||
        f.originalName.toLowerCase().includes('.obj')
      );
      
      const mtlFiles = result.files.filter(f => 
        f.fileType === 'material' || f.originalName.toLowerCase().includes('.mtl')
      );
      
      const textureFiles = result.files.filter(f => 
        f.fileType === 'texture' || 
        f.originalName.toLowerCase().includes('.png') ||
        f.originalName.toLowerCase().includes('.jpg') ||
        f.originalName.toLowerCase().includes('.jpeg')
      );
      
      if (modelFiles.length > 0) {
        const modelFile = modelFiles[0];
        setFormData(prev => ({ 
          ...prev, 
          modelFilePath: modelFile.url,
          modelName: prev.modelName || modelFile.originalName.replace(/\.[^/.]+$/, ''), // Remove extension
          modelType: modelFile.originalName.toUpperCase().includes('.GLB') ? 'GLB' : 
                    modelFile.originalName.toUpperCase().includes('.GLTF') ? 'GLTF' :
                    modelFile.originalName.toUpperCase().includes('.OBJ') ? 'OBJ' : 'GLB'
        }));
      }
      
      if (mtlFiles.length > 0) {
        setFormData(prev => ({ ...prev, mtlFilePath: mtlFiles[0].url }));
      }
      
      if (textureFiles.length > 0) {
        // Use the base path from first texture file
        const basePath = textureFiles[0].url.substring(0, textureFiles[0].url.lastIndexOf('/'));
        setFormData(prev => ({ ...prev, textureBasePath: basePath }));
      }
      
      setUploadProgress(100);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Chỉnh sửa' : 'Tạo'} 3D Model
        </h3>
        
        {/* File Upload Section */}
        {!isEditing && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Files</h4>
            <input
              type="file"
              multiple
              accept=".glb,.gltf,.obj,.mtl,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="text-xs text-gray-500">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleUploadFiles(productId)}
                  disabled={uploading}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Files'}
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Model
            </label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn Model
            </label>
            <input
              type="text"
              value={formData.modelFilePath}
              onChange={(e) => setFormData({ ...formData, modelFilePath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Model
            </label>
            <select
              value={formData.modelType}
              onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GLB">GLB</option>
              <option value="GLTF">GLTF</option>
              <option value="OBJ">OBJ</option>
              <option value="FBX">FBX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn MTL (Optional)
            </label>
            <input
              type="text"
              value={formData.mtlFilePath}
              onChange={(e) => setFormData({ ...formData, mtlFilePath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn Texture (Optional)
            </label>
            <input
              type="text"
              value={formData.textureBasePath}
              onChange={(e) => setFormData({ ...formData, textureBasePath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Kích hoạt</label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Config Form Modal Component
interface ConfigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Model3DConfig | null;
  isEditing: boolean;
}

const ConfigFormModal: React.FC<ConfigFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    offsetX: 0.5,
    offsetY: 0.5,
    positionOffsetX: 0.4,
    positionOffsetY: 0.097,
    positionOffsetZ: -0.4,
    initialScale: 0.16,
    rotationSensitivity: 1.0,
    yawLimit: 0.5,
    pitchLimit: 0.3,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        offsetX: initialData.offsetX,
        offsetY: initialData.offsetY,
        positionOffsetX: initialData.positionOffsetX,
        positionOffsetY: initialData.positionOffsetY,
        positionOffsetZ: initialData.positionOffsetZ,
        initialScale: initialData.initialScale,
        rotationSensitivity: initialData.rotationSensitivity,
        yawLimit: initialData.yawLimit,
        pitchLimit: initialData.pitchLimit,
      });
    } else {
      setFormData({
        offsetX: 0.5,
        offsetY: 0.5,
        positionOffsetX: 0.4,
        positionOffsetY: 0.097,
        positionOffsetZ: -0.4,
        initialScale: 0.16,
        rotationSensitivity: 1.0,
        yawLimit: 0.5,
        pitchLimit: 0.3,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Chỉnh sửa' : 'Tạo'} Cấu Hình 3D Model
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offset X (0-1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.offsetX}
                onChange={(e) => setFormData({ ...formData, offsetX: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offset Y (0-1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.offsetY}
                onChange={(e) => setFormData({ ...formData, offsetY: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Offset X
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.positionOffsetX}
                onChange={(e) => setFormData({ ...formData, positionOffsetX: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Offset Y
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.positionOffsetY}
                onChange={(e) => setFormData({ ...formData, positionOffsetY: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Offset Z
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.positionOffsetZ}
                onChange={(e) => setFormData({ ...formData, positionOffsetZ: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Scale
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10"
                value={formData.initialScale}
                onChange={(e) => setFormData({ ...formData, initialScale: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation Sensitivity
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={formData.rotationSensitivity}
                onChange={(e) => setFormData({ ...formData, rotationSensitivity: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yaw Limit
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="2"
                value={formData.yawLimit}
                onChange={(e) => setFormData({ ...formData, yawLimit: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pitch Limit
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="2"
                value={formData.pitchLimit}
                onChange={(e) => setFormData({ ...formData, pitchLimit: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isEditing ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Product3DModelManagement;
