import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { LensQuality, CreateLensQualityDto } from '../../types/lens.types';
import toast from 'react-hot-toast';

interface LensQualityFormProps {
  lensQuality?: LensQuality | null;
  onSubmit: (data: CreateLensQualityDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type FormData = {
  name: string;
  price: number;
  description?: string;
  uvProtection: boolean;
  antiReflective: boolean;
  hardCoating: boolean;
  nightDayOptimization: boolean;
  antistaticCoating: boolean;
  freeFormTechnology: boolean;
  transitionsOption: boolean;
};

const LensQualityForm: React.FC<LensQualityFormProps> = ({ 
  lensQuality, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: lensQuality?.name || '',
      price: lensQuality?.price || 0,
      description: lensQuality?.description || '',
      uvProtection: lensQuality?.uvProtection ?? true,
      antiReflective: lensQuality?.antiReflective ?? true,
      hardCoating: lensQuality?.hardCoating ?? true,
      nightDayOptimization: lensQuality?.nightDayOptimization ?? false,
      antistaticCoating: lensQuality?.antistaticCoating ?? false,
      freeFormTechnology: lensQuality?.freeFormTechnology ?? false,
      transitionsOption: lensQuality?.transitionsOption ?? false,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast.success(lensQuality ? 'Cập nhật chất lượng lens thành công!' : 'Tạo chất lượng lens thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      console.error('Error submitting lens quality form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {lensQuality ? 'Chỉnh sửa chất lượng lens' : 'Thêm chất lượng lens mới'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên chất lượng lens *
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Tên chất lượng lens là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Tên chất lượng lens phải có ít nhất 2 ký tự'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Tên chất lượng lens không được vượt quá 100 ký tự'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập tên chất lượng lens..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('price', {
                  required: 'Giá là bắt buộc',
                  min: {
                    value: 0,
                    message: 'Giá phải lớn hơn hoặc bằng 0'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập giá..."
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Mô tả không được vượt quá 1000 ký tự'
                }
              })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập mô tả chất lượng lens..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Features */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Tính năng</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* UV Protection */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('uvProtection')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Chống tia UV
                </label>
              </div>

              {/* Anti Reflective */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('antiReflective')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Chống phản quang
                </label>
              </div>

              {/* Hard Coating */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hardCoating')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Lớp phủ cứng
                </label>
              </div>

              {/* Night Day Optimization */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('nightDayOptimization')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Tối ưu ngày đêm
                </label>
              </div>

              {/* Antistatic Coating */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('antistaticCoating')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Chống tĩnh điện
                </label>
              </div>

              {/* Free Form Technology */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('freeFormTechnology')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Công nghệ Free Form
                </label>
              </div>

              {/* Transitions Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('transitionsOption')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Lens đổi màu
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting || isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isSubmitting || isLoading) ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{lensQuality ? 'Cập nhật' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LensQualityForm;
