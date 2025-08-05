import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter
} from 'lucide-react';
import { useProductStore } from '../../stores/product.store';
import { Product, ProductType, ProductGenderType } from '../../types/product.types';
import toast from 'react-hot-toast';

interface ProductListPageProps {
  onEditProduct: (product: Product) => void;
  onCreateProduct: () => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ onEditProduct, onCreateProduct }) => {
  const {
    products,
    categories,
    brands,
    isLoading,
    error,
    pagination,
    fetchProducts,
    fetchCategories,
    fetchBrands,
    deleteProduct,
    clearError,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>();
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState<ProductType | undefined>();
  const [selectedGender, setSelectedGender] = useState<ProductGenderType | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = () => {
    fetchProducts({
      search: searchTerm || undefined,
      category: selectedCategory,
      brand: selectedBrand,
      type: selectedType,
      gender: selectedGender,
      page: 1,
      limit: pagination.limit,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(undefined);
    setSelectedBrand(undefined);
    setBrandSearchTerm('');
    setSelectedType(undefined);
    setSelectedGender(undefined);
    setShowBrandDropdown(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        toast.success('Xóa sản phẩm thành công!');
      } catch (error) {
        toast.error('Xóa sản phẩm thất bại!');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getProductTypeLabel = (type: ProductType) => {
    const labels = {
      [ProductType.GLASSES]: 'Kính mắt',
      [ProductType.SUNGLASSES]: 'Kính râm',
    };
    return labels[type] || type;
  };

  const getGenderLabel = (gender: ProductGenderType) => {
    const labels = {
      [ProductGenderType.MALE]: 'Nam',
      [ProductGenderType.FEMALE]: 'Nữ',
      [ProductGenderType.UNISEX]: 'Unisex',
    };
    return labels[gender] || gender;
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
  );

  const handleBrandSelect = (brand: { id: number; name: string }) => {
    setSelectedBrand(brand.id);
    setBrandSearchTerm(brand.name);
    setShowBrandDropdown(false);
  };

  const handleBrandInputChange = (value: string) => {
    setBrandSearchTerm(value);
    setShowBrandDropdown(true);
    // Reset selected brand if the input doesn't match exactly
    const exactMatch = brands.find(brand => brand.name.toLowerCase() === value.toLowerCase());
    if (exactMatch) {
      setSelectedBrand(exactMatch.id);
    } else {
      setSelectedBrand(undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        
        <button
          onClick={onCreateProduct}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn danh mục để lọc"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  value={brandSearchTerm}
                  onChange={(e) => handleBrandInputChange(e.target.value)}
                  onFocus={() => setShowBrandDropdown(true)}
                  onBlur={() => {
                    // Delay hiding dropdown to allow click on options
                    setTimeout(() => setShowBrandDropdown(false), 200);
                  }}
                  placeholder="Tìm kiếm thương hiệu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Tìm kiếm thương hiệu"
                />
                
                {/* Dropdown */}
                {showBrandDropdown && brandSearchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => handleBrandSelect(brand)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {brand.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        Không tìm thấy thương hiệu nào
                      </div>
                    )}
                  </div>
                )}
                
                {/* Show selected brand */}
                {selectedBrand && !brandSearchTerm && (
                  <div className="mt-1 text-sm text-green-600">
                    Đã chọn: {brands.find(b => b.id === selectedBrand)?.name}
                  </div>
                )}
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại sản phẩm
                </label>
                <select
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value as ProductType || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn loại sản phẩm để lọc"
                >
                  <option value="">Tất cả loại</option>
                  <option value={ProductType.GLASSES}>Kính mắt</option>
                  <option value={ProductType.SUNGLASSES}>Kính râm</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  value={selectedGender || ''}
                  onChange={(e) => setSelectedGender(e.target.value as ProductGenderType || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Chọn giới tính để lọc"
                >
                  <option value="">Tất cả</option>
                  <option value={ProductGenderType.MALE}>Nam</option>
                  <option value={ProductGenderType.FEMALE}>Nữ</option>
                  <option value={ProductGenderType.UNISEX}>Unisex</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button - Only show if any filter is active */}
            {(searchTerm || selectedCategory || selectedBrand || brandSearchTerm || selectedType || selectedGender) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images?.[0] ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={product.images[0].imageUrl}
                                alt={product.productName}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.brand?.name} • {getGenderLabel(product.gender)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {getProductTypeLabel(product.productType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} sản phẩm
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? 'Có sẵn' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {/* View product details */}}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.productId, product.productName)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sản phẩm</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bắt đầu bằng cách tạo sản phẩm mới.
                </p>
                <div className="mt-6">
                  <button
                    onClick={onCreateProduct}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Thêm sản phẩm
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Trước
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">1</span> đến{' '}
                      <span className="font-medium">{products.length}</span> của{' '}
                      <span className="font-medium">{pagination.total}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Trước
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Sau
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
