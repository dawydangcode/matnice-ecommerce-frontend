import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProductFormData } from '../types';
import { ProductType, ProductGenderType } from '../../../../types/product.types';
import { Brand } from '../../../../types/brand.types';
import { Category } from '../../../../types/category.types';

interface BasicInfoTabProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  brands: Brand[];
  categories: Category[];
  getValues: () => ProductFormData;
  handleCategoryChange: (categoryId: string, checked: boolean) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  register,
  errors,
  brands,
  categories,
  getValues,
  handleCategoryChange
}) => {
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
          <select
            {...register('brandId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="mt-1 text-sm text-red-600">{errors.brandId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục *
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
            {categories.map((category) => {
              const selectedCategories = getValues().categoryIds || [];
              const isChecked = selectedCategories.includes(category.id.toString());
              
              return (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCategoryChange(category.id.toString(), e.target.checked)}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng *
          </label>
          <input
            {...register('stock', { valueAsNumber: true })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
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
