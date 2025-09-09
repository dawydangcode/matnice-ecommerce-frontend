import React, { useState, useEffect } from 'react';
import { Package, Box, Upload, Eye, Plus, Edit, Trash2, Settings, Download, AlertTriangle } from 'lucide-react';
import { productService } from '../../services/product.service';
import { Product } from '../../types/product.types';
import './Product3DModelManagement.css';

interface Product3DModel {
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
  updatedAt: Date;
}

interface Model3DConfig {
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
}

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showModelForm, setShowModelForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showConfigForm, setShowConfigForm] = useState(false);

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
      // Mock data for now - replace with actual API call
      const mockModels: Product3DModel[] = [
        {
          id: 1,
          productId: productId,
          modelName: 'Glasses Frame - Black',
          modelFilePath: '/models/glasses/black-frame.glb',
          modelType: 'GLB',
          mtlFilePath: '/models/glasses/materials.mtl',
          textureBasePath: '/models/glasses/textures/',
          configJson: JSON.stringify({ scale: 1.0, rotation: [0, 0, 0] }),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          productId: productId,
          modelName: 'Glasses Frame - Brown',
          modelFilePath: '/models/glasses/brown-frame.obj',
          modelType: 'OBJ',
          mtlFilePath: '/models/glasses/brown-materials.mtl',
          textureBasePath: '/models/glasses/brown-textures/',
          configJson: JSON.stringify({ scale: 0.95, rotation: [0, 0, 0] }),
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];
      setProduct3DModels(mockModels);
    } catch (error) {
      console.error('Failed to load 3D models:', error);
      showNotification('error', 'Không thể tải danh sách 3D models');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model: Product3DModel) => {
    setSelectedModel(model);
    loadModelConfig(model.id);
  };

  const loadModelConfig = async (modelId: number) => {
    try {
      // Mock data for now - replace with actual API call
      const mockConfig: Model3DConfig = {
        id: 1,
        modelId: modelId,
        offsetX: 0.5,
        offsetY: 0.5,
        positionOffsetX: 0.4,
        positionOffsetY: 0.097,
        positionOffsetZ: -0.4,
        initialScale: 0.16,
        rotationSensitivity: 1.0,
        yawLimit: 0.5,
        pitchLimit: 0.3,
      };
      setModelConfig(mockConfig);
    } catch (error) {
      console.error('Failed to load model config:', error);
      showNotification('error', 'Không thể tải cấu hình model');
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
                            // Handle edit
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                onClick={() => setShowConfigForm(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Cấu Hình</span>
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
    </div>
  );
};

export default Product3DModelManagement;
