import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lensService } from '../services/lens.service';
import {
  glassesCategories,
  sunglassesCategories,
  brandsCategories,
  boutiqueCategories,
  aiCategories
} from '../data/categories';

interface LensCategory {
  id: string;
  name: string;
  description?: string;
}

interface LensBrand {
  id: string;
  name: string;
  description?: string;
}

const Navigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lensCategories, setLensCategories] = useState<LensCategory[]>([]);
  const [lensBrands, setLensBrands] = useState<LensBrand[]>([]);
  const [isLoadingLensData, setIsLoadingLensData] = useState(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Load lens data when lens dropdown is opened
  useEffect(() => {
    if (activeDropdown === 'lens' && lensCategories.length === 0 && lensBrands.length === 0 && !isLoadingLensData) {
      setIsLoadingLensData(true);
      Promise.all([
        lensService.getLensCategories(),
        lensService.getLensBrands()
      ]).then(([categories, brands]) => {
        setLensCategories(categories);
        setLensBrands(brands);
        setIsLoadingLensData(false);
      }).catch(error => {
        console.error('Error loading lens data:', error);
        setIsLoadingLensData(false);
      });
    }
  }, [activeDropdown, lensCategories.length, lensBrands.length, isLoadingLensData]);

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
              to="/glasses?category=all-glasses"
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
              to="/sunglasses?category=all"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'sunglasses' 
                  ? 'text-gray-900 border-black font-bold' 
                  : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
              }`}
            >
              <span>SUNGLASSES</span>
             </Link>
          </div>

          {/* Lens Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('lens')}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to="/lenses"
              className={`flex items-center space-x-1 font-medium text-base transition-all duration-200 py-2 px-4 border-b-2 ${
                activeDropdown === 'lens' 
                  ? 'text-gray-900 border-black font-bold' 
                  : 'text-gray-700 hover:text-gray-900 hover:font-bold border-transparent hover:border-gray-300'
              }`}
            >
              <span>LENS</span>
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
                            to={`/glasses?category=${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
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
                            to="/sunglasses"
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

            {activeDropdown === 'lens' && (
              <div className="grid grid-cols-3 gap-8">
                {/* Lens Types */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Danh mục</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        to="/lenses?type=single-vision"
                        className="text-sm text-gray-600 hover:text-gray-900 block"
                      >
                        Single Vision
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/lenses?type=drive-safe"
                        className="text-sm text-gray-600 hover:text-gray-900 block"
                      >
                        Drive Safe
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/lenses?type=progressive"
                        className="text-sm text-gray-600 hover:text-gray-900 block"
                      >
                        Progressive
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/lenses?type=office"
                        className="text-sm text-gray-600 hover:text-gray-900 block"
                      >
                        Office
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/lenses?type=non-prescription"
                        className="text-sm text-gray-600 hover:text-gray-900 block"
                      >
                        Non-Prescription
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Lens Categories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Chức năng</h3>
                  {isLoadingLensData ? (
                    <div className="text-sm text-gray-500">Đang tải...</div>
                  ) : (
                    <ul className="space-y-2">
                      {lensCategories.map((category) => (
                        <li key={category.id}>
                          <Link 
                            to={`/lenses?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900 block"
                            title={category.description}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                      {lensCategories.length === 0 && !isLoadingLensData && (
                        <li className="text-sm text-gray-500">Không có danh mục</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Lens Brands */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Thương hiệu tròng kính</h3>
                  {isLoadingLensData ? (
                    <div className="text-sm text-gray-500">Đang tải...</div>
                  ) : (
                    <ul className="space-y-2">
                      {lensBrands.map((brand) => (
                        <li key={brand.id}>
                          <Link 
                            to={`/lenses?brand=${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900 block"
                            title={brand.description}
                          >
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                      {lensBrands.length === 0 && !isLoadingLensData && (
                        <li className="text-sm text-gray-500">Không có thương hiệu</li>
                      )}
                    </ul>
                  )}
                </div>
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
                            to="/brands"
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
                            to="/boutique"
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
                            to="/ai"
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
