import React, { useState, useEffect } from 'react';
import { Search, X, Loader } from 'lucide-react';
import productCardService from '../services/product-card.service';
import { ProductCard } from '../types/product-card.types';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Debounce timer
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(true);
      
      try {
        const response = await productCardService.getProductCards({
          search: searchQuery,
          page: 1,
          limit: 20,
        });
        
        console.log('Search response:', response);
        console.log('Total results:', response.data?.length);
        
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-slideDown">
        {/* Header with Search Input */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <Search className="w-5 h-5 text-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 text-xl outline-none placeholder-gray-400 font-light"
            />
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>

          {/* Search Tips */}
          {!hasSearched && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3 font-medium">Gợi ý tìm kiếm</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSearchQuery('Gucci')}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200 text-sm font-medium hover:shadow-sm"
                >
                  Gucci
                </button>
                <button
                  onClick={() => setSearchQuery('oval')}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200 text-sm font-medium hover:shadow-sm"
                >
                  Gọng oval
                </button>
                <button
                  onClick={() => setSearchQuery('plastic')}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200 text-sm font-medium hover:shadow-sm"
                >
                  Chất liệu plastic
                </button>
                <button
                  onClick={() => setSearchQuery('grey')}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200 text-sm font-medium hover:shadow-sm"
                >
                  Màu xám
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="text-gray-500 text-sm">Đang tìm kiếm...</p>
              </div>
            </div>
          ) : hasSearched && searchResults.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-700 text-lg font-medium mb-2">Không tìm thấy sản phẩm</p>
                <p className="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6 px-2">
                <span className="font-semibold text-gray-700">{searchResults.length}</span> sản phẩm
              </p>
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(Number(product.id))}
                    className="flex items-center space-x-5 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 group border border-transparent hover:border-gray-100 hover:shadow-sm"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden ring-1 ring-gray-100">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.displayName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-300"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 truncate group-hover:text-black transition-colors">
                        {product.displayName}
                      </h3>
                      
                      <p className="text-sm text-gray-500 mb-2">
                        {product.brandName}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {product.price?.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Add inline styles for animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchModal;
