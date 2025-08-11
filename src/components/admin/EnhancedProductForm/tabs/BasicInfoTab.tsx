import React, { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '../types';
import { ProductType, ProductGenderType } from '../../../../types/product.types';
import { Brand } from '../../../../types/brand.types';
import { Category } from '../../../../types/category.types';
import { LensThickness, lensThicknessService } from '../../../../services/lens-thickness.service';
import SearchableSelect from '../components/SearchableSelect';
import toast from 'react-hot-toast';

interface BasicInfoTabProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  brands: Brand[];
  categories: Category[];
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  handleCategoryChange: (categoryIds: string[]) => void;
  handleLensThicknessChange: (lensThicknessIds: string[]) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  register,
  errors,
  brands,
  categories,
  setValue,
  watch,
  handleCategoryChange,
  handleLensThicknessChange
}) => {
  const watchedValues = watch();
  const [lensThicknessList, setLensThicknessList] = useState<LensThickness[]>([]);
  const [isLoadingLensThickness, setIsLoadingLensThickness] = useState(false);
  const [newExpirationDate, setNewExpirationDate] = useState<Date | null>(null);

  // Calculate expiration date when isNew changes
  useEffect(() => {
    if (watchedValues.isNew) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      setNewExpirationDate(expirationDate);
    } else {
      setNewExpirationDate(null);
    }
  }, [watchedValues.isNew]);

  // Load lens thickness list
  useEffect(() => {
    const loadLensThickness = async () => {
      try {
        setIsLoadingLensThickness(true);
        const list = await lensThicknessService.getLensThicknessList();
        setLensThicknessList(list);
      } catch (error) {
        console.error('Failed to load lens thickness:', error);
        toast.error('Không thể tải danh sách độ dày lens');
      } finally {
        setIsLoadingLensThickness(false);
      }
    };

    loadLensThickness();
  }, []);
  
  // Prepare brand options for SearchableSelect
  const brandOptions = brands.map(brand => ({
    value: brand.id.toString(),
    label: brand.name
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên sản phẩm *
          </label>
          <input
            {...register('productName')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên sản phẩm"
          />
          {errors.productName && (
            <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại sản phẩm *
          </label>
          <select
            {...register('productType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={ProductType.GLASSES}>Kính mắt</option>
            <option value={ProductType.SUNGLASSES}>Kính râm</option>
          </select>
          {errors.productType && (
            <p className="mt-1 text-sm text-red-600">{errors.productType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới tính *
          </label>
          <select
            {...register('gender')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={ProductGenderType.MALE}>Nam</option>
            <option value={ProductGenderType.FEMALE}>Nữ</option>
            <option value={ProductGenderType.UNISEX}>Unisex</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thương hiệu *
          </label>
          <SearchableSelect
            options={brandOptions}
            value={watchedValues.brandId || ''}
            onChange={(value) => setValue('brandId', value)}
            placeholder="Chọn thương hiệu"
            error={errors.brandId?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục *
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
            {categories.map((category) => {
              const selectedCategories = watchedValues.categoryIds || [];
              const isChecked = selectedCategories.includes(category.id.toString());
              
              return (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const selectedCategories = watchedValues.categoryIds || [];
                      const newCategories = e.target.checked
                        ? [...selectedCategories, category.id.toString()]
                        : selectedCategories.filter((id: string) => id !== category.id.toString());
                      handleCategoryChange(newCategories);
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              );
            })}
          </div>
          {errors.categoryIds && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryIds.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Độ dày lens
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
            {isLoadingLensThickness ? (
              <div className="text-sm text-gray-500">Đang tải...</div>
            ) : lensThicknessList.length === 0 ? (
              <div className="text-sm text-gray-500">Không có độ dày lens nào</div>
            ) : (
              lensThicknessList.map((lensThickness) => {
                const selectedLensThickness = watchedValues.lensThicknessIds || [];
                const isChecked = selectedLensThickness.includes(lensThickness.id.toString());
                
                return (
                  <label key={lensThickness.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const selectedLensThickness = watchedValues.lensThicknessIds || [];
                        const newLensThickness = e.target.checked
                          ? [...selectedLensThickness, lensThickness.id.toString()]
                          : selectedLensThickness.filter((id: string) => id !== lensThickness.id.toString());
                        handleLensThicknessChange(newLensThickness);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {lensThickness.name} - Index {lensThickness.indexValue} - {lensThickness.price.toLocaleString('vi-VN')}đ
                    </span>
                  </label>
                );
              })
            )}
          </div>
          {errors.lensThicknessIds && (
            <p className="mt-1 text-sm text-red-600">{errors.lensThicknessIds.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (VNĐ) *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            {...register('isSustainable')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Sản phẩm bền vững
          </label>
        </div>

        <div className="flex items-center">
          <input
            {...register('isNew')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Sản phẩm mới
          </label>
        </div>

        {watchedValues.isNew && newExpirationDate && (
          <div className="ml-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Thông báo:</strong> Sản phẩm sẽ tự động hết hạn "mới" sau 30 ngày
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Ngày hết hạn: {newExpirationDate.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        <div className="flex items-center">
          <input
            {...register('isBoutique')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Sản phẩm boutique
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả sản phẩm
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
