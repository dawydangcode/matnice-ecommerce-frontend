import React from 'react';
import { BrandData } from '../services/brand.service';
import { 
  FrameType, 
  FrameShapeType, 
  FrameMaterialType, 
  FrameBridgeDesignType, 
  FrameStyleType,
  ProductGenderType 
} from '../types/product.types';

interface ProductFilterSidebarProps {
  brands: BrandData[];
  selectedBrands: number[];
  setSelectedBrands: (ids: number[]) => void;
  brandSearchTerm: string;
  setBrandSearchTerm: (term: string) => void;
  selectedGenders: ProductGenderType[];
  setSelectedGenders: (genders: ProductGenderType[]) => void;
  selectedFrameTypes: FrameType[];
  setSelectedFrameTypes: (types: FrameType[]) => void;
  selectedFrameShapes: FrameShapeType[];
  setSelectedFrameShapes: (shapes: FrameShapeType[]) => void;
  selectedFrameMaterials: FrameMaterialType[];
  setSelectedFrameMaterials: (materials: FrameMaterialType[]) => void;
  selectedBridgeDesigns: FrameBridgeDesignType[];
  setSelectedBridgeDesigns: (designs: FrameBridgeDesignType[]) => void;
  selectedStyles: FrameStyleType[];
  setSelectedStyles: (styles: FrameStyleType[]) => void;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  brands,
  selectedBrands,
  setSelectedBrands,
  brandSearchTerm,
  setBrandSearchTerm,
  selectedGenders,
  setSelectedGenders,
  selectedFrameTypes,
  setSelectedFrameTypes,
  selectedFrameShapes,
  setSelectedFrameShapes,
  selectedFrameMaterials,
  setSelectedFrameMaterials,
  selectedBridgeDesigns,
  setSelectedBridgeDesigns,
  selectedStyles,
  setSelectedStyles,
}) => {
  // Filter UI (simplified, you can copy your full UI here)
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 space-y-1">
      {/* Brand Filter */}
      <div>
        <input 
          type="text" 
          placeholder="Search brands..."
          value={brandSearchTerm}
          onChange={e => setBrandSearchTerm(e.target.value)}
          className="w-full mb-2 px-2 py-1 border rounded"
        />
        {brands.filter(brand => brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())).map(brand => (
          <label key={brand.id} className="block">
            <input 
              type="checkbox" 
              checked={selectedBrands.includes(brand.id)}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedBrands([...selectedBrands, brand.id]);
                } else {
                  setSelectedBrands(selectedBrands.filter(id => id !== brand.id));
                }
              }}
            />
            <span className="ml-2">{brand.name}</span>
          </label>
        ))}
      </div>
      {/* Gender Filter */}
      <div>
        <div className="font-bold mt-4 mb-2">Gender</div>
        {Object.values(ProductGenderType).map(gender => (
          <label key={gender} className="block">
            <input 
              type="checkbox" 
              checked={selectedGenders.includes(gender)}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedGenders([...selectedGenders, gender]);
                } else {
                  setSelectedGenders(selectedGenders.filter(g => g !== gender));
                }
              }}
            />
            <span className="ml-2">{gender}</span>
          </label>
        ))}
      </div>
      {/* Frame Type Filter */}
      <div>
        <div className="font-bold mt-4 mb-2">Frame Type</div>
        {Object.values(FrameType).map(type => (
          <label key={type} className="block">
            <input 
              type="checkbox" 
              checked={selectedFrameTypes.includes(type)}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedFrameTypes([...selectedFrameTypes, type]);
                } else {
                  setSelectedFrameTypes(selectedFrameTypes.filter(t => t !== type));
                }
              }}
            />
            <span className="ml-2">{type}</span>
          </label>
        ))}
      </div>
      {/* ...add more filter sections as needed... */}
    </div>
  );
};

export default ProductFilterSidebar;
