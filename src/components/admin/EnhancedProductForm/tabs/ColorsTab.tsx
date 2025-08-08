import React from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { ProductColor } from '../types';

interface ColorsTabProps {
  productColors: ProductColor[];
  onProductColorsChange: (colors: ProductColor[]) => void;
  onStockChange: (colorId: string, stock: number) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({
  productColors,
  onProductColorsChange,
  onStockChange,
}) => {
  // Helper functions
  const addProductColor = () => {
    const newColor: ProductColor = {
      productVariantName: '',
      productNumber: '',
      colorName: '',
      stock: 0,
      isThumbnail: false,
      images: {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null,
      },
    };
    onProductColorsChange([...productColors, newColor]);
  };

  const updateProductColor = (index: number, field: keyof ProductColor, value: any) => {
    const updatedColors = productColors.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    );
    onProductColorsChange(updatedColors);
  };

  const removeProductColor = (index: number) => {
    if (productColors.length > 1) {
      const filteredColors = productColors.filter((_, i) => i !== index);
      onProductColorsChange(filteredColors);
    }
  };

  const updateColorImage = (colorIndex: number, imageOrder: 'a' | 'b' | 'c' | 'd' | 'e', file: File | null) => {
    const updatedColors = productColors.map((color, i) => 
      i === colorIndex 
        ? { ...color, images: { ...color.images, [imageOrder]: file } }
        : color
    );
    onProductColorsChange(updatedColors);
  };

  const hasThumbnailColor = productColors.some(color => color.isThumbnail);

  const handleFileUpload = (colorIndex: number, imageOrder: 'a' | 'b' | 'c' | 'd' | 'e', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateColorImage(colorIndex, imageOrder, file);
  };

  const renderImageSlot = (colorIndex: number, imageOrder: 'a' | 'b' | 'c' | 'd' | 'e') => {
    const color = productColors[colorIndex];
    const file = color.images[imageOrder];
    const isMainImage = imageOrder === 'a' && color.isThumbnail;

    return (
      <div key={imageOrder} className="relative">
        <div className={`
          w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center
          ${isMainImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${file ? 'border-solid' : ''}
        `}>
          {file ? (
            <div className="relative w-full h-full">
              <img
                src={URL.createObjectURL(file)}
                alt={`Color ${imageOrder}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => updateColorImage(colorIndex, imageOrder, null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">{imageOrder.toUpperCase()}</p>
              <p className="text-xs text-gray-500">
                {color.productNumber ? `${color.productNumber}_${imageOrder}.png` : 'XXX_' + imageOrder + '.png'}
              </p>
              {isMainImage && (
                <p className="text-xs text-blue-600 font-medium mt-1">★ Thumbnail</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(colorIndex, imageOrder, e)}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Màu sắc và hình ảnh</h3>
        <button
          onClick={addProductColor}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm màu</span>
        </button>
      </div>

      {productColors.map((color, colorIndex) => (
        <div key={colorIndex} className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-md font-medium text-gray-800">
                Màu sắc #{colorIndex + 1}
                {color.productNumber && (
                  <span className="text-sm text-blue-600 font-normal ml-2">
                    (Mã SP: {color.productNumber})
                  </span>
                )}
                {color.isThumbnail && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                    Thumbnail
                  </span>
                )}
              </h4>
              {color.colorName && (
                <p className="text-sm text-gray-600 mt-1">{color.colorName}</p>
              )}
            </div>
            {productColors.length > 1 && (
              <button
                onClick={() => removeProductColor(colorIndex)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã sản phẩm *
                </label>
                <input
                  type="text"
                  value={color.productNumber}
                  onChange={(e) => updateProductColor(colorIndex, 'productNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 2873678, 2873679..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mã này sẽ được dùng để đặt tên file ảnh: {color.productNumber || 'XXX'}_a.png, {color.productNumber || 'XXX'}_b.png...
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã phân loại màu
                </label>
                <input
                  type="text"
                  value={color.productVariantName}
                  onChange={(e) => updateProductColor(colorIndex, 'productVariantName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: BLACK_MATTE, BROWN_CLEAR..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mã định danh cho màu sắc này (tùy chọn)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên màu *
                </label>
                <input
                  type="text"
                  value={color.colorName}
                  onChange={(e) => updateProductColor(colorIndex, 'colorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Đen mờ, Nâu trong suốt..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tồn kho *
                </label>
                <input
                  type="number"
                  min="0"
                  value={color.stock}
                  onChange={(e) => {
                    const newStock = parseInt(e.target.value) || 0;
                    updateProductColor(colorIndex, 'stock', newStock);
                    onStockChange(color.productNumber, newStock);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`thumbnail-${colorIndex}`}
                  checked={color.isThumbnail}
                  onChange={(e) => {
                    // Ensure only one thumbnail per product
                    if (e.target.checked) {
                      const updatedColors = productColors.map((c, i) => ({
                        ...c,
                        isThumbnail: i === colorIndex
                      }));
                      onProductColorsChange(updatedColors);
                    } else if (!hasThumbnailColor || color.isThumbnail) {
                      updateProductColor(colorIndex, 'isThumbnail', false);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`thumbnail-${colorIndex}`}
                  className="text-sm text-gray-700"
                >
                  Sử dụng làm ảnh đại diện của sản phẩm
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Sản phẩm được chọn làm thumbnail sẽ hiển thị trong danh sách sản phẩm. 
                Chỉ một sản phẩm được chọn làm thumbnail.
              </p>
            </div>

            {/* Image Slots */}
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-700">
                Hình ảnh sản phẩm - Mã SP: {color.productNumber || 'Chưa nhập mã'}
              </h5>
              <div className="grid grid-cols-5 gap-2">
                {(['a', 'b', 'c', 'd', 'e'] as const).map(imageOrder => 
                  renderImageSlot(colorIndex, imageOrder)
                )}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <strong>Quy tắc đặt tên file:</strong> {color.productNumber || 'XXX'}_a.png, {color.productNumber || 'XXX'}_b.png, {color.productNumber || 'XXX'}_c.png...
                </p>
                <p>
                  {color.isThumbnail ? (
                    <span className="text-blue-600 font-medium">
                      ✓ Ảnh A và B của sản phẩm này sẽ hiển thị trong danh sách sản phẩm
                    </span>
                  ) : (
                    <span>
                      Ảnh A sẽ là ảnh chính của sản phẩm này
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {productColors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có màu sắc nào. Nhấn "Thêm màu" để bắt đầu.</p>
        </div>
      )}
    </div>
  );
};

export default ColorsTab;
