import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Palette, 
  ChevronRight, 
  Search, 
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Product, ProductsResponse } from '../../types/product.types';
import { productService } from '../../services/product.service';
import ProductColorRecommendationModal from './ProductColorRecommendationModal';

interface ColorSkinRecommendationPageProps {
  onBack?: () => void;
}

const ColorSkinRecommendationPage: React.FC<ColorSkinRecommendationPageProps> = ({ onBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  const loadProducts = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const response: ProductsResponse = await productService.getProducts({
        page,
        limit: 10,
        search,
      });

      setProducts(response.products || []);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1, searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowRecommendationModal(true);
  };

  const handleCloseModal = () => {
    setShowRecommendationModal(false);
    setSelectedProduct(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadProducts(page, searchQuery);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Đang tải danh sách sản phẩm...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Palette className="w-7 h-7 mr-3 text-[#43AC78]" />
              Color Skin Recommendation
            </h2>
            <p className="text-gray-600 mt-1">
              Quản lý gợi ý màu sắc phù hợp với từng loại da
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78] focus:border-[#43AC78]"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-[#43AC78]" />
            Danh sách sản phẩm ({products.length})
          </h3>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Không tìm thấy sản phẩm phù hợp với từ khóa tìm kiếm' : 'Chưa có sản phẩm nào trong hệ thống'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => handleProductClick(product)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-[#43AC78] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-[#43AC78] transition-colors">
                          {product.productName}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.brand?.name || 'Unknown Brand'}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm text-gray-600">
                            Giá: <span className="font-medium text-[#43AC78]">
                              {product.price?.toLocaleString('vi-VN')}₫
                            </span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Kho: <span className="font-medium">{product.stock || 0}</span>
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#43AC78] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, currentPage - 2) + i;
                      if (page > totalPages) return null;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm border rounded ${
                            page === currentPage
                              ? 'bg-[#43AC78] text-white border-[#43AC78]'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Color Recommendation Modal */}
      {showRecommendationModal && selectedProduct && (
        <ProductColorRecommendationModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ColorSkinRecommendationPage;
