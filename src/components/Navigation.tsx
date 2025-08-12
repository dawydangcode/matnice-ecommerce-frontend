import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  glassesCategories,
  sunglassesCategories,
  brandsCategories,
  boutiqueCategories,
  aiCategories
} from '../data/categories';

const Navigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleMouseEnter = (menu: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setActiveDropdown(null);
    }, 100); // 100ms delay
    setTimeoutId(id);
  };

  return (
    <nav className="bg-gray-50 border-t relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center space-x-8 py-3">
          
          {/* Glasses Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('glasses')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to="/glasses"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'glasses' 
                  ? 'text-gray-900 border-black font-bold' 
                  : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
              }`}
            >
              <span>GLASSES</span>
             </Link>
          </div>

          {/* Sunglasses Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('sunglasses')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to="/sunglasses"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'sunglasses' 
                  ? 'text-gray-900 border-black font-bold' 
                  : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
              }`}
            >
              <span>SUNGLASSES</span>
             </Link>
          </div>

          {/* Brands Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('brands')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to="/brands"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'brands' 
                  ? 'text-gray-900 border-black font-bold' 
                  : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
              }`}
            >
              <span>BRANDS</span>
             </Link>
          </div>

          {/* Boutique Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('boutique')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to="/boutique"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'boutique' 
                  ? 'text-gray-900 border-black font-bold' 
                  : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
              }`}
            >
              <span>BOUTIQUE</span>
             </Link>
          </div>

          {/* AI Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('ai')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to="/ai"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'ai' 
                  ? 'text-red-700 border-red-600 font-bold' 
                  : 'text-red-600 hover:text-red-700 hover:font-bold border-transparent hover:border-red-400'
              }`}
            >
              <span>AI</span>
             </Link>
          </div>

        </div>
      </div>

      {/* Full Width Dropdown Menus */}
      {activeDropdown && (
        <div 
          className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-50"
          onMouseEnter={() => {
            if (timeoutId) {
              clearTimeout(timeoutId);
              setTimeoutId(null);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            {activeDropdown === 'glasses' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {glassesCategories.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link 
                            to={`/glasses/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeDropdown === 'sunglasses' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {sunglassesCategories.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link 
                            to={`/sunglasses/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeDropdown === 'brands' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {brandsCategories.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link 
                            to={`/brands/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeDropdown === 'boutique' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {boutiqueCategories.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link 
                            to={`/boutique/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeDropdown === 'ai' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {aiCategories.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link 
                            to={`/ai/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
