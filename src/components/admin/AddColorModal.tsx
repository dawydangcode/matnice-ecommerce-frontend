import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { productColorService, CreateProductColorRequest } from '../../services/product-color.service';
import { productColorImageService } from '../../services/product-color-image.service';

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onSuccess: () => void;
}

interface ColorForm {
  productVariantName: string;
  productNumber: string;
  colorName: string;
  stock: number;
  isThumbnail: boolean;
  images: {
    a: File | null;
    b: File | null;
    c: File | null;
    d: File | null;
    e: File | null;
  };
}

const AddColorModal: React.FC<AddColorModalProps> = ({
  isOpen,
  onClose,
  productId,
  onSuccess
}) => {
  const [colorForm, setColorForm] = useState<ColorForm>({
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
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateColorForm = (field: keyof ColorForm, value: any) => {
    setColorForm(prev => ({ ...prev, [field]: value }));
  };

  const updateColorImage = (imageOrder: 'a' | 'b' | 'c' | 'd' | 'e', file: File | null) => {
    setColorForm(prev => ({
      ...prev,
      images: { ...prev.images, [imageOrder]: file }
    }));
  };

  const handleFileUpload = (imageOrder: 'a' | 'b' | 'c' | 'd' | 'e', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateColorImage(imageOrder, file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!colorForm.colorName.trim()) {
      toast.error('Vui lòng nhập tên màu');
      return;
    }
    
    if (!colorForm.productNumber.trim()) {
      toast.error('Vui lòng nhập mã sản phẩm');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create color
      const colorData: CreateProductColorRequest = {
        productId: productId,
        productVariantName: colorForm.productVariantName || colorForm.colorName.trim(),
        productNumber: colorForm.productNumber.trim(),
        colorName: colorForm.colorName.trim(),
        stock: colorForm.stock,
        isThumbnail: colorForm.isThumbnail,
      };

      const color = await productColorService.createProductColor(productId, colorData);
      console.log('Color created:', color);

      // Upload images
      const imageOrders: ('a' | 'b' | 'c' | 'd' | 'e')[] = ['a', 'b', 'c', 'd', 'e'];
      for (const imageOrder of imageOrders) {
        const imageFile = colorForm.images[imageOrder];
        if (imageFile) {
          try {
            await productColorImageService.uploadProductColorImage({
              productId: productId,
              colorId: color.id,
              productNumber: colorForm.productNumber.trim(),
              imageOrder: imageOrder,
              file: imageFile,
            });
            console.log(`Image ${imageOrder} uploaded successfully`);
          } catch (imageError) {
            console.error(`Failed to upload image ${imageOrder}:`, imageError);
            toast.error(`Có lỗi khi upload ảnh ${imageOrder.toUpperCase()}`);
          }
        }
      }

      toast.success('Tạo màu sắc thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating color:', error);
      toast.error('Có lỗi khi tạo màu sắc');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImageSlot = (imageOrder: 'a' | 'b' | 'c' | 'd' | 'e') => {
    const file = colorForm.images[imageOrder];
    const isMainImage = imageOrder === 'a' && colorForm.isThumbnail;

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
                type="button"
                onClick={() => updateColorImage(imageOrder, null)}
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
                {colorForm.productNumber ? `${colorForm.productNumber}_${imageOrder}.png` : 'XXX_' + imageOrder + '.png'}
              </p>
              {isMainImage && (
                <p className="text-xs text-blue-600 font-medium mt-1">★ Thumbnail</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(imageOrder, e)}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Thêm màu sắc mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-md font-medium text-gray-800">
                  Màu sắc #1
                  {colorForm.productNumber && (
                    <span className="text-sm text-blue-600 font-normal ml-2">
                      (Mã SP: {colorForm.productNumber})
                    </span>
                  )}
                  {colorForm.isThumbnail && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                      Thumbnail
                    </span>
                  )}
                </h4>
                {colorForm.colorName && (
                  <p className="text-sm text-gray-600 mt-1">{colorForm.colorName}</p>
                )}
              </div>
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
                    value={colorForm.productNumber}
                    onChange={(e) => updateColorForm('productNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: 2873678, 2873679..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mã này sẽ được dùng để đặt tên file ảnh: {colorForm.productNumber || 'XXX'}_a.png, {colorForm.productNumber || 'XXX'}_b.png...
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã phân loại màu
                  </label>
                  <input
                    type="text"
                    value={colorForm.productVariantName}
                    onChange={(e) => updateColorForm('productVariantName', e.target.value)}
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
                    value={colorForm.colorName}
                    onChange={(e) => updateColorForm('colorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Đen mờ, Nâu trong suốt..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tồn kho *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={colorForm.stock}
                    onChange={(e) => updateColorForm('stock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="thumbnail"
                    checked={colorForm.isThumbnail}
                    onChange={(e) => updateColorForm('isThumbnail', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="thumbnail" className="text-sm text-gray-700">
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
                  Hình ảnh sản phẩm - Mã SP: {colorForm.productNumber || 'Chưa nhập mã'}
                </h5>
                <div className="grid grid-cols-5 gap-2">
                  {(['a', 'b', 'c', 'd', 'e'] as const).map(imageOrder => 
                    renderImageSlot(imageOrder)
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <strong>Quy tắc đặt tên file:</strong> {colorForm.productNumber || 'XXX'}_a.png, {colorForm.productNumber || 'XXX'}_b.png, {colorForm.productNumber || 'XXX'}_c.png...
                  </p>
                  <p>
                    {colorForm.isThumbnail ? (
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

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo màu sắc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColorModal;
