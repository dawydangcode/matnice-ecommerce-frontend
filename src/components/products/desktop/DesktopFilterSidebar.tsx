import React from 'react';
import { Search } from 'lucide-react';
import FilterSection from '../../FilterSection';
import GlassWidthSmall from '../../icons/GlassWidth/GlassWidthSmall';
import GlassWidthMedium from '../../icons/GlassWidth/GlassWidthMedium';
import GlassWidthLarge from '../../icons/GlassWidth/GlassWidthLarge';
import NoseBridgeSmall from '../../icons/NoseBridge/NoseBridgeSmall';
import NoseBridgeMedium from '../../icons/NoseBridge/NoseBridgeMedium';
import NoseBridgeLarge from '../../icons/NoseBridge/NoseBridgeLarge';
import { authService } from '../../../services/auth.service';
import { 
  FrameType, 
  FrameShapeType, 
  FrameMaterialType,
  FrameBridgeDesignType,
  FrameStyleType,
  ProductGenderType 
} from '../../../types/product.types';
import { BrandData } from '../../../services/brand.service';
import { shapeIcons, frameTypes, bridgeDesigns } from '../FilterIcons';

interface DesktopFilterSidebarProps {
  // Gender filter
  shouldHideGenderFilter: boolean;
  selectedGenders: ProductGenderType[];
  setSelectedGenders: (genders: ProductGenderType[]) => void;
  // Glasses width
  selectedGlassesWidths: string[];
  setSelectedGlassesWidths: (widths: string[]) => void;
  // Glass width range
  minGlassWidth: number;
  setMinGlassWidth: (width: number) => void;
  maxGlassWidth: number;
  setMaxGlassWidth: (width: number) => void;
  // Frame filters
  selectedFrameShapes: FrameShapeType[];
  setSelectedFrameShapes: (shapes: FrameShapeType[]) => void;
  selectedFrameTypes: FrameType[];
  setSelectedFrameTypes: (types: FrameType[]) => void;
  selectedFrameMaterials: FrameMaterialType[];
  setSelectedFrameMaterials: (materials: FrameMaterialType[]) => void;
  selectedBridgeDesigns: FrameBridgeDesignType[];
  setSelectedBridgeDesigns: (designs: FrameBridgeDesignType[]) => void;
  selectedStyles: FrameStyleType[];
  setSelectedStyles: (styles: FrameStyleType[]) => void;
  // Brand filter
  brandSearchTerm: string;
  setBrandSearchTerm: (term: string) => void;
  filteredBrands: BrandData[];
  selectedBrands: number[];
  setSelectedBrands: (brands: number[]) => void;
  // Lens options
  shouldHideLensOptions: boolean;
  isMultifocalSelected: boolean;
  setIsMultifocalSelected: (selected: boolean) => void;
  // Nose Bridge filter
  selectedNoseBridges: string[];
  setSelectedNoseBridges: (bridges: string[]) => void;
  // Price range filter
  selectedPriceRanges: string[];
  setSelectedPriceRanges: (ranges: string[]) => void;
}

const DesktopFilterSidebar: React.FC<DesktopFilterSidebarProps> = ({
  shouldHideGenderFilter,
  selectedGenders,
  setSelectedGenders,
  selectedGlassesWidths,
  setSelectedGlassesWidths,
  minGlassWidth,
  setMinGlassWidth,
  maxGlassWidth,
  setMaxGlassWidth,
  selectedFrameShapes,
  setSelectedFrameShapes,
  selectedFrameTypes,
  setSelectedFrameTypes,
  selectedFrameMaterials,
  setSelectedFrameMaterials,
  selectedBridgeDesigns,
  setSelectedBridgeDesigns,
  selectedStyles,
  setSelectedStyles,
  brandSearchTerm,
  setBrandSearchTerm,
  filteredBrands,
  selectedBrands,
  setSelectedBrands,
  shouldHideLensOptions,
  isMultifocalSelected,
  setIsMultifocalSelected,
  selectedNoseBridges,
  setSelectedNoseBridges,
  selectedPriceRanges,
  setSelectedPriceRanges
}) => {
  return (
    <div className="filter-area hidden lg:block">
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-5 pl-2">
          <h2 className="filter-header">Filters</h2>
        </div>
        
        {/* Recommendations Section - Only show if not logged in */}
        {!authService.isLoggedIn() && (
          <FilterSection title="RECOMMENDATIONS FOR YOU">
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input type="checkbox" className="mt-1 filter-checkbox" />
                <span className="text-sm text-gray-700">Your recommended glasses width</span>
              </label>
              <div className="bg-gray-200 p-3 rounded-lg border border-gray-100">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gray-100 text-black-600 flex items-center justify-center mt-1 text-xs font-medium">
                    i
                  </div>
                  <div className="text-[14px] text-black-700">
                    Do you already own a pair of our glasses? Log in now and filter glasses in your size.
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black-600 hover:bg-gray-50 transition-colors">
                  Log in now
                </button>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Glasses For - Hide if specific gender is already selected from category */}
        {!shouldHideGenderFilter && (
          <FilterSection title="GLASSES FOR">
            <div className="space-y-3">
              {Object.values(ProductGenderType).map((gender) => (
                <label key={gender} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox"
                    checked={selectedGenders.includes(gender)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGenders([...selectedGenders, gender]);
                      } else {
                        setSelectedGenders(selectedGenders.filter(g => g !== gender));
                      }
                    }}
                  />
                  <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                    {gender === ProductGenderType.MALE ? 'Men' : 
                     gender === ProductGenderType.FEMALE ? 'Women' : 
                     'Unisex'}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Glasses Width */}
        <FilterSection title="GLASSES WIDTH">
          <div className="space-y-3">
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={selectedGlassesWidths.includes('small')}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedGlassesWidths([...selectedGlassesWidths, 'small']);
                    } else {
                      setSelectedGlassesWidths(selectedGlassesWidths.filter(w => w !== 'small'));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">Small</span>
              </label>
              <GlassWidthSmall className="text-black-400" size={40} />
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={selectedGlassesWidths.includes('medium')}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedGlassesWidths([...selectedGlassesWidths, 'medium']);
                    } else {
                      setSelectedGlassesWidths(selectedGlassesWidths.filter(w => w !== 'medium'));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">Medium</span>
              </label>
              <GlassWidthMedium className="text-black-400" size={40} />
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={selectedGlassesWidths.includes('large')}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedGlassesWidths([...selectedGlassesWidths, 'large']);
                    } else {
                      setSelectedGlassesWidths(selectedGlassesWidths.filter(w => w !== 'large'));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">Large</span>
              </label>
              <GlassWidthLarge className="text-black-400" size={40} />
            </div>
          </div>
        </FilterSection>

        {/* Glass Width Range */}
        <FilterSection title="GLASS WIDTH">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input 
                type="number" 
                placeholder="20 mm"
                value={minGlassWidth || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 20;
                  setMinGlassWidth(Math.min(value, maxGlassWidth - 1));
                }}
                min="20"
                max="62"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <span className="text-gray-400">—</span>
              <input 
                type="number" 
                placeholder="62 mm"
                value={maxGlassWidth || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 62;
                  setMaxGlassWidth(Math.max(value, minGlassWidth + 1));
                }}
                min="20"
                max="62"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="px-1 relative" style={{ height: '20px' }}>
              {/* Track background */}
              <div className="absolute w-full h-2 bg-gray-200 rounded-lg" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                {/* Active range highlight */}
                <div 
                  className="absolute h-full bg-gray-400 rounded-lg"
                  style={{
                    left: `${((minGlassWidth - 20) / (62 - 20)) * 100}%`,
                    width: `${((maxGlassWidth - minGlassWidth) / (62 - 20)) * 100}%`
                  }}
                />
              </div>
              {/* Min slider */}
              <input
                type="range"
                min="20"
                max="62"
                value={minGlassWidth}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMinGlassWidth(Math.min(value, maxGlassWidth - 1));
                }}
                className="absolute w-full appearance-none bg-transparent cursor-pointer pointer-events-auto"
                style={{ 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  zIndex: minGlassWidth > maxGlassWidth - 5 ? 5 : 3,
                  height: '20px'
                }}
              />
              {/* Max slider */}
              <input
                type="range"
                min="20"
                max="62"
                value={maxGlassWidth}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMaxGlassWidth(Math.max(value, minGlassWidth + 1));
                }}
                className="absolute w-full appearance-none bg-transparent cursor-pointer pointer-events-auto"
                style={{ 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  zIndex: 4,
                  height: '20px'
                }}
              />
            </div>
          </div>
        </FilterSection>

        {/* Shape */}
        <FilterSection title="SHAPE">
          <div className="grid grid-cols-1 gap-2">
            {Object.values(FrameShapeType).map((shape) => (
              <label key={shape} className="flex items-center justify-between text-xs hover:bg-gray-50 p-2 rounded cursor-pointer">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox"
                    checked={selectedFrameShapes.includes(shape)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFrameShapes([...selectedFrameShapes, shape]);
                      } else {
                        setSelectedFrameShapes(selectedFrameShapes.filter(s => s !== shape));
                      }
                    }}
                  />
                  <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                    {shape.replace('_', ' ')}
                  </span>
                </div>
                <div className="ml-3 mt-3 text-black-400">
                  {shapeIcons[shape]}
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Lens Options - Hide if varifocal category is selected */}
        {!shouldHideLensOptions && (
          <FilterSection title="LENS OPTIONS">
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={isMultifocalSelected}
                  onChange={(e) => {
                    setIsMultifocalSelected(e.target.checked);
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">
                  Available with varifocal lenses
                </span>
              </label>
            </div>
          </FilterSection>
        )}

        {/* Nose Bridge */}
        <FilterSection title="NOSE BRIDGE">
          <div className="space-y-3">
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={selectedNoseBridges.includes('narrow')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNoseBridges([...selectedNoseBridges, 'narrow']);
                    } else {
                      setSelectedNoseBridges(selectedNoseBridges.filter(b => b !== 'narrow'));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">Rather narrow</span>
              </label>
              <NoseBridgeSmall className="text-black-400 ml-3 mt-3" size={40} />
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={selectedNoseBridges.includes('medium')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNoseBridges([...selectedNoseBridges, 'medium']);
                    } else {
                      setSelectedNoseBridges(selectedNoseBridges.filter(b => b !== 'medium'));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">Rather medium</span>
              </label>
              <NoseBridgeMedium className="text-black-400 ml-3 mt-3" size={40} />
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={selectedNoseBridges.includes('wide')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNoseBridges([...selectedNoseBridges, 'wide']);
                    } else {
                      setSelectedNoseBridges(selectedNoseBridges.filter(b => b !== 'wide'));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700">Rather wide</span>
              </label>
              <NoseBridgeLarge className="text-black-400 ml-3 mt-3" size={40} />
            </div>
          </div>
        </FilterSection>

        {/* Frame Type */}
        <FilterSection title="FRAME TYPE">
          <div className="space-y-2">
            {Object.values(FrameType).map((frameType) => (
              <label key={frameType} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox "
                    checked={selectedFrameTypes.includes(frameType)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFrameTypes([...selectedFrameTypes, frameType]);
                      } else {
                        setSelectedFrameTypes(selectedFrameTypes.filter(ft => ft !== frameType));
                      }
                    }}
                  />
                  <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                    {frameType.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="ml-3 mt-3 text-black-400">
                  {frameTypes[frameType]}
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Frame Material */}
        <FilterSection title="FRAME MATERIAL">
          <div className="space-y-2">
            {Object.values(FrameMaterialType).map((material) => (
              <label key={material} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={selectedFrameMaterials.includes(material)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFrameMaterials([...selectedFrameMaterials, material]);
                    } else {
                      setSelectedFrameMaterials(selectedFrameMaterials.filter(m => m !== material));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Bridge Design */}
        <FilterSection title="BRIDGE DESIGN">
          <div className="space-y-2">
            {Object.values(FrameBridgeDesignType).map((bridgeDesign) => (
              <label key={bridgeDesign} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox"
                    checked={selectedBridgeDesigns.includes(bridgeDesign)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBridgeDesigns([...selectedBridgeDesigns, bridgeDesign]);
                      } else {
                        setSelectedBridgeDesigns(selectedBridgeDesigns.filter(bd => bd !== bridgeDesign));
                      }
                    }}
                  />
                  <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                    {bridgeDesign.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="ml-3 mt-3 text-black-400">
                  {bridgeDesigns[bridgeDesign]}
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Style */}
        <FilterSection title="STYLE">
          <div className="space-y-2">
            {Object.values(FrameStyleType).map((style) => (
              <label key={style} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={selectedStyles.includes(style)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStyles([...selectedStyles, style]);
                    } else {
                      setSelectedStyles(selectedStyles.filter(s => s !== style));
                    }
                  }}
                />
                <span className="ml-3 mt-3 text-sm text-gray-700 capitalize">
                  {style}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brand */}
        <FilterSection title="BRAND">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search brands..."
                value={brandSearchTerm}
                onChange={(e) => setBrandSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {filteredBrands.map((brand) => (
                <label key={brand.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand.id]);
                      } else {
                        setSelectedBrands(selectedBrands.filter(id => id !== brand.id));
                      }
                    }}
                  />
                  <span className="ml-3 mt-3 text-sm text-gray-700">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection title="PRICE">
          <div className="space-y-1">
            {[
              '< 1.000.000đ',
              '1.000.000đ - 2.000.000đ', 
              '2.000.000đ - 3.000.000đ',
              '3.000.000đ - 5.000.000đ',
              '> 5.000.000đ'
            ].map((price) => (
              <label key={price} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={selectedPriceRanges.includes(price)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPriceRanges([...selectedPriceRanges, price]);
                    } else {
                      setSelectedPriceRanges(selectedPriceRanges.filter(p => p !== price));
                    }
                  }}
                />
                <span className="ml-3 text-sm text-gray-600 font-medium">{price}</span>
              </label>
            ))}
          </div>
        </FilterSection>

      </div>
    </div>
  );
};

export default DesktopFilterSidebar;
