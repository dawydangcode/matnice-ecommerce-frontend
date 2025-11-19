import React from 'react';

interface MobileFilterButtonsProps {
  onFilterClick: (tab: string) => void;
  filterCounts: {
    yourSize: number;
    frame: number;
    brand: number;
    price: number;
    lens: number;
  };
}

const MobileFilterButtons: React.FC<MobileFilterButtonsProps> = ({ onFilterClick, filterCounts }) => {
  return (
    <div className="md:hidden bg-white border-b px-4 py-3">
      <h3 className="text-sm font-bold text-gray-700 mb-3">FILTER BY</h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => onFilterClick('your-size')}
          className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          Your size
          {filterCounts.yourSize > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
              {filterCounts.yourSize}
            </span>
          )}
        </button>
        <button
          onClick={() => onFilterClick('frame')}
          className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          Frame
          {filterCounts.frame > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
              {filterCounts.frame}
            </span>
          )}
        </button>
        <button
          onClick={() => onFilterClick('brand')}
          className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          Brand
          {filterCounts.brand > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
              {filterCounts.brand}
            </span>
          )}
        </button>
        <button
          onClick={() => onFilterClick('price')}
          className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          Price
          {filterCounts.price > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
              {filterCounts.price}
            </span>
          )}
        </button>
        <button
          onClick={() => onFilterClick('lens')}
          className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          Lens
          {filterCounts.lens > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
              {filterCounts.lens}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileFilterButtons;
