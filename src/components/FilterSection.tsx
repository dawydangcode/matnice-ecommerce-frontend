import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  children, 
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 text-left hover:bg-gray-50 rounded px-2 transition-all duration-200 ease-in-out"
      >
        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
          {title}
        </h4>
        <div className={`transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-0' : 'rotate-0'}`}>
          {isExpanded ? (
            <Minus className="w-4 h-4 text-gray-500 transition-all duration-200" />
          ) : (
            <Plus className="w-4 h-4 text-gray-500 transition-all duration-200" />
          )}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          isExpanded 
            ? 'max-h-screen opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <div className="mt-4 px-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
