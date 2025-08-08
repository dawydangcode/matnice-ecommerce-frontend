import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CreateProductColorRequest } from '../../types/product-color.types';
import './ProductColorForm.css';

interface ProductColorFormProps {
  productId: number;
  onSubmit: (data: CreateProductColorRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductColorForm: React.FC<ProductColorFormProps> = ({
  productId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Omit<CreateProductColorRequest, 'productId'>>({
    productVariantName: '',
    productNumber: '',
    colorName: '',
    stock: 0,
    isThumbnail: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.productVariantName.trim()) {
      newErrors.productVariantName = 'Tên biến thể là bắt buộc';
    }

    if (!formData.productNumber.trim()) {
      newErrors.productNumber = 'Mã sản phẩm là bắt buộc';
    }

    if (!formData.colorName.trim()) {
      newErrors.colorName = 'Tên màu là bắt buộc';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Số lượng không thể âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        productId
      });
    } catch (error) {
      console.error('Error creating product color:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="product-color-form-overlay">
      <div className="product-color-form">
        <div className="form-header">
          <h3>Thêm Biến Thể Sản Phẩm</h3>
          <button 
            type="button" 
            onClick={onCancel}
            className="close-button"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="variant-name">Tên Biến Thể *</label>
            <input
              id="variant-name"
              type="text"
              value={formData.productVariantName}
              onChange={(e) => handleInputChange('productVariantName', e.target.value)}
              placeholder="VD: iPhone 15 Pro Max Vàng Titan"
              className={errors.productVariantName ? 'error' : ''}
              disabled={loading}
            />
            {errors.productVariantName && (
              <span className="error-message">{errors.productVariantName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="product-number">Mã Sản Phẩm *</label>
            <input
              id="product-number"
              type="text"
              value={formData.productNumber}
              onChange={(e) => handleInputChange('productNumber', e.target.value)}
              placeholder="VD: IP15PM-GOLD"
              className={errors.productNumber ? 'error' : ''}
              disabled={loading}
            />
            {errors.productNumber && (
              <span className="error-message">{errors.productNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="color-name">Tên Màu *</label>
            <input
              id="color-name"
              type="text"
              value={formData.colorName}
              onChange={(e) => handleInputChange('colorName', e.target.value)}
              placeholder="VD: Vàng Titan"
              className={errors.colorName ? 'error' : ''}
              disabled={loading}
            />
            {errors.colorName && (
              <span className="error-message">{errors.colorName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Số Lượng Tồn Kho</label>
            <input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              className={errors.stock ? 'error' : ''}
              disabled={loading}
            />
            {errors.stock && (
              <span className="error-message">{errors.stock}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isThumbnail}
                onChange={(e) => handleInputChange('isThumbnail', e.target.checked)}
                disabled={loading}
              />
              <span className="checkbox-text">Đặt làm biến thể thumbnail chính</span>
            </label>
            <small className="help-text">
              Biến thể thumbnail sẽ được hiển thị đầu tiên trong danh sách sản phẩm
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Tạo Biến Thể
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductColorForm;
