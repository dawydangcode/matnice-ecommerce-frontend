import React from 'react';

interface FilterHeaderProps {
  onClearAll?: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ onClearAll }) => {
  return (
    <div className="flex items-center justify-between mb-6">
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
  );
};

export default FilterHeader;
