import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

// Mirror the backend enum
export enum LensType {
  SINGLE_VISION = 'single_vision',
  PROGRESSIVE = 'progressive',
  OFFICE = 'office',
  NON_PRESCRIPTION = 'non_prescription',
}

interface LensFormData {
  name: string;
  description: string;
  lensType: LensType;
  hasAxisCorrection: boolean;
  isNonPrescription: boolean;
}

interface LensFormErrors {
  name?: string;
  description?: string;
  lensType?: string;
  hasAxisCorrection?: string;
  isNonPrescription?: string;
}

interface LensFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LensFormData) => void;
  mode: 'create' | 'edit';
  title: string;
  initialData?: LensFormData;
}

export const LensFormModal: React.FC<LensFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  title,
  initialData
}) => {
  const [formData, setFormData] = useState<LensFormData>({
    name: '',
    description: '',
    lensType: LensType.SINGLE_VISION,
    hasAxisCorrection: false,
    isNonPrescription: false,
  });

  const [errors, setErrors] = useState<LensFormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        lensType: LensType.SINGLE_VISION,
        hasAxisCorrection: false,
        isNonPrescription: false,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: LensFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên lens không được để trống';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    if (!formData.lensType) {
      newErrors.lensType = 'Vui lòng chọn loại lens';
    }

    // Logic validation: Non-prescription và Axis không được chọn cùng lúc
    if (formData.hasAxisCorrection && formData.isNonPrescription) {
      newErrors.hasAxisCorrection = 'Không thể chọn cả hai tùy chọn này cùng lúc';
      newErrors.isNonPrescription = 'Không thể chọn cả hai tùy chọn này cùng lúc';
    }

    // Special validation for NON_PRESCRIPTION type
    if (formData.lensType === LensType.NON_PRESCRIPTION && !formData.isNonPrescription) {
      newErrors.isNonPrescription = 'Loại lens Non-prescription phải được đánh dấu là không kê đơn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LensFormData, value: string | boolean | LensType) => {
    if (field === 'lensType') {
      const lensType = value as LensType;
      setFormData(prev => ({
        ...prev,
        lensType: lensType,
        // Tự động set isNonPrescription = true cho NON_PRESCRIPTION type
        isNonPrescription: lensType === LensType.NON_PRESCRIPTION,
        // Tự động set hasAxisCorrection = false cho NON_PRESCRIPTION type
        hasAxisCorrection: lensType === LensType.NON_PRESCRIPTION ? false : prev.hasAxisCorrection
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleCheckboxChange = (field: 'hasAxisCorrection' | 'isNonPrescription', checked: boolean) => {
    if (field === 'hasAxisCorrection' && checked && formData.isNonPrescription) {
      // Uncheck non-prescription when axis is checked
      setFormData(prev => ({
        ...prev,
        hasAxisCorrection: true,
        isNonPrescription: false
      }));
    } else if (field === 'isNonPrescription' && checked && formData.hasAxisCorrection) {
      // Uncheck axis when non-prescription is checked
      setFormData(prev => ({
        ...prev,
        hasAxisCorrection: false,
        isNonPrescription: true
      }));
    } else {
      handleInputChange(field, checked);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên Lens *
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ví dụ: Single Vision, Progressive..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả *
              </label>
              <textarea
                id="description"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả chi tiết về loại lens này..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Lens Type Field */}
            <div>
              <label htmlFor="lensType" className="block text-sm font-medium text-gray-700 mb-1">
                Loại Lens *
              </label>
              <select
                id="lensType"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lensType ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.lensType}
                onChange={(e) => handleInputChange('lensType', e.target.value as LensType)}
              >
                <option value={LensType.SINGLE_VISION}>Single Vision</option>
                <option value={LensType.PROGRESSIVE}>Progressive</option>
                <option value={LensType.OFFICE}>Office</option>
                <option value={LensType.NON_PRESCRIPTION}>Non-prescription</option>
              </select>
              {errors.lensType && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.lensType}
                </p>
              )}
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Tùy chọn:</div>
              
              {/* Has Axis Correction */}
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="hasAxisCorrection"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={formData.hasAxisCorrection}
                    onChange={(e) => handleCheckboxChange('hasAxisCorrection', e.target.checked)}
                    disabled={formData.lensType === LensType.NON_PRESCRIPTION}
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="hasAxisCorrection" className="font-medium text-gray-700">
                    Có hiệu chính trục (Axis Correction)
                  </label>
                  <p className="text-gray-500 text-xs">
                    Cho những lens cần hiệu chính trục astigmatism
                  </p>
                </div>
              </div>

              {/* Is Non Prescription */}
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="isNonPrescription"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={formData.isNonPrescription}
                    onChange={(e) => handleCheckboxChange('isNonPrescription', e.target.checked)}
                    disabled={formData.lensType === LensType.NON_PRESCRIPTION}
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="isNonPrescription" className="font-medium text-gray-700">
                    Không kê đơn (Non-prescription)
                  </label>
                  <p className="text-gray-500 text-xs">
                    Lens trang trí hoặc bảo vệ không cần đơn kê
                  </p>
                </div>
              </div>

              {/* Validation Messages */}
              {errors.hasAxisCorrection && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.hasAxisCorrection}
                </p>
              )}
              {errors.isNonPrescription && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.isNonPrescription}
                </p>
              )}

              {/* Helper Text */}
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                <strong>Lưu ý:</strong> Không thể chọn cả "Có hiệu chính trục" và "Không kê đơn" cùng lúc. 
                Khi chọn loại "Non-prescription", tùy chọn "Không kê đơn" sẽ được tự động chọn.
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
