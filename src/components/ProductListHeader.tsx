import React from 'react';
import { Grid, List } from 'lucide-react';

interface ProductListHeaderProps {
  total: number;
  viewMode: 'grid' | 'list';
  sortBy: string;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sortBy: string) => void;
  onClearAll?: () => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  total,
  viewMode,
  sortBy,
  onViewModeChange,
  onSortChange,
  onClearAll
}) => {
  return (
    <section className="bg-white py-4">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Left side: Filter title and Results count */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
              {onClearAll && (
                <button 
                  onClick={onClearAll}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <p className="text-gray-600 font-medium">{total} Results</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select 
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Most Popular</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="name">New</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListHeader;
