import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import { useBrandStore } from '../../stores/brand.store';
import { useCategoryStore } from '../../stores/category.store';
import { useLensStore } from '../../stores/lens.store';

// Extended types for complex lens creation
interface CreateComplexLensDto {
  // Basic lens info
  name: string;
  status: string;
  brandId: number;
  origin: string;
  lensType: string;
  description: string;
  categoryId: number;
  
  // Images
  images: {
    imageUrl: string;
    imageOrder: string;
    isThumbnail: boolean;
    file?: File;
  }[];
  
  // Variants
  variants: {
    lensThicknessId: number;
    design: string;
    material: string;
    price: number;
    stock: number;
  }[];
  
  // Coatings
  coatings: {
    name: string;
    price: number;
    description: string;
  }[];
  
  // Refraction ranges per variant
  refractionRanges: { 
    [variantIndex: number]: {
      refractionType: string;
      minValue: number;
      maxValue: number;
      stepValue: number;
    }[]
  };
}
interface LensImage {
  id?: string;
  imageUrl: string;
  imageOrder: string;
  isThumbnail: boolean;
  file?: File;
}

interface LensVariant {
  id?: string;
  lensThicknessId: number;
  design: string;
  material: string;
  price: number;
  stock: number;
}

interface LensCoating {
  id?: string;
  name: string;
  price: number;
  description: string;
}

interface LensRefractionRange {
  id?: string;
  lensVariantId?: string;
  refractionType: string;
  minValue: number;
  maxValue: number;
  stepValue: number;
}

interface CreateLensData {
  name: string;
  status: string;
  brandId: number;
  origin: string;
  lensType: string;
  description: string;
  categoryId: number;
  images: LensImage[];
  variants: LensVariant[];
  coatings: LensCoating[];
  refractionRanges: { [variantId: string]: LensRefractionRange[] };
}

const LENS_TYPES = [
  'Đơn tròng',
  'Đa tròng',
  'Lái xe',
  'Chống ánh sáng xanh',
  'Đổi màu',
  'Chống tia UV',
];

const LENS_DESIGNS = ['FSV', 'AR', 'AS'];
const REFRACTION_TYPES = ['SPH', 'CYL', 'ADD'];
const IMAGE_ORDERS = ['a', 'b', 'c', 'd', 'e'];

const CreateLensForm: React.FC = () => {
  console.log('CreateLensForm component rendering');
  
  const { brands, fetchBrands } = useBrandStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { lensThicknesses, fetchLensThicknesses, createLensWithImages } = useLensStore();

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<CreateLensData>({
    name: '',
    status: 'còn hàng',
    brandId: 0,
    origin: '',
    lensType: '',
    description: '',
    categoryId: 0,
    images: [],
    variants: [],
    coatings: [],
    refractionRanges: {},
  });

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchLensThicknesses();
  }, [fetchBrands, fetchCategories, fetchLensThicknesses]);

  const tabs = [
    { id: 0, title: 'Thông tin cơ bản', icon: '📝' },
    { id: 1, title: 'Biến thể', icon: '🔧' },
    { id: 2, title: 'Lớp phủ', icon: '✨' },
    { id: 3, title: 'Dãy độ', icon: '📊' },
  ];

  // Validation functions
  const validateBasicInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên lens là bắt buộc';
    }
    if (!formData.brandId) {
      newErrors.brandId = 'Brand là bắt buộc';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Cần ít nhất 1 ảnh';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Danh mục là bắt buộc';
    }

    // Check if there's exactly one primary image (order 'a')
    const primaryImages = formData.images.filter(img => img.imageOrder === 'a');
    if (primaryImages.length === 0) {
      newErrors.primaryImage = 'Cần có 1 ảnh chính (order "a")';
    } else if (primaryImages.length > 1) {
      newErrors.primaryImage = 'Chỉ được có 1 ảnh chính (order "a")';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVariants = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.variants.length === 0) {
      newErrors.variants = 'Cần ít nhất 1 biến thể';
    }

    formData.variants.forEach((variant, index) => {
      if (!variant.lensThicknessId) {
        newErrors[`variant_${index}_thickness`] = 'Độ dày là bắt buộc';
      }
      if (!variant.design) {
        newErrors[`variant_${index}_design`] = 'Thiết kế là bắt buộc';
      }
      if (!variant.material.trim()) {
        newErrors[`variant_${index}_material`] = 'Chất liệu là bắt buộc';
      }
      if (variant.price <= 0) {
        newErrors[`variant_${index}_price`] = 'Giá phải lớn hơn 0';
      }
      if (variant.stock < 0) {
        newErrors[`variant_${index}_stock`] = 'Tồn kho không được âm';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image management
  const addImage = () => {
    const newImage: LensImage = {
      id: `temp_${Date.now()}`,
      imageUrl: '',
      imageOrder: formData.images.length === 0 ? 'a' : 'b',
      isThumbnail: formData.images.length === 0,
    };
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage],
    }));
  };

  const updateImage = (index: number, updates: Partial<LensImage>) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], ...updates };

    // If changing to order 'a', make it thumbnail and remove 'a' from others
    if (updates.imageOrder === 'a') {
      newImages.forEach((img, i) => {
        if (i !== index && img.imageOrder === 'a') {
          img.imageOrder = 'b';
          img.isThumbnail = false;
        }
      });
      newImages[index].isThumbnail = true;
    }

    // If changing from order 'a', make it not thumbnail
    if (newImages[index].imageOrder !== 'a') {
      newImages[index].isThumbnail = false;
    }

    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first image primary
    if (newImages.length > 0 && !newImages.some(img => img.imageOrder === 'a')) {
      newImages[0].imageOrder = 'a';
      newImages[0].isThumbnail = true;
    }
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageUpload = (index: number, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    updateImage(index, { imageUrl, file });
  };

  // Variant management
  const addVariant = () => {
    const newVariant: LensVariant = {
      id: `temp_${Date.now()}`,
      lensThicknessId: 0,
      design: '',
      material: '',
      price: 0,
      stock: 0,
    };
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const updateVariant = (index: number, updates: Partial<LensVariant>) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index: number) => {
    const variantId = formData.variants[index].id;
    const newVariants = formData.variants.filter((_, i) => i !== index);
    
    // Remove associated refraction ranges
    const newRefractionRanges = { ...formData.refractionRanges };
    if (variantId) {
      delete newRefractionRanges[variantId];
    }
    
    setFormData(prev => ({
      ...prev,
      variants: newVariants,
      refractionRanges: newRefractionRanges,
    }));
  };

  // Coating management
  const addCoating = () => {
    const newCoating: LensCoating = {
      id: `temp_${Date.now()}`,
      name: '',
      price: 0,
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      coatings: [...prev.coatings, newCoating],
    }));
  };

  const updateCoating = (index: number, updates: Partial<LensCoating>) => {
    const newCoatings = [...formData.coatings];
    newCoatings[index] = { ...newCoatings[index], ...updates };
    setFormData(prev => ({ ...prev, coatings: newCoatings }));
  };

  const removeCoating = (index: number) => {
    const newCoatings = formData.coatings.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, coatings: newCoatings }));
  };

  // Refraction range management
  const addRefractionRange = (variantId: string) => {
    const newRange: LensRefractionRange = {
      id: `temp_${Date.now()}`,
      lensVariantId: variantId,
      refractionType: 'SPH',
      minValue: 0,
      maxValue: 0,
      stepValue: 0.25,
    };
    
    setFormData(prev => ({
      ...prev,
      refractionRanges: {
        ...prev.refractionRanges,
        [variantId]: [...(prev.refractionRanges[variantId] || []), newRange],
      },
    }));
  };

  const updateRefractionRange = (
    variantId: string,
    index: number,
    updates: Partial<LensRefractionRange>
  ) => {
    const newRanges = [...(formData.refractionRanges[variantId] || [])];
    newRanges[index] = { ...newRanges[index], ...updates };
    
    setFormData(prev => ({
      ...prev,
      refractionRanges: {
        ...prev.refractionRanges,
        [variantId]: newRanges,
      },
    }));
  };

  const removeRefractionRange = (variantId: string, index: number) => {
    const newRanges = (formData.refractionRanges[variantId] || []).filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      refractionRanges: {
        ...prev.refractionRanges,
        [variantId]: newRanges,
      },
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    // Validate all tabs
    const isBasicValid = validateBasicInfo();
    const isVariantsValid = validateVariants();
    
    if (!isBasicValid || !isVariantsValid) {
      alert('Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    setIsLoading(true);
    try {
      // Transform form data to match backend expectations
      const complexLensData: CreateComplexLensDto = {
        name: formData.name,
        status: formData.status,
        brandId: formData.brandId,
        origin: formData.origin,
        lensType: formData.lensType,
        description: formData.description,
        categoryId: formData.categoryId,
        images: formData.images.map(img => ({
          imageUrl: img.imageUrl,
          imageOrder: img.imageOrder,
          isThumbnail: img.isThumbnail,
          file: img.file
        })),
        variants: formData.variants.map(variant => ({
          lensThicknessId: variant.lensThicknessId,
          design: variant.design,
          material: variant.material,
          price: variant.price,
          stock: variant.stock
        })),
        coatings: formData.coatings.map(coating => ({
          name: coating.name,
          price: coating.price,
          description: coating.description
        })),
        refractionRanges: Object.fromEntries(
          Object.entries(formData.refractionRanges).map(([variantId, ranges], index) => [
            index, // Use index instead of variantId for backend
            ranges.map(range => ({
              refractionType: range.refractionType,
              minValue: range.minValue,
              maxValue: range.maxValue,
              stepValue: range.stepValue
            }))
          ])
        )
      };

      // Create lens with images using the new method
      const lensWithImagesData = {
        name: complexLensData.name,
        description: complexLensData.description,
        brandId: complexLensData.brandId,
        origin: complexLensData.origin,
        lensType: complexLensData.lensType,
        categoryId: complexLensData.categoryId,
        images: complexLensData.images
          .filter(img => img.file) // Only include images with files
          .map(img => ({
            file: img.file!,
            imageOrder: img.imageOrder,
            isThumbnail: img.isThumbnail
          }))
      };
      
      await createLensWithImages(lensWithImagesData);
      alert('Tạo lens thành công!');
      
      // TODO: After basic lens creation, create images, variants, coatings, and refraction ranges
      // This requires separate API calls or a new comprehensive backend endpoint
      
      // Reset form or navigate away
    } catch (error) {
      console.error('Error creating lens:', error);
      alert('Có lỗi xảy ra khi tạo lens');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBasicInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên Lens <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập tên lens"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.brandId}
            onChange={(e) => setFormData(prev => ({ ...prev, brandId: parseInt(e.target.value) }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.brandId ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-label="Chọn brand"
          >
            <option value={0}>Chọn brand</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xuất xứ
          </label>
          <input
            type="text"
            value={formData.origin}
            onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập xuất xứ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại lens
          </label>
          <select
            value={formData.lensType}
            onChange={(e) => setFormData(prev => ({ ...prev, lensType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Chọn loại lens"
          >
            <option value="">Chọn loại lens</option>
            {LENS_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: parseInt(e.target.value) }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-label="Chọn danh mục"
          >
            <option value={0}>Chọn danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập mô tả lens"
        />
      </div>

      {/* Images Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Hình ảnh <span className="text-red-500">*</span>
          </h3>
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm ảnh
          </button>
        </div>

        {errors.images && <p className="text-red-500 text-sm mb-4">{errors.images}</p>}
        {errors.primaryImage && <p className="text-red-500 text-sm mb-4">{errors.primaryImage}</p>}

        <div className="space-y-4">
          {formData.images.map((image, index) => (
            <div key={image.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload ảnh <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      aria-label={`Upload ảnh ${index + 1}`}
                    />
                    {image.imageUrl && (
                      <img
                        src={image.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ tự ảnh
                  </label>
                  <select
                    value={image.imageOrder}
                    onChange={(e) => updateImage(index, { imageOrder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Chọn thứ tự ảnh"
                  >
                    {IMAGE_ORDERS.map(order => (
                      <option key={order} value={order}>
                        {order} {order === 'a' ? '(Chính)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end space-x-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`thumbnail_${index}`}
                      checked={image.isThumbnail}
                      disabled={true} // Always disabled, controlled by imageOrder
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      title="Thumbnail được tự động chọn cho ảnh có thứ tự 'a'"
                    />
                    <label htmlFor={`thumbnail_${index}`} className="ml-2 text-sm text-gray-600">
                      Thumbnail
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    aria-label="Xóa ảnh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVariantsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Biến thể lens</h3>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm biến thể
        </button>
      </div>

      {errors.variants && <p className="text-red-500 text-sm mb-4">{errors.variants}</p>}

      <div className="space-y-6">
        {formData.variants.map((variant, index) => (
          <div key={variant.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-medium text-gray-800">Biến thể {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                aria-label="Xóa biến thể"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ dày <span className="text-red-500">*</span>
                </label>
                <select
                  value={variant.lensThicknessId}
                  onChange={(e) => updateVariant(index, { lensThicknessId: parseInt(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[`variant_${index}_thickness`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="Chọn độ dày lens"
                >
                  <option value={0}>Chọn độ dày</option>
                  {lensThicknesses.map(thickness => (
                    <option key={thickness.id} value={thickness.id}>
                      {thickness.name} - Index {thickness.indexValue}
                    </option>
                  ))}
                </select>
                {errors[`variant_${index}_thickness`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`variant_${index}_thickness`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thiết kế <span className="text-red-500">*</span>
                </label>
                <select
                  value={variant.design}
                  onChange={(e) => updateVariant(index, { design: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[`variant_${index}_design`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="Chọn thiết kế lens"
                >
                  <option value="">Chọn thiết kế</option>
                  {LENS_DESIGNS.map(design => (
                    <option key={design} value={design}>{design}</option>
                  ))}
                </select>
                {errors[`variant_${index}_design`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`variant_${index}_design`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chất liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={variant.material}
                  onChange={(e) => updateVariant(index, { material: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[`variant_${index}_material`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập chất liệu"
                />
                {errors[`variant_${index}_material`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`variant_${index}_material`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, { price: parseFloat(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[`variant_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors[`variant_${index}_price`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`variant_${index}_price`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tồn kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, { stock: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[`variant_${index}_stock`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors[`variant_${index}_stock`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`variant_${index}_stock`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCoatingsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Lớp phủ lens</h3>
        <button
          type="button"
          onClick={addCoating}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm lớp phủ
        </button>
      </div>

      <div className="space-y-4">
        {formData.coatings.map((coating, index) => (
          <div key={coating.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-medium text-gray-800">Lớp phủ {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeCoating(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                aria-label="Xóa lớp phủ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên lớp phủ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={coating.name}
                  onChange={(e) => updateCoating(index, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên lớp phủ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bổ sung
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={coating.price}
                  onChange={(e) => updateCoating(index, { price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={coating.description}
                onChange={(e) => updateCoating(index, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mô tả lớp phủ"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRefractionRangesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Dãy độ theo biến thể</h3>

      {formData.variants.map((variant, variantIndex) => {
        const variantId = variant.id!;
        const ranges = formData.refractionRanges[variantId] || [];

        return (
          <div key={variantId} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-800">
                Biến thể {variantIndex + 1}: {variant.material} - {variant.design}
              </h4>
              <button
                type="button"
                onClick={() => addRefractionRange(variantId)}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm dãy độ
              </button>
            </div>

            <div className="space-y-4">
              {ranges.map((range, rangeIndex) => (
                <div key={range.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Dãy độ {rangeIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeRefractionRange(variantId, rangeIndex)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      aria-label="Xóa dãy độ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại điều chỉnh
                      </label>
                      <select
                        value={range.refractionType}
                        onChange={(e) => updateRefractionRange(variantId, rangeIndex, {
                          refractionType: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        aria-label="Chọn loại điều chỉnh"
                      >
                        {REFRACTION_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá trị tối thiểu
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={range.minValue}
                        onChange={(e) => updateRefractionRange(variantId, rangeIndex, {
                          minValue: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá trị tối đa
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={range.maxValue}
                        onChange={(e) => updateRefractionRange(variantId, rangeIndex, {
                          maxValue: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bước nhảy
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        min="0.01"
                        value={range.stepValue}
                        onChange={(e) => updateRefractionRange(variantId, rangeIndex, {
                          stepValue: parseFloat(e.target.value) || 0.25
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.25"
                      />
                    </div>
                  </div>

                  {range.minValue > range.maxValue && (
                    <p className="text-red-500 text-sm mt-2">
                      Giá trị tối thiểu không được lớn hơn giá trị tối đa
                    </p>
                  )}
                  {range.stepValue <= 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      Bước nhảy phải lớn hơn 0
                    </p>
                  )}
                </div>
              ))}
            </div>

            {ranges.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Chưa có dãy độ nào cho biến thể này
              </p>
            )}
          </div>
        );
      })}

      {formData.variants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Hãy thêm biến thể trước để cấu hình dãy độ
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo Lens Mới</h1>
        <p className="text-gray-600">Điền thông tin để tạo lens mới với các biến thể và cấu hình</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 0 && renderBasicInfoTab()}
        {activeTab === 1 && renderVariantsTab()}
        {activeTab === 2 && renderCoatingsTab()}
        {activeTab === 3 && renderRefractionRangesTab()}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex space-x-4">
          {activeTab > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Quay lại
            </button>
          )}
          {activeTab < tabs.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tiếp theo
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu tất cả
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateLensForm;
