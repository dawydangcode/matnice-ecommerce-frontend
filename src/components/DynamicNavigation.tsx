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

const DynamicNavigation: React.FC = () => {
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
              to="/products?type=glasses"
              className="flex items-center text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              GLASSES
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>

            {/* Glasses Dropdown Content */}
            {activeDropdown === 'glasses' && (
              <div className="absolute left-0 mt-0 w-[1000px] bg-white shadow-lg rounded-md border z-50">
                <div className="p-6">
                  <div className="grid grid-cols-5 gap-6">
                      {/* Columns 1-4: From categories.ts */}
                      {glassesCategories.map((category, index) => (
                        <div key={index}>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">{category.title}</h3>
                          <ul className="space-y-2">
                            {category.items.map((item) => (
                              <li key={item}>
                                <Link
                                  to={`/products?type=glasses&${category.title.toLowerCase().replace(' ', '_')}=${item.toLowerCase().replace(' ', '-').replace("'", '')}`}
                                  className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      
                      {/* Column 5: Additional Categories */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                        <ul className="space-y-2">
                          {[
                            { label: 'Prescription Glasses', value: 'prescription' },
                            { label: 'Reading Glasses', value: 'reading' },
                            { label: 'Computer Glasses', value: 'computer' },
                            { label: 'Designer Frames', value: 'designer' },
                            { label: 'Budget Friendly', value: 'budget' },
                            { label: 'Luxury Eyewear', value: 'luxury' }
                          ].map((item) => (
                            <li key={item.value}>
                              <Link
                                to={`/products/glasses?category=${item.value}`}
                                className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                </div>
              </div>
            )}
          </div>

          {/* Sunglasses Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('sunglasses')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/products?type=sunglasses"
              className="flex items-center text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              SUNGLASSES
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>

            {/* Sunglasses Dropdown Content */}
            {activeDropdown === 'sunglasses' && (
              <div className="absolute left-0 mt-0 w-[800px] bg-white shadow-lg rounded-md border z-50">
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Use data from categories.ts */}
                    {sunglassesCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/products?type=sunglasses&${category.title.toLowerCase().replace(' ', '_')}=${item.toLowerCase().replace(' ', '-').replace("'", '')}`}
                                className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Lenses Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('contact-lenses')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/products/contact-lenses"
              className="flex items-center text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              CONTACT LENSES
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>

            {/* Contact Lenses Dropdown Content */}
            {activeDropdown === 'contact-lenses' && (
              <div className="absolute left-0 mt-0 w-[600px] bg-white shadow-lg rounded-md border z-50">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Column 1: By Type */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">By Type</h3>
                      <ul className="space-y-2">
                        {['Daily', 'Weekly', 'Monthly', 'Extended Wear', 'Colored', 'Toric'].map((type) => (
                          <li key={type}>
                            <Link
                              to={`/products/contact-lenses?type=${type.toLowerCase()}`}
                              className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                            >
                              {type}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Column 2: By Brand */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">By Brand</h3>
                      <ul className="space-y-2">
                        {['Acuvue', 'Biofinity', 'Air Optix', 'Proclear', 'FreshLook', 'DAILIES'].map((brand) => (
                          <li key={brand}>
                            <Link
                              to={`/products/contact-lenses?brand=${brand.toLowerCase()}`}
                              className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                            >
                              {brand}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Column 3: By Correction */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">By Correction</h3>
                      <ul className="space-y-2">
                        {[
                          { label: 'Nearsighted', value: 'nearsighted' },
                          { label: 'Farsighted', value: 'farsighted' },
                          { label: 'Astigmatism', value: 'astigmatism' },
                          { label: 'Presbyopia', value: 'presbyopia' },
                          { label: 'No Prescription', value: 'no-prescription' },
                          { label: 'Multifocal', value: 'multifocal' }
                        ].map((item) => (
                          <li key={item.value}>
                            <Link
                              to={`/products/contact-lenses?correction=${item.value}`}
                              className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Brands Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('brands')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/brands"
              className="flex items-center text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              BRANDS
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>

            {/* Brands Dropdown Content */}
            {activeDropdown === 'brands' && (
              <div className="absolute left-0 mt-0 w-[800px] bg-white shadow-lg rounded-md border z-50">
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Use data from categories.ts */}
                    {brandsCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/brands/${item.toLowerCase().replace(' ', '-').replace('&', 'and')}`}
                                className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Boutique Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('boutique')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/boutique"
              className="flex items-center text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              BOUTIQUE
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>

            {/* Boutique Dropdown Content */}
            {activeDropdown === 'boutique' && (
              <div className="absolute left-0 mt-0 w-[600px] bg-white shadow-lg rounded-md border z-50">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Use data from categories.ts */}
                    {boutiqueCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/boutique?${category.title.toLowerCase().replace(' ', '_')}=${item.toLowerCase().replace(' ', '-')}`}
                                className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => handleMouseEnter('ai')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/ai"
              className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200 font-medium"
            >
              AI
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>

            {/* AI Dropdown Content */}
            {activeDropdown === 'ai' && (
              <div className="absolute left-0 mt-0 w-[600px] bg-white shadow-lg rounded-md border z-50">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Use data from categories.ts */}
                    {aiCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">{category.title}</h3>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/ai?${category.title.toLowerCase().replace(' ', '_')}=${item.toLowerCase().replace(' ', '-')}`}
                                className="block py-2 px-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-all duration-200"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default DynamicNavigation;
