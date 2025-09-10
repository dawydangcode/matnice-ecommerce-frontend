import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { product3DModelService } from '../../services/product3dModel.service';

interface Model3DConfigData {
  offsetX: number;
  offsetY: number;
  positionOffsetX: number;
  positionOffsetY: number;
  positionOffsetZ: number;
  initialScale: number;
  rotationSensitivity: number;
  yawLimit: number;
  pitchLimit: number;
  // Extended properties for better UX
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  animationSpeed: number;
  enableAutoRotation: boolean;
  autoRotationSpeed: number;
  cameraDistance: number;
  cameraAngleX: number;
  cameraAngleY: number;
  lightIntensity: number;
  lightPositionX: number;
  lightPositionY: number;
  lightPositionZ: number;
  enableShadows: boolean;
  backgroundColor: string;
  environmentLighting: string;
  materialMetallic: number;
  materialRoughness: number;
  wireframeMode: boolean;
}

interface Product3DModelInfo {
  id: number;
  modelName: string;
  modelType: string;
  modelFilePath: string;
  productId: number;
}

export const Configure3DModel: React.FC = () => {
  const navigate = useNavigate();
  const { productId, modelId } = useParams<{ productId: string; modelId: string }>();
  const [model, setModel] = useState<Product3DModelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [configData, setConfigData] = useState<Model3DConfigData>({
    offsetX: 0,
    offsetY: 0,
    positionOffsetX: 0,
    positionOffsetY: 0,
    positionOffsetZ: 0,
    initialScale: 1.0,
    rotationSensitivity: 1.0,
    yawLimit: 90,
    pitchLimit: 45,
    // Extended properties
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    animationSpeed: 1.0,
    enableAutoRotation: false,
    autoRotationSpeed: 0.01,
    cameraDistance: 5.0,
    cameraAngleX: 0,
    cameraAngleY: 0,
    lightIntensity: 1.0,
    lightPositionX: 10,
    lightPositionY: 10,
    lightPositionZ: 10,
    enableShadows: true,
    backgroundColor: '#f0f0f0',
    environmentLighting: 'neutral',
    materialMetallic: 0.0,
    materialRoughness: 0.5,
    wireframeMode: false,
  });

  const loadModelAndConfig = useCallback(async () => {
    try {
      if (!modelId) return;
      
      // Load model info
      const modelInfo = await product3DModelService.getById(parseInt(modelId));
      setModel(modelInfo);

      // Load existing config if available
      try {
        const config = await product3DModelService.getConfigByModelId(parseInt(modelId));
        if (config) {
          setConfigData(prev => ({
            ...prev,
            offsetX: config.offsetX || 0,
            offsetY: config.offsetY || 0,
            positionOffsetX: config.positionOffsetX || 0,
            positionOffsetY: config.positionOffsetY || 0,
            positionOffsetZ: config.positionOffsetZ || 0,
            initialScale: config.initialScale || 1.0,
            rotationSensitivity: config.rotationSensitivity || 1.0,
            yawLimit: config.yawLimit || 90,
            pitchLimit: config.pitchLimit || 45,
          }));
        }
      } catch (configError) {
        console.log('No existing config found, using defaults');
      }
    } catch (error) {
      console.error('Error loading model:', error);
      toast.error('Không thể tải thông tin model');
    }
  }, [modelId]);

  useEffect(() => {
    if (modelId) {
      loadModelAndConfig();
    }
  }, [modelId, loadModelAndConfig]);

  const handleConfigChange = (field: keyof Model3DConfigData, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefaults = () => {
    setConfigData({
      offsetX: 0,
      offsetY: 0,
      positionOffsetX: 0,
      positionOffsetY: 0,
      positionOffsetZ: 0,
      initialScale: 1.0,
      rotationSensitivity: 1.0,
      yawLimit: 90,
      pitchLimit: 45,
      // Extended properties
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      animationSpeed: 1.0,
      enableAutoRotation: false,
      autoRotationSpeed: 0.01,
      cameraDistance: 5.0,
      cameraAngleX: 0,
      cameraAngleY: 0,
      lightIntensity: 1.0,
      lightPositionX: 10,
      lightPositionY: 10,
      lightPositionZ: 10,
      enableShadows: true,
      backgroundColor: '#f0f0f0',
      environmentLighting: 'neutral',
      materialMetallic: 0.0,
      materialRoughness: 0.5,
      wireframeMode: false,
    });
    toast.success('Đã reset về cài đặt mặc định');
  };

  const handleSave = async () => {
    if (!modelId) return;
    
    setLoading(true);
    try {
      const configRequest = {
        modelId: parseInt(modelId),
        ...configData
      };

      await product3DModelService.createConfig(configRequest);
      toast.success('Lưu cấu hình thành công!');
      navigate(`/admin/products/${productId}/3d-models`);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Lỗi lưu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  const ConfigSection: React.FC<{
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
  }> = ({ title, children, collapsible = false }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div 
          className={`flex items-center justify-between mb-4 ${collapsible ? 'cursor-pointer' : ''}`}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {collapsible && (
            <span className="text-gray-400">
              {isCollapsed ? '+' : '−'}
            </span>
          )}
        </div>
        {(!collapsible || !isCollapsed) && (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const InputField: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }> = ({ label, value, onChange, min, max, step = 0.1, unit }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {unit && `(${unit})`}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  );

  const CheckboxField: React.FC<{
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    description?: string;
  }> = ({ label, value, onChange, description }) => (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
      />
      <div>
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  if (!model) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Đang tải thông tin model...</p>
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
                  Cấu hình 3D Model
                </h1>
                <p className="text-sm text-gray-600">
                  {model.modelName} ({model.modelType})
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors ${
                  previewMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? 'Thoát xem trước' : 'Xem trước'}
              </button>
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <Save className="w-4 h-4" />
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Position Settings */}
            <ConfigSection title="Vị trí và Kích thước">
              <InputField
                label="Offset X"
                value={configData.offsetX}
                onChange={(value) => handleConfigChange('offsetX', value)}
                min={-10}
                max={10}
                step={0.1}
              />
              <InputField
                label="Offset Y"
                value={configData.offsetY}
                onChange={(value) => handleConfigChange('offsetY', value)}
                min={-10}
                max={10}
                step={0.1}
              />
              <InputField
                label="Position X"
                value={configData.positionOffsetX}
                onChange={(value) => handleConfigChange('positionOffsetX', value)}
                min={-10}
                max={10}
                step={0.1}
              />
              <InputField
                label="Position Y"
                value={configData.positionOffsetY}
                onChange={(value) => handleConfigChange('positionOffsetY', value)}
                min={-10}
                max={10}
                step={0.1}
              />
              <InputField
                label="Position Z"
                value={configData.positionOffsetZ}
                onChange={(value) => handleConfigChange('positionOffsetZ', value)}
                min={-10}
                max={10}
                step={0.1}
              />
              <InputField
                label="Tỷ lệ ban đầu"
                value={configData.initialScale}
                onChange={(value) => handleConfigChange('initialScale', value)}
                min={0.1}
                max={5}
                step={0.1}
              />
            </ConfigSection>

            {/* Rotation Settings */}
            <ConfigSection title="Xoay và Hoạt ảnh">
              <InputField
                label="Xoay X"
                value={configData.rotationX}
                onChange={(value) => handleConfigChange('rotationX', value)}
                min={-360}
                max={360}
                step={1}
                unit="độ"
              />
              <InputField
                label="Xoay Y"
                value={configData.rotationY}
                onChange={(value) => handleConfigChange('rotationY', value)}
                min={-360}
                max={360}
                step={1}
                unit="độ"
              />
              <InputField
                label="Xoay Z"
                value={configData.rotationZ}
                onChange={(value) => handleConfigChange('rotationZ', value)}
                min={-360}
                max={360}
                step={1}
                unit="độ"
              />
              <InputField
                label="Tốc độ hoạt ảnh"
                value={configData.animationSpeed}
                onChange={(value) => handleConfigChange('animationSpeed', value)}
                min={0.1}
                max={3}
                step={0.1}
              />
              <CheckboxField
                label="Tự động xoay"
                value={configData.enableAutoRotation}
                onChange={(value) => handleConfigChange('enableAutoRotation', value)}
                description="Cho phép model tự động xoay liên tục"
              />
              {configData.enableAutoRotation && (
                <InputField
                  label="Tốc độ tự động xoay"
                  value={configData.autoRotationSpeed}
                  onChange={(value) => handleConfigChange('autoRotationSpeed', value)}
                  min={0.001}
                  max={0.1}
                  step={0.001}
                />
              )}
            </ConfigSection>

            {/* Camera Settings */}
            <ConfigSection title="Camera" collapsible>
              <InputField
                label="Khoảng cách camera"
                value={configData.cameraDistance}
                onChange={(value) => handleConfigChange('cameraDistance', value)}
                min={1}
                max={20}
                step={0.5}
              />
              <InputField
                label="Góc camera X"
                value={configData.cameraAngleX}
                onChange={(value) => handleConfigChange('cameraAngleX', value)}
                min={-90}
                max={90}
                step={1}
                unit="độ"
              />
              <InputField
                label="Góc camera Y"
                value={configData.cameraAngleY}
                onChange={(value) => handleConfigChange('cameraAngleY', value)}
                min={-180}
                max={180}
                step={1}
                unit="độ"
              />
            </ConfigSection>

            {/* Lighting Settings */}
            <ConfigSection title="Ánh sáng" collapsible>
              <InputField
                label="Cường độ ánh sáng"
                value={configData.lightIntensity}
                onChange={(value) => handleConfigChange('lightIntensity', value)}
                min={0}
                max={3}
                step={0.1}
              />
              <InputField
                label="Vị trí ánh sáng X"
                value={configData.lightPositionX}
                onChange={(value) => handleConfigChange('lightPositionX', value)}
                min={-50}
                max={50}
                step={1}
              />
              <InputField
                label="Vị trí ánh sáng Y"
                value={configData.lightPositionY}
                onChange={(value) => handleConfigChange('lightPositionY', value)}
                min={-50}
                max={50}
                step={1}
              />
              <InputField
                label="Vị trí ánh sáng Z"
                value={configData.lightPositionZ}
                onChange={(value) => handleConfigChange('lightPositionZ', value)}
                min={-50}
                max={50}
                step={1}
              />
              <CheckboxField
                label="Bật bóng đổ"
                value={configData.enableShadows}
                onChange={(value) => handleConfigChange('enableShadows', value)}
                description="Hiển thị bóng đổ của model"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ánh sáng môi trường
                </label>
                <select
                  value={configData.environmentLighting}
                  onChange={(e) => handleConfigChange('environmentLighting', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="neutral">Trung tính</option>
                  <option value="studio">Studio</option>
                  <option value="outdoor">Ngoài trời</option>
                  <option value="indoor">Trong nhà</option>
                </select>
              </div>
            </ConfigSection>

            {/* Material Settings */}
            <ConfigSection title="Chất liệu" collapsible>
              <InputField
                label="Độ kim loại"
                value={configData.materialMetallic}
                onChange={(value) => handleConfigChange('materialMetallic', value)}
                min={0}
                max={1}
                step={0.01}
              />
              <InputField
                label="Độ nhám"
                value={configData.materialRoughness}
                onChange={(value) => handleConfigChange('materialRoughness', value)}
                min={0}
                max={1}
                step={0.01}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu nền
                </label>
                <input
                  type="color"
                  value={configData.backgroundColor}
                  onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <CheckboxField
                label="Chế độ wireframe"
                value={configData.wireframeMode}
                onChange={(value) => handleConfigChange('wireframeMode', value)}
                description="Hiển thị model dưới dạng khung dây"
              />
            </ConfigSection>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xem trước 3D Model
            </h3>
            
            <div 
              className="w-full h-96 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: configData.backgroundColor } as React.CSSProperties}
            >
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>Xem trước 3D model sẽ hiển thị ở đây</p>
                <p className="text-sm mt-2">
                  Model: {model.modelName}
                </p>
                <p className="text-xs text-gray-400">
                  Scale: {configData.initialScale}x | Rotation: ({configData.rotationX}°, {configData.rotationY}°, {configData.rotationZ}°)
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Thông số hiện tại:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Tỷ lệ: {configData.initialScale}x</p>
                <p>Vị trí: ({configData.positionOffsetX}, {configData.positionOffsetY}, {configData.positionOffsetZ})</p>
                <p>Xoay: ({configData.rotationX}°, {configData.rotationY}°, {configData.rotationZ}°)</p>
                <p>Tự động xoay: {configData.enableAutoRotation ? 'Bật' : 'Tắt'}</p>
                <p>Cường độ ánh sáng: {configData.lightIntensity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configure3DModel;
