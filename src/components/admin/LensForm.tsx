import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { Lens, CreateLensDto } from '../../types/lens.types';
import toast from 'react-hot-toast';

interface LensFormProps {
  lens?: Lens | null;
  onSubmit: (data: CreateLensDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type FormData = {
  name: string;
};

const LensForm: React.FC<LensFormProps> = ({ 
  lens, 
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
      name: lens?.name || '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast.success(lens ? 'Cập nhật lens thành công!' : 'Tạo lens thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      console.error('Error submitting lens form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {lens ? 'Chỉnh sửa lens' : 'Thêm lens mới'}
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
          {/* Lens Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên lens *
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Tên lens là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên lens phải có ít nhất 2 ký tự'
                },
                maxLength: {
                  value: 100,
                  message: 'Tên lens không được vượt quá 100 ký tự'
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập tên lens..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              <span>{lens ? 'Cập nhật' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LensForm;
