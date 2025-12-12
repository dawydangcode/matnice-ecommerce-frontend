import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getHeroContent } from '../data/hero-content';
import productCardService from '../services/product-card.service';
import {
  MobileCategoryScroller,
  MobileFilterButtons,
  MobileFilterDrawer,
  DesktopFilterSidebar,
  ProductGrid
} from '../components/products';
import '../styles/product-page.css';
import '../styles/filter-section.css';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { category } = useParams<{ category: string }>();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  // Auto scroll to top when location changes (when navigating from HomePage categories)
  useScrollToTop();
  
  // Wishlist store
  const { addToWishlist, removeItemByProductId, isItemInWishlist, fetchWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
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
  // Glass Width Range filter (in mm)
  const [minGlassWidth, setMinGlassWidth] = useState<number>(20);
  const [maxGlassWidth, setMaxGlassWidth] = useState<number>(62);
  // Multifocal lens option filter
  const [isMultifocalSelected, setIsMultifocalSelected] = useState<boolean>(false);
  // Nose Bridge filter: 'narrow' | 'medium' | 'wide'
  const [selectedNoseBridges, setSelectedNoseBridges] = useState<string[]>([]);
  // Price range filter checkboxes
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // Determine product type from URL
  const productType = searchParams.get('type') || category || 
                     (location.pathname.includes('/sunglasses') ? 'sunglasses' : 
                      location.pathname.includes('/contact-lenses') ? 'contact-lenses' : 'glasses');
  
  // Get dynamic hero content based on URL params
  const heroContent = getHeroContent(productType as 'glasses' | 'sunglasses' | 'contact-lenses', searchParams);

  // Create stable dependencies for useEffect
  const minPrice = useMemo(() => priceRange[0], [priceRange]);
  const maxPrice = useMemo(() => priceRange[1], [priceRange]);

  // Lock body scroll when mobile filter drawer is open
  React.useEffect(() => {
    if (showMobileFilters && activeFilterTab) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters, activeFilterTab]);

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

  // Calculate filter counts for each tab
  const getYourSizeFilterCount = () => {
    return selectedGlassesWidths.length;
  };

  const getFrameFilterCount = () => {
    return selectedFrameTypes.length + selectedFrameMaterials.length + selectedFrameShapes.length;
  };

  const getBrandFilterCount = () => {
    return selectedBrands.length;
  };

  const getPriceFilterCount = () => {
    // Price filters are not stored in state, so we return 0 for now
    // You can add price filter state if needed
    return 0;
  };

  const getLensFilterCount = () => {
    return isMultifocalSelected ? 1 : 0;
  };

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

        // Calculate nose bridge width range based on selected categories
        let bridgeWidthRange: [number, number] | undefined = undefined;
        if (selectedNoseBridges.length > 0) {
          let minBridge = Infinity;
          let maxBridge = -Infinity;
          
          if (selectedNoseBridges.includes('narrow')) {
            minBridge = Math.min(minBridge, 0);
            maxBridge = Math.max(maxBridge, 14.99);
          }
          if (selectedNoseBridges.includes('medium')) {
            minBridge = Math.min(minBridge, 15);
            maxBridge = Math.max(maxBridge, 19);
          }
          if (selectedNoseBridges.includes('wide')) {
            minBridge = Math.min(minBridge, 19.01);
            maxBridge = Math.max(maxBridge, 9999);
          }
          
          if (minBridge !== Infinity && maxBridge !== -Infinity) {
            bridgeWidthRange = [minBridge, maxBridge];
          }
        }

        // Calculate price range based on selected price ranges
        let finalMinPrice = minPrice > 0 ? minPrice : undefined;
        let finalMaxPrice = maxPrice < 1000000 ? maxPrice : undefined;
        
        if (selectedPriceRanges.length > 0) {
          let minPriceFromRanges = Infinity;
          let maxPriceFromRanges = -Infinity;
          
          selectedPriceRanges.forEach(range => {
            if (range === 'Dưới 1.000.000đ') {
              minPriceFromRanges = Math.min(minPriceFromRanges, 0);
              maxPriceFromRanges = Math.max(maxPriceFromRanges, 999999);
            } else if (range === '1.000.000đ - 2.000.000đ') {
              minPriceFromRanges = Math.min(minPriceFromRanges, 1000000);
              maxPriceFromRanges = Math.max(maxPriceFromRanges, 2000000);
            } else if (range === '2.000.000đ - 3.000.000đ') {
              minPriceFromRanges = Math.min(minPriceFromRanges, 2000000);
              maxPriceFromRanges = Math.max(maxPriceFromRanges, 3000000);
            } else if (range === '3.000.000đ - 5.000.000đ') {
              minPriceFromRanges = Math.min(minPriceFromRanges, 3000000);
              maxPriceFromRanges = Math.max(maxPriceFromRanges, 5000000);
            } else if (range === 'Trên 5.000.000đ') {
              minPriceFromRanges = Math.min(minPriceFromRanges, 5000001);
              maxPriceFromRanges = Math.max(maxPriceFromRanges, 999999999);
            }
          });
          
          if (minPriceFromRanges !== Infinity && maxPriceFromRanges !== -Infinity) {
            finalMinPrice = minPriceFromRanges;
            finalMaxPrice = maxPriceFromRanges;
          }
        }

        const response = await productCardService.getProductCards({
          page: currentPage,
          limit: pageSize,
          minPrice: finalMinPrice,
          maxPrice: finalMaxPrice,
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
          bridgeWidth: bridgeWidthRange,
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
  }, [currentPage, pageSize, minPrice, maxPrice, sortBy, selectedBrands, selectedGenders, selectedFrameTypes, selectedFrameShapes, selectedFrameMaterials, selectedBridgeDesigns, selectedStyles, selectedGlassesWidths, isMultifocalSelected, productType, selectedNoseBridges, selectedPriceRanges]);

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
    setSelectedNoseBridges([]);
    setSelectedPriceRanges([]);
  };

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedBrands, selectedGenders, selectedFrameTypes, selectedFrameShapes, selectedFrameMaterials, selectedBridgeDesigns, selectedStyles, priceRange, selectedGlassesWidths, isMultifocalSelected, selectedNoseBridges, selectedPriceRanges]);

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

  // Handle wishlist toggle
  const handleWishlistToggle = async (productId: number, isInWishlist: boolean) => {
    if (!user) {
      toastService.warning('Please login to add items to wishlist');
      return;
    }

    try {
      console.log('[ProductsPage] Heart clicked for product:', productId, 'Current wishlist status:', isInWishlist);
      
      if (isInWishlist) {
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
  };

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

      {/* Mobile Category Scroller */}
      <MobileCategoryScroller productType={productType} />

      {/* Mobile Filter Buttons */}
      <MobileFilterButtons
        onFilterClick={(tab) => {
          setActiveFilterTab(tab);
          setShowMobileFilters(true);
        }}
        filterCounts={{
          yourSize: getYourSizeFilterCount(),
          frame: getFrameFilterCount(),
          brand: getBrandFilterCount(),
          price: getPriceFilterCount(),
          lens: getLensFilterCount()
        }}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={showMobileFilters}
        activeTab={activeFilterTab}
        onClose={() => {
          setShowMobileFilters(false);
          setActiveFilterTab(null);
        }}
        total={total}
        selectedGlassesWidths={selectedGlassesWidths}
        setSelectedGlassesWidths={setSelectedGlassesWidths}
        minGlassWidth={minGlassWidth}
        setMinGlassWidth={setMinGlassWidth}
        maxGlassWidth={maxGlassWidth}
        setMaxGlassWidth={setMaxGlassWidth}
        selectedFrameTypes={selectedFrameTypes}
        setSelectedFrameTypes={setSelectedFrameTypes}
        selectedFrameMaterials={selectedFrameMaterials}
        setSelectedFrameMaterials={setSelectedFrameMaterials}
        selectedFrameShapes={selectedFrameShapes}
        setSelectedFrameShapes={setSelectedFrameShapes}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        brands={brands}
        brandSearchTerm={brandSearchTerm}
        setBrandSearchTerm={setBrandSearchTerm}
        filteredBrands={filteredBrands}
        isMultifocalSelected={isMultifocalSelected}
        setIsMultifocalSelected={setIsMultifocalSelected}
        shouldHideLensOptions={shouldHideLensOptions}
        selectedNoseBridges={selectedNoseBridges}
        setSelectedNoseBridges={setSelectedNoseBridges}
        selectedPriceRanges={selectedPriceRanges}
        setSelectedPriceRanges={setSelectedPriceRanges}
      />

      {/* Main Content Area */}
      <section className="py-8">
        <div className="max-w-full mx-auto px-6">
          {/* Desktop Grid Layout (≥1024px) */}
          <div className="product-listing-grid lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            
            {/* Desktop Filter Sidebar */}
            <DesktopFilterSidebar
              shouldHideGenderFilter={shouldHideGenderFilter}
              selectedGenders={selectedGenders}
              setSelectedGenders={setSelectedGenders}
              selectedGlassesWidths={selectedGlassesWidths}
              setSelectedGlassesWidths={setSelectedGlassesWidths}
              minGlassWidth={minGlassWidth}
              setMinGlassWidth={setMinGlassWidth}
              maxGlassWidth={maxGlassWidth}
              setMaxGlassWidth={setMaxGlassWidth}
              selectedFrameShapes={selectedFrameShapes}
              setSelectedFrameShapes={setSelectedFrameShapes}
              selectedFrameTypes={selectedFrameTypes}
              setSelectedFrameTypes={setSelectedFrameTypes}
              selectedFrameMaterials={selectedFrameMaterials}
              setSelectedFrameMaterials={setSelectedFrameMaterials}
              selectedBridgeDesigns={selectedBridgeDesigns}
              setSelectedBridgeDesigns={setSelectedBridgeDesigns}
              selectedStyles={selectedStyles}
              setSelectedStyles={setSelectedStyles}
              brandSearchTerm={brandSearchTerm}
              setBrandSearchTerm={setBrandSearchTerm}
              filteredBrands={filteredBrands}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              shouldHideLensOptions={shouldHideLensOptions}
              isMultifocalSelected={isMultifocalSelected}
              setIsMultifocalSelected={setIsMultifocalSelected}
              selectedNoseBridges={selectedNoseBridges}
              setSelectedNoseBridges={setSelectedNoseBridges}
              selectedPriceRanges={selectedPriceRanges}
              setSelectedPriceRanges={setSelectedPriceRanges}
            />

            {/* Product Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              total={total}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onClearFilters={clearAllFilters}
              isItemInWishlist={isItemInWishlist}
              onWishlistToggle={handleWishlistToggle}
              user={user}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedFilters={selectedFilters}
            />

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
