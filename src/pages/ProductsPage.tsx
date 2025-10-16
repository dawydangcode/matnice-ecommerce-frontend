import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useWishlistStore } from '../stores/wishlist.store';
import { useAuthStore } from '../stores/auth.store';
import { toastService } from '../services/toast.service';
import { ProductCard } from '../types/product-card.types';
import { 
  FrameType, 
  FrameShapeType, 
  FrameMaterialType, 
  FrameBridgeDesignType, 
  FrameStyleType,
  ProductGenderType 
} from '../types/product.types';
import { BrandData, brandService } from '../services/brand.service';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import HeroContent from '../components/HeroContent';
import FilterSection from '../components/FilterSection';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getHeroContent } from '../data/hero-content';
import GlassWidthSmall from '../components/icons/GlassWidth/GlassWidthSmall';
import GlassWidthMedium from '../components/icons/GlassWidth/GlassWidthMedium';
import GlassWidthLarge from '../components/icons/GlassWidth/GlassWidthLarge';
import NoseBridgeSmall from '../components/icons/NoseBridge/NoseBridgeSmall';
import NoseBridgeMedium from '../components/icons/NoseBridge/NoseBridgeMedium';
import NoseBridgeLarge from '../components/icons/NoseBridge/NoseBridgeLarge';
import ShapeRoundIcon from '../components/icons/Shape/Round';
import ShapeSquareIcon from '../components/icons/Shape/Square';
import ShapeRectangleIcon from '../components/icons/Shape/Rectangle';
import ShapeBrowlineIcon from '../components/icons/Shape/Browline';
import ShapeButterflyIcon from '../components/icons/Shape/Butterfly';
import ShapeAviatorIcon from '../components/icons/Shape/Aviator';
import ShapeNarrowIcon from '../components/icons/Shape/Narrow';
import ShapeOvalIcon from '../components/icons/Shape/Oval';
import FullRimIcon from '../components/icons/FrameType/FullRim';
import HalfRimIcon from '../components/icons/FrameType/HalfRim';
import RimlessIcon from '../components/icons/FrameType/RimLess';
import KeyHoleIcon from '../components/icons/BridgeDesign/KeyHole';
import WithNosePadsIcon from '../components/icons/BridgeDesign/WithNosePads';
import WithoutNosePadsIcon from '../components/icons/BridgeDesign/WithoutNosePads';
import productCardService from '../services/product-card.service';
import { formatVND } from '../utils/currency';
import '../styles/product-page.css';
import '../styles/filter-section.css';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { category } = useParams<{ category: string }>();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  // Auto scroll to top when location changes (when navigating from HomePage categories)
  useScrollToTop();
  
  // Wishlist store
  const { addToWishlist, removeFromWishlist, removeItemByProductId, isItemInWishlist, fetchWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  
  // Products state - using ProductCard instead of Product
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Filter states
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<ProductGenderType[]>([]);
  const [selectedFrameTypes, setSelectedFrameTypes] = useState<FrameType[]>([]);
  const [selectedFrameShapes, setSelectedFrameShapes] = useState<FrameShapeType[]>([]);
  const [selectedFrameMaterials, setSelectedFrameMaterials] = useState<FrameMaterialType[]>([]);
  const [selectedBridgeDesigns, setSelectedBridgeDesigns] = useState<FrameBridgeDesignType[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<FrameStyleType[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  // Glasses Width filter: 'small' | 'medium' | 'large'
  const [selectedGlassesWidths, setSelectedGlassesWidths] = useState<string[]>([]);
  // Multifocal lens option filter
  const [isMultifocalSelected, setIsMultifocalSelected] = useState<boolean>(false);

  // Determine product type from URL
  const productType = searchParams.get('type') || category || 
                     (location.pathname.includes('/sunglasses') ? 'sunglasses' : 
                      location.pathname.includes('/contact-lenses') ? 'contact-lenses' : 'glasses');
  
  // Get dynamic hero content based on URL params
  const heroContent = getHeroContent(productType as 'glasses' | 'sunglasses' | 'contact-lenses', searchParams);

  // Create stable dependencies for useEffect
  const minPrice = useMemo(() => priceRange[0], [priceRange]);
  const maxPrice = useMemo(() => priceRange[1], [priceRange]);

  

const shapeIcons: Record<FrameShapeType, React.ReactNode> = {
  [FrameShapeType.ROUND]: <ShapeRoundIcon size={40}/>,
  [FrameShapeType.SQUARE]: <ShapeSquareIcon size={40}/>,
  [FrameShapeType.RECTANGLE]: <ShapeRectangleIcon size={40}/>,
  [FrameShapeType.BROWLINE]: <ShapeBrowlineIcon size={40}/>,
  [FrameShapeType.BUTTERFLY]: <ShapeButterflyIcon size={40}/>,
  [FrameShapeType.AVIATOR]: <ShapeAviatorIcon size={40}/>,
  [FrameShapeType.NARROW]: <ShapeNarrowIcon size={40}/>,
  [FrameShapeType.OVAL]: <ShapeOvalIcon size={40}/>,
};

const frameTypes: Record<FrameType, React.ReactNode> = {
  [FrameType.FULL_RIM]: <FullRimIcon size={40} />,
  [FrameType.HALF_RIM]: <HalfRimIcon size={40} />,
  [FrameType.RIMLESS]: <RimlessIcon size={40} />,
};

const bridgeDesigns: Record<FrameBridgeDesignType, React.ReactNode> = {
  [FrameBridgeDesignType.WITH_KEYHOLE_BRIDGE]: <KeyHoleIcon size={40} />,
  [FrameBridgeDesignType.WITH_NOSE_PADS]: <WithNosePadsIcon size={40} />,
  [FrameBridgeDesignType.WITHOUT_NOSE_PADS]: <WithoutNosePadsIcon size={40} />,
};

  // Fetch brands for filter on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await brandService.getBrandsForFilter();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  // Auto-apply filters based on URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category')?.toLowerCase();
    
    // Auto-select gender filter based on category
    if (categoryParam === 'womens-glasses' || categoryParam === 'women-s-glasses') {
      setSelectedGenders([ProductGenderType.FEMALE]);
    } else if (categoryParam === 'mens-glasses' || categoryParam === 'men-s-glasses') {
      setSelectedGenders([ProductGenderType.MALE]);
    } else if (categoryParam === 'all-glasses') {
      // Clear gender filters for all glasses
      setSelectedGenders([]);
    }
    
    // Handle shape filters
    const shapeParam = searchParams.get('shop_by_shape')?.toLowerCase();
    if (shapeParam === 'round') {
      setSelectedFrameShapes([FrameShapeType.ROUND]);
    } else if (shapeParam === 'square') {
      setSelectedFrameShapes([FrameShapeType.SQUARE]);
    } else if (shapeParam === 'rectangle') {
      setSelectedFrameShapes([FrameShapeType.RECTANGLE]);
    } else if (shapeParam === 'aviator') {
      setSelectedFrameShapes([FrameShapeType.AVIATOR]);
    }
    
    // Handle varifocal category - auto-select multifocal
    if (categoryParam === 'varifocals') {
      setIsMultifocalSelected(true);
    } else {
      setIsMultifocalSelected(false);
    }
    
    // You can add more parameter handling here for other filters
  }, [searchParams]);

  // Determine which filter sections to show/hide
  const currentCategoryParam = searchParams.get('category')?.toLowerCase();
  const shouldHideGenderFilter = currentCategoryParam === 'womens-glasses' || 
                                 currentCategoryParam === 'women-s-glasses' ||
                                 currentCategoryParam === 'mens-glasses' || 
                                 currentCategoryParam === 'men-s-glasses';
  const shouldHideLensOptions = currentCategoryParam === 'varifocals';

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return brands;
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [brands, brandSearchTerm]);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Add a small delay to prevent rapid successive calls from StrictMode
        await new Promise(resolve => setTimeout(resolve, 50));

        // Map sort options to backend API format
        let backendSortBy: 'price' | 'name' | 'newest' = 'newest';
        let sortOrder: 'ASC' | 'DESC' = 'DESC';

        switch (sortBy) {
          case 'price-low':
            backendSortBy = 'price';
            sortOrder = 'ASC';
            break;
          case 'price-high':
            backendSortBy = 'price';
            sortOrder = 'DESC';
            break;
          case 'name':
            backendSortBy = 'name';
            sortOrder = 'ASC';
            break;
          case 'newest':
          default:
            backendSortBy = 'newest';
            sortOrder = 'DESC';
            break;
        }

        // Glasses Width filter logic
        let frameWidth: [number, number] | undefined = undefined;
        if (selectedGlassesWidths.length > 0) {
          let min = Infinity, max = -Infinity;
          if (selectedGlassesWidths.includes('small')) {
            min = Math.min(min, 0);
            max = Math.max(max, 129.99);
          }
          if (selectedGlassesWidths.includes('medium')) {
            min = Math.min(min, 130);
            max = Math.max(max, 140);
          }
          if (selectedGlassesWidths.includes('large')) {
            min = Math.min(min, 140.01);
            max = Math.max(max, 9999);
          }
          if (min !== Infinity && max !== -Infinity) {
            frameWidth = [min, max];
          }
        }

        const response = await productCardService.getProductCards({
          page: currentPage,
          limit: pageSize,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 1000000 ? maxPrice : undefined,
          sortBy: backendSortBy,
          sortOrder: sortOrder,
          productType: productType,
          brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
          gender: selectedGenders.length > 0 ? selectedGenders : undefined,
          frameType: selectedFrameTypes.length > 0 ? selectedFrameTypes.map(f => f.toLowerCase()) : undefined,
          frameShape: selectedFrameShapes.length > 0 ? selectedFrameShapes.map(f => f.toLowerCase()) : undefined,
          frameMaterial: selectedFrameMaterials.length > 0 ? selectedFrameMaterials.map(f => f.toLowerCase()) : undefined,
          bridgeDesign: selectedBridgeDesigns.length > 0 ? selectedBridgeDesigns.map(f => f.toLowerCase()) : undefined,
          style: selectedStyles.length > 0 ? selectedStyles.map(f => f.toLowerCase()) : undefined,
          frameWidth,
          multifocal: isMultifocalSelected ? true : undefined,
        });
        
        console.log('[ProductsPage] Filter params:', { 
          productType,
          selectedBrands,
          selectedGenders,
          currentPage,
          pageSize
        });
        console.log('[ProductsPage] API Response:', {
          dataLength: response.data?.length,
          total: response.total
        });
        
        // Deduplicate products by ID to prevent React key conflicts
        const uniqueProducts = response.data ? response.data.filter((product, index, array) => 
          array.findIndex(p => p.id === product.id) === index
        ) : [];
        
        console.log('[ProductsPage] After dedup:', uniqueProducts.length, 'unique products');
        console.log('[ProductsPage] Setting total to:', response.total || 0);
        
        setProducts(uniqueProducts);
        
        // Fix for incorrect total count when filtering
        const apiTotal = response.total || 0;
        const actualCount = uniqueProducts.length;
        
        // Check if we have any active filters
        const hasActiveFilters = (productType && productType !== 'all' && productType !== '') ||
                                selectedBrands.length > 0 ||
                                selectedGenders.length > 0 ||
                                selectedFrameTypes.length > 0 ||
                                selectedFrameShapes.length > 0 ||
                                selectedFrameMaterials.length > 0 ||
                                selectedBridgeDesigns.length > 0 ||
                                selectedStyles.length > 0 ||
                                selectedGlassesWidths.length > 0 ||
                                isMultifocalSelected ||
                                minPrice > 0 ||
                                maxPrice < 1000000;
        
        if (hasActiveFilters && currentPage === 1 && actualCount < pageSize && actualCount < apiTotal) {
          // If we have filters, we're on page 1, got less than page size, 
          // and actual count is less than API total, use actual count
          console.log('[ProductsPage] Correcting total count for filtered results');
          console.log('[ProductsPage] API total:', apiTotal, '→ Actual total:', actualCount);
          setTotal(actualCount);
        } else {
          setTotal(apiTotal);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, minPrice, maxPrice, sortBy, selectedBrands, selectedGenders, selectedFrameTypes, selectedFrameShapes, selectedFrameMaterials, selectedBridgeDesigns, selectedStyles, selectedGlassesWidths, isMultifocalSelected, productType]);

  // Helper function to get selected filter labels
  const getSelectedFilters = () => {
    const filters = [];
    
    // Gender filters
    selectedGenders.forEach(gender => {
      const label = gender === ProductGenderType.MALE ? 'Men' : 
                   gender === ProductGenderType.FEMALE ? 'Women' : 'Unisex';
      filters.push({ type: 'gender', value: gender, label, remove: () => setSelectedGenders(prev => prev.filter(g => g !== gender)) });
    });

    // Frame type filters
    selectedFrameTypes.forEach(type => {
      const label = type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
      filters.push({ type: 'frameType', value: type, label: `Frame: ${label}`, remove: () => setSelectedFrameTypes(prev => prev.filter(t => t !== type)) });
    });

    // Frame shape filters
    selectedFrameShapes.forEach(shape => {
      const shapeLabels: { [key: string]: string } = {
        'round': 'Round',
        'square': 'Square',
        'rectangular': 'Rectangle',
        'cat-eye': 'Butterfly / Cat Eye',
        'butterfly': 'Butterfly',
        'aviator': 'Aviator',
        'narrow': 'Narrow',
        'oval': 'Oval',
        'browline': 'Browline'
      };
      const label = `Shape: ${shapeLabels[shape as string] || shape.charAt(0).toUpperCase() + shape.slice(1).replace(/-/g, ' ')}`;
      filters.push({ type: 'frameShape', value: shape, label, remove: () => setSelectedFrameShapes(prev => prev.filter(s => s !== shape)) });
    });

    // Frame material filters
    selectedFrameMaterials.forEach(material => {
      const label = `Material: ${material.charAt(0).toUpperCase() + material.slice(1)}`;
      filters.push({ type: 'frameMaterial', value: material, label, remove: () => setSelectedFrameMaterials(prev => prev.filter(m => m !== material)) });
    });

    // Bridge design filters
    selectedBridgeDesigns.forEach(design => {
      const label = `Bridge: ${design.replace(/_/g, ' ').charAt(0).toUpperCase() + design.replace(/_/g, ' ').slice(1)}`;
      filters.push({ type: 'bridgeDesign', value: design, label, remove: () => setSelectedBridgeDesigns(prev => prev.filter(d => d !== design)) });
    });

    // Style filters
    selectedStyles.forEach(style => {
      const label = `Style: ${style}`;
      filters.push({ type: 'style', value: style, label, remove: () => setSelectedStyles(prev => prev.filter(s => s !== style)) });
    });

    // Glass width filters
    selectedGlassesWidths.forEach(width => {
      const label = `Glasses width: ${width.charAt(0).toUpperCase() + width.slice(1)}`;
      filters.push({ type: 'glassWidth', value: width, label, remove: () => setSelectedGlassesWidths(prev => prev.filter(w => w !== width)) });
    });

    // Brand filters
    selectedBrands.forEach(brandId => {
      const brand = brands.find(b => b.id === brandId);
      if (brand) {
        filters.push({ type: 'brand', value: brandId, label: brand.name, remove: () => setSelectedBrands(prev => prev.filter(id => id !== brandId)) });
      }
    });

    // Multifocal filter
    if (isMultifocalSelected) {
      filters.push({ type: 'multifocal', value: 'true', label: 'Multifocal', remove: () => setIsMultifocalSelected(false) });
    }

    return filters;
  };

  const selectedFilters = getSelectedFilters();

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 1000000]);
    setCurrentPage(1);
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedFrameTypes([]);
    setSelectedFrameShapes([]);
    setSelectedFrameMaterials([]);
    setSelectedBridgeDesigns([]);
    setSelectedStyles([]);
    setBrandSearchTerm('');
    setSelectedGlassesWidths([]);
    setIsMultifocalSelected(false);
  };

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedBrands, selectedGenders, selectedFrameTypes, selectedFrameShapes, selectedFrameMaterials, selectedBridgeDesigns, selectedStyles, priceRange, selectedGlassesWidths, isMultifocalSelected]);

  // Fetch wishlist when user is available (on mount and when user changes)
  useEffect(() => {
    console.log('[ProductsPage] Wishlist useEffect triggered, user:', user?.email);
    if (user) {
      console.log('[ProductsPage] Fetching wishlist...');
      fetchWishlist()
        .then(() => {
          console.log('[ProductsPage] Wishlist fetched successfully');
        })
        .catch(error => {
          console.error('[ProductsPage] Error fetching wishlist:', error);
        });
    } else {
      console.log('[ProductsPage] No user, skipping wishlist fetch');
    }
  }, [user, fetchWishlist]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        <Header />
        <Navigation />
      </header>

      {/* Hero Content */}
      <HeroContent
        title={heroContent.title}
        description={heroContent.description}
        heroImage={heroContent.heroImage}
        backgroundColor={heroContent.backgroundColor}
      />

      {/* Main Content Area */}
      <section className="py-8">
        <div className="max-w-full mx-auto px-6">
          {/* Desktop Grid Layout (≥1024px) */}
          <div className="product-listing-grid lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            
            {/* Left Sidebar - Filters */}
            <div className={`filter-area ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">                                                                                                                                                                                                                                                                                          
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-5 pl-2">
                  <h2 className="filter-header">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="lg:hidden text-gray-600 hover:text-black text-xl"
                  >
                    ×
                  </button>
                </div>
                
                {/* Recommendations Section */}
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
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                      <span className="text-gray-400">—</span>
                      <input 
                        type="number" 
                        placeholder="62 mm" 
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <div className="px-1">
                      <input
                        type="range"
                        min="20"
                        max="62"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Rather narrow</span>
                      </label>
                      <NoseBridgeSmall className="text-black-400 ml-3 mt-3" size={40} />
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 mt-3 text-sm text-gray-700">Rather medium</span>
                      </label>
                      <NoseBridgeMedium className="text-black-400 ml-3 mt-3" size={40} />
                    </div>
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
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
                      '< 50 $',
                      '50 $ to 100 $', 
                      '100 $ to 150 $',
                      '150 $ to 200 $',
                      '> 200 $'
                    ].map((price) => (
                      <label key={price} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <input type="checkbox" className="filter-checkbox" />
                        <span className="ml-3 text-sm text-gray-600 font-medium">{price}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

              </div>
            </div>

            {/* Right Content - Products List Area */}
            <div className="product-list-area lg:col-start-2 lg:col-end-3">
              
              {/* Results Count and Sort Options */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="product-total-count">
                    {total} Results
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Filters
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="newest">Most popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Selected Filters */}
              {selectedFilters.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedFilters.map((filter, index) => (
                      <div
                        key={`${filter.type}-${filter.value}-${index}`}
                        className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{filter.label}</span>
                        <button
                          onClick={filter.remove}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          aria-label={`Remove ${filter.label} filter`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18v-6h6v6h-6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                  <button 
                    onClick={clearAllFilters}
                    className="bg-black-600 text-white px-4 py-2 rounded-md hover:bg-black-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                      const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
                      
                      return (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        className="group cursor-pointer bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow block"
                      >
                        <div className="relative rounded-lg mb-6 overflow-hidden h-96 flex items-center justify-center">
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-row space-x-2 z-10">
                            {!!product.isNew && (
                              <div className="bg-white text-green-700 px-3 py-1 text-xs font-medium">
                                New
                              </div>
                            )}
                            {!!product.isBoutique && (
                              <div className="bg-gray-800 text-white px-3 py-1 text-xs font-medium">
                                Boutique
                              </div>
                            )}
                            {!!product.isSustainable && (
                              <div className="sustainable-badge px-3 py-1 text-xs font-medium">
                                Sustainable
                              </div>
                            )}
                          </div>
                          
                          {/* Heart Icon */}
                          <div className="absolute top-2 right-4 z-10">
                            <button 
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                if (!user) {
                                  toastService.warning('Please login to add items to wishlist');
                                  return;
                                }

                                const currentIsInWishlist = isItemInWishlist('product', productId);

                                try {
                                  console.log('[ProductsPage] Heart clicked for product:', productId, 'Current wishlist status:', currentIsInWishlist);
                                  
                                  if (currentIsInWishlist) {
                                    await removeItemByProductId('product', productId);
                                    toastService.success('Removed from wishlist');
                                  } else {
                                    await addToWishlist('product', productId);
                                    toastService.success('Added to wishlist successfully!');
                                  }
                                } catch (error) {
                                  console.error('Failed to update wishlist:', error);
                                  toastService.error('Failed to update wishlist. Please try again.');
                                }
                              }}
                            >
                              <Heart 
                                className={`w-5 h-5 transition-colors ${
                                  isItemInWishlist('product', productId)
                                    ? 'text-red-500 fill-red-500' 
                                    : 'text-gray-400 hover:text-red-500'
                                }`} 
                              />
                            </button>
                          </div>
                          
                          {/* Product Image - using thumbnail from backend */}
                          <img 
                            src={product.thumbnailUrl || "/api/placeholder/400/320"}
                            alt={`${product.brandName} ${product.displayName}`}
                            className="w-full h-full max-w-[350px] max-h-[350px] object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/api/placeholder/400/320";
                            }}
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="space-y-4 p-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 text-secondary">{product.brandName}</h3>
                            <p className="text-base font-light text-secondary">{product.displayName}</p>
                          </div>
                          
                          {product.totalVariants > 1 && (
                            <p className="text-sm text-gray-500">{product.totalVariants} variants available</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-light text-secondary">Frame price without lenses</p>
                              <span className="text-right text-base font-bold text-primary">
                                {formatVND(product.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                    })}
                  </div>

                  {/* Pagination */}
                  {total > pageSize && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-black-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button 
                          onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                          disabled={currentPage >= Math.ceil(total / pageSize)}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* Footer - Same as HomePage */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MATNICE EYEWEAR</h3>
              <p className="text-gray-400">
                Your premier destination for stylish glasses and sunglasses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/glasses" className="hover:text-white">Glasses</Link></li>
                <li><Link to="/sunglasses" className="hover:text-white">Sunglasses</Link></li>
                <li><Link to="/contact-lenses" className="hover:text-white">Contact Lenses</Link></li>
                <li><Link to="/brands" className="hover:text-white">Brands</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/size-guide" className="hover:text-white">Size Guide</Link></li>
                <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MATNICE EYEWEAR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
