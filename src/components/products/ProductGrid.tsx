import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ProductCard } from '../../types/product-card.types';
import { formatVND } from '../../utils/currency';

interface ProductGridProps {
  products: ProductCard[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  isItemInWishlist: (itemType: 'lens' | 'product', itemId: number, selectedColorId?: number) => boolean;
  onWishlistToggle: (productId: number, isInWishlist: boolean) => void;
  user: any;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  selectedFilters: Array<{ type: string; value: any; label: string; remove: () => void }>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onClearFilters,
  isItemInWishlist,
  onWishlistToggle,
  user,
  sortBy,
  onSortChange,
  selectedFilters
}) => {
  return (
    <div className="product-list-area lg:col-start-2 lg:col-end-3">
      {/* Results Count and Sort Options */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="product-total-count">
            {total} Results
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="newest">Most popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Selected Filters - Hidden on mobile */}
      {selectedFilters.length > 0 && (
        <div className="mb-6 hidden md:block">
          <div className="flex flex-wrap gap-2 items-center">
            {selectedFilters.map((filter, index) => (
              <div
                key={`${filter.type}-${filter.value}-${index}`}
                className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{filter.label}</span>
                <button
                  onClick={filter.remove}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18v-6h6v6h-6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
          <button 
            onClick={onClearFilters}
            className="bg-black-600 text-white px-4 py-2 rounded-md hover:bg-black-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
              
              return (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="group cursor-pointer bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow block"
                >
                  <div className="relative rounded-lg mb-6 overflow-hidden h-96 flex items-center justify-center">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-row space-x-2 z-10">
                      {!!product.isNew && (
                        <div className="bg-white text-green-700 px-3 py-1 text-xs font-medium">
                          New
                        </div>
                      )}
                      {!!product.isBoutique && (
                        <div className="bg-gray-800 text-white px-3 py-1 text-xs font-medium">
                          Boutique
                        </div>
                      )}
                      {!!product.isSustainable && (
                        <div className="sustainable-badge px-3 py-1 text-xs font-medium">
                          Sustainable
                        </div>
                      )}
                    </div>
                    
                    {/* Heart Icon */}
                    <div className="absolute top-2 right-4 z-10">
                      <button 
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const currentIsInWishlist = isItemInWishlist('product', productId);
                          onWishlistToggle(productId, currentIsInWishlist);
                        }}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            isItemInWishlist('product', productId)
                              ? 'text-red-500 fill-red-500' 
                              : 'text-gray-400 hover:text-red-500'
                          }`} 
                        />
                      </button>
                    </div>
                    
                    {/* Product Image */}
                    <img 
                      src={product.thumbnailUrl || "/api/placeholder/400/320"}
                      alt={`${product.brandName} ${product.displayName}`}
                      className="w-full h-full max-w-[350px] max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/400/320";
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-4 p-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 text-secondary">{product.brandName}</h3>
                      <p className="text-base font-light text-secondary">{product.displayName}</p>
                    </div>
                    
                    {product.totalVariants > 1 && (
                      <p className="text-sm text-gray-500">{product.totalVariants} variants available</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-light text-secondary">Frame price without lenses</p>
                        <span className="text-right text-base font-bold text-primary">
                          {formatVND(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-black-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => onPageChange(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(total / pageSize)}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
