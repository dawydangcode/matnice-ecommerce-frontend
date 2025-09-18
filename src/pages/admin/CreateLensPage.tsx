import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Upload } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { useLensBrandStore } from '../../stores/lensBrand.store';
import { useLensCategoryStore } from '../../stores/lensCategory.store';
import { useLensThicknessStore } from '../../stores/lensThickness.store';
import { lensCategoryService } from '../../services/lensCategory.service';
import { lensVariantService } from '../../services/lensVariant.service';
import { lensCoatingService } from '../../services/lensCoating.service';
import { lensImageService } from '../../services/lensImage.service';
import { lensVariantRefractionRangeService } from '../../services/lensVariantRefractionRange.service';
import { lensVariantTintColorService } from '../../services/lensVariantTintColor.service';
import { 
  LensDesignType, 
  LensMaterialsType, 
  LensRefractionType,
  getDesignOptions, 
  getMaterialOptions, 
  getRefractionOptions,
  type LensDesignTypeValues,
  type LensMaterialsTypeValues,
  type LensRefractionTypeValues
} from '../../constants/lensEnums';

interface CreateLensPageProps {
  onCancel: () => void;
}

interface LensVariant {
  id: string;
  lensThicknessId: number;
  design: LensDesignTypeValues;
  material: LensMaterialsTypeValues;
  price: number;
  stock: number;
  refractionRanges: RefractionRange[];
  tintColors: TintColor[];
}

interface RefractionRange {
  id: string;
  refractionType: LensRefractionTypeValues;
  minValue: number;
  maxValue: number;
  stepValue: number;
}

interface TintColor {
  id: string;
  name: string;
  colorCode: string;
  image?: File;
}

interface LensCoating {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface LensImage {
  id: string;
  file: File;
  order: 'a' | 'b' | 'c' | 'd' | 'e';
  preview: string;
}

const CreateLensPage: React.FC<CreateLensPageProps> = ({ onCancel }) => {
  const { createLens, isLoading } = useLensStore();
  const { lensBrands, fetchLensBrands } = useLensBrandStore();
  const { lensCategories, fetchLensCategories } = useLensCategoryStore();
  const { lensThicknesses, fetchLensThicknesses } = useLensThicknessStore();

  // Basic lens info
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    brandId: '',
    lensType: 'SINGLE_VISION' as 'SINGLE_VISION' | 'DRIVE_SAFE' | 'PROGRESSIVE' | 'OFFICE' | 'NON_PRESCRIPTION',
    status: 'IN_STOCK' as 'OUT_OF_STOCK' | 'IN_STOCK' | 'PRE_ORDER',
    description: '',
    // Additional field for category selection (not part of CreateLensBodyDto)
    categoryLensIds: [] as string[],
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Helper function to get input class with error styling
  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorClass = "border-red-500 bg-red-50";
    const normalClass = "border-gray-300";
    
    return `${baseClass} ${validationErrors.includes(fieldName) ? errorClass : normalClass}`;
  };

  // Complex relationships
  const [variants, setVariants] = useState<LensVariant[]>([]);
  const [coatings, setCoatings] = useState<LensCoating[]>([]);
  const [images, setImages] = useState<LensImage[]>([]);
  
  // Available options from backend enums  
  const designOptions = getDesignOptions();
  const materialOptions = getMaterialOptions();
  const refractionOptions = getRefractionOptions();

  useEffect(() => {
    fetchLensBrands();
    fetchLensCategories();
    fetchLensThicknesses();
  }, [fetchLensBrands, fetchLensCategories, fetchLensThicknesses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.includes(name)) {
      setValidationErrors(prev => prev.filter(field => field !== name));
    }
  };

  const addVariant = () => {
    const newVariant: LensVariant = {
      id: `variant_${Date.now()}`,
      lensThicknessId: 1,
      design: LensDesignType.NONE,
      material: LensMaterialsType.CR39,
      price: 0,
      stock: 0,
      refractionRanges: [],
      tintColors: []
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId));
  };

  const updateVariant = (variantId: string, field: string, value: any) => {
    setVariants(variants.map(variant => 
      variant.id === variantId ? { ...variant, [field]: value } : variant
    ));
  };

  const addRefractionRange = (variantId: string) => {
    const newRange: RefractionRange = {
      id: `range_${Date.now()}`,
      refractionType: LensRefractionType.SPHERICAL,
      minValue: -8.00,
      maxValue: 6.00,
      stepValue: 0.25
    };
    
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, refractionRanges: [...variant.refractionRanges, newRange] }
        : variant
    ));
  };

  const removeRefractionRange = (variantId: string, rangeId: string) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, refractionRanges: variant.refractionRanges.filter(r => r.id !== rangeId) }
        : variant
    ));
  };

  const updateRefractionRange = (variantId: string, rangeId: string, field: string, value: any) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { 
            ...variant, 
            refractionRanges: variant.refractionRanges.map(range => 
              range.id === rangeId ? { ...range, [field]: value } : range
            )
          }
        : variant
    ));
  };

  const addTintColor = (variantId: string) => {
    const newTintColor: TintColor = {
      id: `tint_${Date.now()}`,
      name: '',
      colorCode: '#808080'
    };
    
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, tintColors: [...variant.tintColors, newTintColor] }
        : variant
    ));
  };

  const removeTintColor = (variantId: string, tintId: string) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, tintColors: variant.tintColors.filter(t => t.id !== tintId) }
        : variant
    ));
  };

  const updateTintColor = (variantId: string, tintId: string, field: string, value: any) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { 
            ...variant, 
            tintColors: variant.tintColors.map(tint => 
              tint.id === tintId ? { ...tint, [field]: value } : tint
            )
          }
        : variant
    ));
  };

  const addCoating = () => {
    const newCoating: LensCoating = {
      id: `coating_${Date.now()}`,
      name: '',
      price: 0,
      description: ''
    };
    setCoatings([...coatings, newCoating]);
  };

  const removeCoating = (coatingId: string) => {
    setCoatings(coatings.filter(c => c.id !== coatingId));
  };

  const updateCoating = (coatingId: string, field: string, value: any) => {
    setCoatings(coatings.map(coating => 
      coating.id === coatingId ? { ...coating, [field]: value } : coating
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: LensImage[] = [];
      const orders: ('a' | 'b' | 'c' | 'd' | 'e')[] = ['a', 'b', 'c', 'd', 'e'];
      
      Array.from(files).slice(0, 5).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newImage: LensImage = {
            id: `image_${Date.now()}_${index}`,
            file,
            order: orders[index],
            preview: reader.result as string
          };
          newImages.push(newImage);
          
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setValidationErrors([]);
      
      // Validate form with specific error messages
      const missingFields = [];
      const errorFields = [];
      
      if (!formData.name.trim()) {
        missingFields.push('Tên lens');
        errorFields.push('name');
      }
      
      if (!formData.origin.trim()) {
        missingFields.push('Xuất xứ');
        errorFields.push('origin');
      }
      
      if (!formData.brandId) {
        missingFields.push('Thương hiệu lens');
        errorFields.push('brandId');
      }
      
      if (!formData.lensType) {
        missingFields.push('Loại lens');
        errorFields.push('lensType');
      }

      if (missingFields.length > 0) {
        setValidationErrors(errorFields);
        alert(`Vui lòng điền đầy đủ các thông tin bắt buộc:\n- ${missingFields.join('\n- ')}`);
        return;
      }

      if (variants.length === 0) {
        alert('Vui lòng thêm ít nhất một variant cho lens');
        return;
      }

      // Debug logging
      console.log('=== LENS CREATION DEBUG ===');
      console.log('Form data:', formData);
      console.log('Variants:', variants);
      console.log('Coatings:', coatings);
      console.log('Images:', images);
      console.log('=== END DEBUG ===');

      // Create lens data structure - only fields that CreateLensBodyDto expects
      const lensData = {
        name: formData.name,
        origin: formData.origin,
        brandId: Number(formData.brandId), // Convert to number as backend expects
        lensType: formData.lensType,
        status: formData.status,
        description: formData.description,
      };

      // Submit lens to API first
      console.log('1. Creating lens...', lensData);
      const createdLens = await createLens(lensData);
      
      if (!createdLens) {
        throw new Error('Không thể tạo lens');
      }
      console.log('1. Lens created successfully:', createdLens);
      
      // If categories are selected, create lens-category relationships
      if (formData.categoryLensIds.length > 0) {
        console.log('2. Creating lens-category relationships...');
        const categoryLensIds = formData.categoryLensIds.map(id => Number(id));
        await lensCategoryService.createMultipleLensCategories(createdLens.id, categoryLensIds);
        console.log('2. Lens-category relationships created successfully');
      }
      
      // Create lens variants
      if (variants.length > 0) {
        console.log('3. Creating lens variants...', variants);
        const variantData = variants.map(variant => ({
          lensThicknessId: variant.lensThicknessId,
          design: variant.design,
          material: variant.material,
          price: variant.price,
          stock: variant.stock,
        }));
        
        const createdVariants = await lensVariantService.createMultipleLensVariants(createdLens.id, variantData);
        console.log('3. Lens variants created successfully:', createdVariants);
        
        // Create refraction ranges and tint colors for each variant
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];
          const createdVariant = createdVariants[i];
          
          if (variant.refractionRanges.length > 0) {
            console.log(`3.${i+1}a. Creating refraction ranges for variant ${createdVariant.id}...`, variant.refractionRanges);
            const refractionRangeData = variant.refractionRanges.map(range => ({
              refractionType: range.refractionType,
              minValue: range.minValue,
              maxValue: range.maxValue,
              stepValue: range.stepValue,
            }));
            
            const createdRanges = await lensVariantRefractionRangeService.createMultipleRefractionRanges(createdVariant.id, refractionRangeData);
            console.log(`3.${i+1}a. Refraction ranges created successfully:`, createdRanges);
          }
          
          if (variant.tintColors.length > 0) {
            console.log(`3.${i+1}b. Creating tint colors for variant ${createdVariant.id}...`, variant.tintColors);
            const tintColorData = variant.tintColors.map(tint => ({
              name: tint.name,
              colorCode: tint.colorCode,
              // TODO: Handle image upload if needed
            }));
            
            const createdTintColors = await lensVariantTintColorService.createMultipleTintColors(createdVariant.id, tintColorData);
            console.log(`3.${i+1}b. Tint colors created successfully:`, createdTintColors);
          }
        }
      }
      
      // Create lens coatings
      if (coatings.length > 0) {
        console.log('4. Creating lens coatings...', coatings);
        const coatingData = coatings.map(coating => ({
          name: coating.name,
          price: coating.price,
          description: coating.description,
        }));
        
        const createdCoatings = await lensCoatingService.createMultipleLensCoatings(createdLens.id, coatingData);
        console.log('4. Lens coatings created successfully:', createdCoatings);
      }
      
      // Create lens images
      if (images.length > 0) {
        console.log('5. Creating lens images...', images);
        // TODO: Upload images to server first, then create image records
        // For now, we'll use placeholder URLs
        const imageData = images.map(image => ({
          imageUrl: `placeholder_${image.order}.jpg`, // TODO: Replace with actual uploaded URL
          order: image.order,
        }));
        
        const createdImages = await lensImageService.createMultipleLensImages(createdLens.id, imageData);
        console.log('5. Lens images created successfully:', createdImages);
      }
      
      alert('Tạo lens thành công với tất cả thông tin liên quan!');
      setValidationErrors([]); // Clear validation errors on success
      onCancel(); // Go back to list
      
    } catch (error) {
      console.error('Error creating lens:', error);
      alert('Có lỗi xảy ra khi tạo lens');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thêm tròng kính mới</h1>
            <p className="text-gray-600">Tạo sản phẩm tròng kính với đầy đủ thông tin</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Đang lưu...' : 'Lưu lens'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên lens <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={getInputClassName('name')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xuất xứ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="Ví dụ: Việt Nam, Nhật Bản, Đức..."
                className={getInputClassName('origin')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thương hiệu lens <span className="text-red-500">*</span>
              </label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className={getInputClassName('brandId')}
                required
              >
                <option value="">Chọn thương hiệu</option>
                {lensBrands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục lens
              </label>
              <select
                name="categoryLensIds"
                value={formData.categoryLensIds}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({ ...prev, categoryLensIds: selectedOptions }));
                }}
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              >
                {lensCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">Giữ Ctrl để chọn nhiều danh mục</p>
              
              {/* Display selected categories */}
              {formData.categoryLensIds.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Danh mục đã chọn:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.categoryLensIds.map(categoryId => {
                      const category = lensCategories.find(c => c.id.toString() === categoryId);
                      return (
                        <span 
                          key={categoryId} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {category?.name}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                categoryLensIds: prev.categoryLensIds.filter(id => id !== categoryId)
                              }));
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại lens <span className="text-red-500">*</span>
              </label>
              <select
                name="lensType"
                value={formData.lensType}
                onChange={handleInputChange}
                className={getInputClassName('lensType')}
                required
              >
                <option value="SINGLE_VISION">Single Vision</option>
                <option value="DRIVE_SAFE">Drive Safe</option>
                <option value="PROGRESSIVE">Progressive</option>
                <option value="OFFICE">Office</option>
                <option value="NON_PRESCRIPTION">Non Prescription</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="IN_STOCK">Còn hàng</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
                <option value="PRE_ORDER">Đặt trước</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Lens Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hình ảnh lens</h2>
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Tải ảnh lên</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {images.map(image => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt={`${image.order.toUpperCase()}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {image.order.toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lens Variants */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Biến thể lens</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm variant</span>
            </button>
          </div>

          <div className="space-y-6">
            {variants.map((variant, index) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Variant #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Variant basic info */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chiết suất
                    </label>
                    <select
                      value={variant.lensThicknessId}
                      onChange={(e) => updateVariant(variant.id, 'lensThicknessId', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {lensThicknesses.map(thickness => (
                        <option key={thickness.id} value={thickness.id}>{thickness.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thiết kế
                    </label>
                    <select
                      value={variant.design}
                      onChange={(e) => updateVariant(variant.id, 'design', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {designOptions.map(design => (
                        <option key={design.value} value={design.value}>{design.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chất liệu
                    </label>
                    <select
                      value={variant.material}
                      onChange={(e) => updateVariant(variant.id, 'material', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {materialOptions.map(material => (
                        <option key={material.value} value={material.value}>{material.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tồn kho
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                {/* Refraction Ranges */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Dãy độ (Refraction Ranges)</h4>
                    <button
                      type="button"
                      onClick={() => addRefractionRange(variant.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm dãy độ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {variant.refractionRanges.map(range => (
                      <div key={range.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <select
                          value={range.refractionType}
                          onChange={(e) => updateRefractionRange(variant.id, range.id, 'refractionType', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {refractionOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Min"
                          value={range.minValue}
                          onChange={(e) => updateRefractionRange(variant.id, range.id, 'minValue', Number(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                          step="0.25"
                        />
                        <span className="text-gray-500">đến</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={range.maxValue}
                          onChange={(e) => updateRefractionRange(variant.id, range.id, 'maxValue', Number(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                          step="0.25"
                        />
                        <span className="text-gray-500">bước</span>
                        <input
                          type="number"
                          placeholder="Step"
                          value={range.stepValue}
                          onChange={(e) => updateRefractionRange(variant.id, range.id, 'stepValue', Number(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                          step="0.25"
                        />
                        <button
                          type="button"
                          onClick={() => removeRefractionRange(variant.id, range.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tint Colors */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Màu tint (nếu là tròng đổi màu)</h4>
                    <button
                      type="button"
                      onClick={() => addTintColor(variant.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm màu</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {variant.tintColors.map(tint => (
                      <div key={tint.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <input
                          type="text"
                          placeholder="Tên màu"
                          value={tint.name}
                          onChange={(e) => updateTintColor(variant.id, tint.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={tint.colorCode}
                            onChange={(e) => updateTintColor(variant.id, tint.id, 'colorCode', e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="#808080"
                            value={tint.colorCode}
                            onChange={(e) => updateTintColor(variant.id, tint.id, 'colorCode', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTintColor(variant.id, tint.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lens Coatings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Lớp phủ lens</h2>
            <button
              type="button"
              onClick={addCoating}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm lớp phủ</span>
            </button>
          </div>

          <div className="space-y-4">
            {coatings.map(coating => (
              <div key={coating.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Tên lớp phủ"
                  value={coating.name}
                  onChange={(e) => updateCoating(coating.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Giá"
                  value={coating.price}
                  onChange={(e) => updateCoating(coating.id, 'price', Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={coating.description}
                  onChange={(e) => updateCoating(coating.id, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeCoating(coating.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateLensPage;
