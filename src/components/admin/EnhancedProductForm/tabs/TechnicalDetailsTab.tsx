import React from 'react';
import { CreateProductDetailRequest, FrameBridgeDesignType, FrameMaterialType, FrameShapeType, FrameType } from '../../../../types/product.types';

interface TechnicalDetailsTabProps {
  productDetail: Partial<CreateProductDetailRequest>;
  updateProductDetail: (field: keyof CreateProductDetailRequest, value: any) => void;
}

const TechnicalDetailsTab: React.FC<TechnicalDetailsTabProps> = ({
  productDetail,
  updateProductDetail
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Chi tiết kỹ thuật</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiều rộng cầu mũi (mm)
          </label>
          <input
            type="number"
            value={productDetail.bridgeWidth || 0}
            onChange={(e) => updateProductDetail('bridgeWidth', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="18"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiều rộng gọng (mm)
          </label>
          <input
            type="number"
            value={productDetail.frameWidth || 0}
            onChange={(e) => updateProductDetail('frameWidth', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiều cao tròng (mm)
          </label>
          <input
            type="number"
            value={productDetail.lensHeight || 0}
            onChange={(e) => updateProductDetail('lensHeight', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiều rộng tròng (mm)
          </label>
          <input
            type="number"
            value={productDetail.lensWidth || 0}
            onChange={(e) => updateProductDetail('lensWidth', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiều dài càng (mm)
          </label>
          <input
            type="number"
            value={productDetail.templeLength || 0}
            onChange={(e) => updateProductDetail('templeLength', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="140"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chất liệu gọng
          </label>
          <select
            value={productDetail.frameMaterial || FrameMaterialType.PLASTIC}
            onChange={(e) => updateProductDetail('frameMaterial', e.target.value as FrameMaterialType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Chọn chất liệu gọng"
          >
            <option value={FrameMaterialType.PLASTIC}>Nhựa</option>
            <option value={FrameMaterialType.METAL}>Kim loại</option>
            <option value={FrameMaterialType.TITAN}>Titan</option>
            <option value={FrameMaterialType.WOOD}>Gỗ</option>
            <option value={FrameMaterialType.CARBON}>Carbon</option>
            <option value={FrameMaterialType.ALUMINIUM}>Nhôm</option>
            <option value={FrameMaterialType.LEATHER}>Da</option>
            <option value={FrameMaterialType.PLASTIC}>Nhựa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình dáng gọng
          </label>
          <select
            value={productDetail.frameShape || FrameShapeType.ROUND}
            onChange={(e) => updateProductDetail('frameShape', e.target.value as FrameShapeType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Chọn hình dáng gọng"
          >
            <option value={FrameShapeType.ROUND}>Tròn</option>
            <option value={FrameShapeType.SQUARE}>Vuông</option>
            <option value={FrameShapeType.RECTANGLE}>Chữ nhật</option>
            <option value={FrameShapeType.OVAL}>Oval</option>
            <option value={FrameShapeType.AVIATOR}>Phi công</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại gọng
          </label>
          <select
            value={productDetail.frameType || FrameType.FULL_RIM}
            onChange={(e) => updateProductDetail('frameType', e.target.value as FrameType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Chọn loại gọng"
          >
            <option value={FrameType.FULL_RIM}>Gọng đầy</option>
            <option value={FrameType.HALF_RIM}>Gọng nửa</option>
            <option value={FrameType.NO_RIM}>Không gọng</option>
            <option value={FrameType.RIMLESS}>Rimless</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại cầu kính
          </label>
          <select
            value={productDetail.bridgeDesign || FrameBridgeDesignType.WITHOUT_NOSE_PADS}
            onChange={(e) => updateProductDetail('bridgeDesign', e.target.value as FrameBridgeDesignType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Chọn loại cầu kính"
          >
            <option value={FrameBridgeDesignType.WITHOUT_NOSE_PADS}>Không cầu kính</option>
            <option value={FrameBridgeDesignType.WITH_KEYHOLE_BRIDGE}>Cầu kính Keyhole</option>
            <option value={FrameBridgeDesignType.WITH_NOSE_PADS}>Miếng đệm mũi</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={productDetail.springHinge || false}
          onChange={(e) => updateProductDetail('springHinge', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          title="Có bản lề lò xo"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Có bản lề lò xo
        </label>
      </div>
    </div>
  );
};

export default TechnicalDetailsTab;
