import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import productCardService from '../services/product-card.service';
import productService from '../services/productService';
import lensPrescriptionService, { FilteredLens } from '../services/lens-prescription.service';
import lensDetailsService, { LensFullDetails, SelectedLensOptions } from '../services/lens-details.service';
import { localCartService } from '../services/localCart.service';
import { AddLensProductToCartRequest } from '../services/cart.service';
import { ProductCard } from '../types/product-card.types';
import { UserPrescription } from '../services/user-prescription.service';
import SavedPrescriptionSelector from '../components/SavedPrescriptionSelector';
import { brandLensService, categoryLensService, lensThicknessService, BrandLens, CategoryLens, LensThickness } from '../services/brandLens.service';
import '../styles/value-table.css';

// Prescription dropdown values
const SPHERE_VALUES = [
  '-9.00', '-8.75', '-8.50', '-8.25', '-8.00', '-7.75', '-7.50', '-7.25', '-7.00', '-6.75',
  '-6.50', '-6.25', '-6.00', '-5.75', '-5.50', '-5.25', '-5.00', '-4.75', '-4.50', '-4.25',
  '-4.00', '-3.75', '-3.50', '-3.25', '-3.00', '-2.75', '-2.50', '-2.25', '-2.00', '-1.75',
  '-1.50', '-1.25', '-1.00', '-0.75', '-0.50', '-0.25', '± 0.00', '+0.25', '+0.50', '+0.75',
  '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25',
  '+3.50', '+3.75', '+4.00', '+4.25', '+4.50', '+4.75', '+5.00', '+5.25', '+5.50', '+5.75',
  '+6.00', '+6.25', '+6.50', '+6.75', '+7.00', '+7.25', '+7.50', '+7.75', '+8.00'
];

const CYLINDER_VALUES = [
  '-4.00', '-3.75', '-3.50', '-3.25', '-3.00', '-2.75', '-2.50', '-2.25', '-2.00', '-1.75',
  '-1.50', '-1.25', '-1.00', '-0.75', '-0.50', '-0.25', '± 0.00', '+0.25', '+0.50', '+0.75',
  '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25',
  '+3.50', '+3.75', '+4.00'
];

const AXIS_VALUES = Array.from({length: 181}, (_, i) => `${i}°`);

const PD_SINGLE_VALUES = [
  '50.00', '51.00', '52.00', '53.00', '54.00', '55.00', '56.00', '57.00', '58.00', '59.00',
  '60.00', '61.00', '62.00', '63.00', '64.00', '65.00', '66.00', '67.00', '68.00', '69.00',
  '70.00', '71.00', '72.00', '73.00', '74.00', '75.00', '76.00', '77.00', '78.00', '79.00', '80.00'
];

const PD_DUAL_VALUES = [
  '25.00', '25.50', '26.00', '26.50', '27.00', '27.50', '28.00', '28.50', '29.00', '29.50',
  '30.00', '30.50', '31.00', '31.50', '32.00', '32.50', '33.00', '33.50', '34.00', '34.50',
  '35.00', '35.50', '36.00', '36.50', '37.00', '37.50', '38.00', '38.50', '39.00', '39.50', '40.00'
];

const ADD_VALUES = [
  '-', '1.00', '1.25', '1.50', '1.75', '2.00', '2.25', '2.50', '2.75', '3.00'
];

interface LensTypeOption {
  type: string;
  name: string;
  description: string;
}

const lensTypeOptions: LensTypeOption[] = [
  {
    type: 'SINGLE_VISION',
    name: 'Single Vision Lenses',
    description: 'If you need correction for short or long distances.',
  },
  {
    type: 'PROGRESSIVE', 
    name: 'Progressive Lenses',
    description: 'If you need correction for both distance and near vision at the same time.',
  },
  {
    type: 'OFFICE',
    name: 'Office Lenses',
    description: 'If you need correction for intermediate and near vision.',
  },
  {
    type: 'NON_PRESCRIPTION',
    name: 'Non-prescription',
    description: 'To wear as sunglasses or a fashion accessory.',
  },
  {
    type: 'DRIVE_SAFE',
    name: 'Drive Safe Lenses', 
    description: 'If you need correction optimized for driving conditions.',
  }
];

const LensSelectionPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Refs for each step
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  
  const [selectedLensType, setSelectedLensType] = useState<string>('SINGLE_VISION');
  const [availableProducts, setAvailableProducts] = useState<ProductCard[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
  const [selectedColorImageUrl, setSelectedColorImageUrl] = useState<string | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionOption, setPrescriptionOption] = useState<'saved' | 'manual'>('saved');

  const [showPrescriptionStep, setShowPrescriptionStep] = useState(false);
  const [showLensSelectionStep, setShowLensSelectionStep] = useState(false);
  const [showLensOptionsStep, setShowLensOptionsStep] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const [filteredLenses, setFilteredLenses] = useState<FilteredLens[]>([]);
  const [lensesLoading, setLensesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLens, setSelectedLens] = useState<FilteredLens | null>(null);
  const [lensFullDetails, setLensFullDetails] = useState<LensFullDetails | null>(null);
  const [selectedLensOptions, setSelectedLensOptions] = useState<SelectedLensOptions>({
    coatings: []
  });
  const [lensOptionsLoading, setLensOptionsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Date picker modal state
  const [showDateModal, setShowDateModal] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'day' | 'month' | 'year'>('day');
  
  // Lens filter modal state
  const [showLensFilterModal, setShowLensFilterModal] = useState(false);
  const [lensFilterType, setLensFilterType] = useState<'brand' | 'category' | 'thickness' | 'price' | 'sort'>('brand');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedThickness, setSelectedThickness] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');
  
  // Filter options from API
  const [brandLensOptions, setBrandLensOptions] = useState<BrandLens[]>([]);
  const [categoryLensOptions, setCategoryLensOptions] = useState<CategoryLens[]>([]);
  const [lensThicknessOptions, setLensThicknessOptions] = useState<LensThickness[]>([]);
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedThickness('');
    setSelectedPrice('');
    setSelectedSort('');
  };
  
  // Count active filters
  const activeFilterCount = [selectedBrand, selectedCategory, selectedThickness, selectedPrice, selectedSort].filter(Boolean).length;
  
  // Auto-scroll utility function
  const scrollToStep = useCallback((stepNumber: number) => {
    const refs = [step1Ref, step2Ref, step3Ref, step4Ref];
    const targetRef = refs[stepNumber - 1];
    
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  // Handle lens selection (only select, don't move to step 4)
  const handleLensSelect = (lens: FilteredLens) => {
    setSelectedLens(lens);
    // Don't automatically show step 4, wait for user to click continue button
  };

  // Handle continue to lens options (step 4)
  const handleContinueToLensOptions = async () => {
    if (!selectedLens) return;
    
    setShowLensOptionsStep(true);
    
    // Load lens details for step 4
    await loadLensDetails(selectedLens.id);
    
    // Auto-scroll to step 4 after a short delay
    setTimeout(() => scrollToStep(4), 100);
  }; 
  
  // Helper function to get selected color info from product detail
  const getSelectedColorInfo = () => {
    const selectedColorIdParam = searchParams.get('selectedColorId');
    if (selectedProductDetail && selectedColorIdParam) {
      const selectedColor = selectedProductDetail.productColors?.find((color: any) => 
        color.id === parseInt(selectedColorIdParam)
      );
      return selectedColor;
    }
    return null;
  };
  
  // Helper function to get display name with color
  const getDisplayNameWithColor = () => {
    const colorInfo = getSelectedColorInfo();
    if (selectedProductDetail && colorInfo) {
      return `${selectedProductDetail.productName} ${colorInfo.productVariantName}`;
    }
    return selectedProduct?.displayName || '';
  };
  
  // Prescription form state
  const [prescriptionData, setPrescriptionData] = useState({
    sphereR: '± 0.00',
    sphereL: '± 0.00',
    cylinderR: '± 0.00',
    cylinderL: '± 0.00',
    addR: '-',
    addL: '-',
    axisR: '0°',
    axisL: '0°',
    pd: '63.00',
    pdR: '31.50',
    pdL: '31.50',
    hasTwoPD: false,
    prescriptionDate: {
      day: '',
      month: '',
      year: ''
    }
  });

  // Handle when saved prescription is selected
  const handleSavedPrescriptionSelect = useCallback((prescription: UserPrescription) => {
    // Map saved prescription values to form (for when user switches to manual later)
    setPrescriptionData({
      sphereR: Number(prescription.rightEyeSph).toFixed(2),
      sphereL: Number(prescription.leftEyeSph).toFixed(2),
      cylinderR: Number(prescription.rightEyeCyl).toFixed(2),
      cylinderL: Number(prescription.leftEyeCyl).toFixed(2),
      addR: prescription.rightEyeAdd ? Number(prescription.rightEyeAdd).toFixed(2) : '-',
      addL: prescription.leftEyeAdd ? Number(prescription.leftEyeAdd).toFixed(2) : '-',
      axisR: `${prescription.rightEyeAxis}°`,
      axisL: `${prescription.leftEyeAxis}°`,
      pd: (Number(prescription.pdRight) + Number(prescription.pdLeft)).toFixed(2),
      pdR: Number(prescription.pdRight).toFixed(2),
      pdL: Number(prescription.pdLeft).toFixed(2),
      hasTwoPD: true,
      prescriptionDate: {
        day: '',
        month: '',
        year: ''
      }
    });
    
    // Keep in saved mode - user can manually switch to manual if they want to edit
  }, []);

  
  // Load initial product data (glasses/frames)
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const response = await productCardService.getProductCards({
          page: 1,
          limit: 20
        });
        setAvailableProducts(response.data);
        
        // Get productId and selectedColorId from URL params
        const productIdParam = searchParams.get('productId');
        const selectedColorIdParam = searchParams.get('selectedColorId');
        console.log('ProductId from URL:', productIdParam);
        console.log('SelectedColorId from URL:', selectedColorIdParam);
        console.log('Available products:', response.data.map(p => ({ id: p.id, name: p.productName, brand: p.brandName })));
        
        if (productIdParam && response.data.length > 0) {
          // Try to find the product with matching id (convert both to string for comparison)
          const targetProduct = response.data.find(product => 
            String(product.id) === String(productIdParam)
          );
          console.log('Target product found:', targetProduct);
          
          if (targetProduct) {
            setSelectedProduct(targetProduct);
            console.log('Selected product from URL:', targetProduct);
            
            // Load product detail to get color images if selectedColorId is provided
            if (selectedColorIdParam) {
              try {
                const productDetail = await productService.getProductWithDetails(parseInt(productIdParam));
                console.log('Product detail loaded:', productDetail);
                setSelectedProductDetail(productDetail);
                
                // Find image with imageOrder = 'a' for selected color
                const colorImage = productDetail.productImages?.find((img: any) => 
                  img.productColorId === parseInt(selectedColorIdParam) && img.imageOrder === 'a'
                );
                
                if (colorImage) {
                  setSelectedColorImageUrl(colorImage.imageUrl);
                  console.log('Color image found:', colorImage.imageUrl);
                } else {
                  console.log('No color image found for colorId:', selectedColorIdParam);
                }
              } catch (error) {
                console.error('Error loading product detail:', error);
              }
            }
          } else {
            // If product not found in current page, still try to load it by ID
            console.log('Product not found in current page, using first product as fallback');
            console.log('Looking for product ID:', parseInt(productIdParam), 'in available products');
            setSelectedProduct(response.data[0]);
          }
        } else {
          // Select first product as default if no productId in URL
          console.log('No productId in URL or no products available');
          if (response.data.length > 0) {
            setSelectedProduct(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
    
    // Auto-scroll to step 1 when page loads
    setTimeout(() => scrollToStep(1), 500);
  }, [scrollToStep, searchParams]);

  // Load brand lens and category lens options for filters
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [brands, categories, thicknesses] = await Promise.all([
          brandLensService.getBrandsForFilter(),
          categoryLensService.getCategoriesForFilter(),
          lensThicknessService.getThicknessForFilter()
        ]);
        setBrandLensOptions(brands);
        setCategoryLensOptions(categories);
        setLensThicknessOptions(thicknesses);
        console.log('Loaded filter options:', { brands, categories, thicknesses });
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);

  const handleLensTypeSelect = (lensType: string) => {
    setSelectedLensType(lensType);
    // Don't automatically change step, wait for user to click Continue button
  };

  const handleContinueToPrescription = () => {
    setShowPrescriptionStep(true);
    // Auto-scroll to step 2 after a short delay
    setTimeout(() => scrollToStep(2), 100);
  };

  // Helper function to format prescription values for display
  const formatPrescriptionValue = (value: string) => {
    if (!value) return '0.00';
    // Remove 'dpt' suffix and '±' prefix if present
    let cleanValue = value.replace(/dpt$/, '').replace(/^± /, '').trim();
    // If it's '0.00' or empty, show as '0.00'
    if (cleanValue === '0.00' || cleanValue === '' || cleanValue === '± 0.00') return '0.00';
    return cleanValue;
  };

  // Helper function to format axis values
  const formatAxisValue = (value: string) => {
    if (!value) return '0';
    // Remove degree symbol if present
    return value.replace(/°$/, '').trim();
  };

  // Helper function to format PD values
  const formatPDValue = (isRight: boolean) => {
    if (prescriptionData.hasTwoPD) {
      // Use individual PD values
      const value = isRight ? prescriptionData.pdR : prescriptionData.pdL;
      return value || '0.00';
    } else {
      // Split single PD value in half
      const singlePD = prescriptionData.pd;
      if (singlePD) {
        const numValue = parseFloat(singlePD);
        return (numValue / 2).toFixed(2);
      }
      return '0.00';
    }
  };

  const handleContinue = async () => {
    // Prepare prescription data for lens filtering
    const prescriptionParams = {
      lensType: selectedLensType,
      prescriptionOption,
      ...(prescriptionOption === 'manual' && {
        sphereR: prescriptionData.sphereR,
        sphereL: prescriptionData.sphereL,
        cylinderR: prescriptionData.cylinderR,
        cylinderL: prescriptionData.cylinderL,
        axisR: prescriptionData.axisR,
        axisL: prescriptionData.axisL,
        pd: prescriptionData.hasTwoPD ? `${prescriptionData.pdR}/${prescriptionData.pdL}` : prescriptionData.pd,
        ...(needsAddValue() && {
          addR: prescriptionData.addR,
          addL: prescriptionData.addL
        })
      })
    };
    
    console.log('Continue to Lens Selection with params:', prescriptionParams);
    
    // Show step 3: Lens Selection and load filtered lenses
    setShowLensSelectionStep(true);
    await loadFilteredLenses();
    
    // Auto-scroll to step 3 after a short delay
    setTimeout(() => scrollToStep(3), 100);
  };

  // Validation functions
  const isPrescriptionDateValid = () => {
    const { day, month, year } = prescriptionData.prescriptionDate;
    
    if (!day || !month || !year) {
      return false;
    }
    
    const prescriptionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const currentDate = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);
    
    return prescriptionDate >= twoYearsAgo && prescriptionDate <= currentDate;
  };

  const shouldShowDateError = () => {
    const { day, month, year } = prescriptionData.prescriptionDate;
    // Only show error if user has filled all 3 fields AND the date is invalid
    const hasFilledAllFields = day && month && year;
    return hasFilledAllFields && !isPrescriptionDateValid();
  };

  const canContinue = () => {
    if (prescriptionOption === 'saved') {
      return true; // For saved prescription, no additional validation needed
    }
    
    // For manual prescription entry
    return isPrescriptionDateValid() && isCertified;
  };

  const needsAddValue = useCallback(() => {
    return ['PROGRESSIVE', 'OFFICE'].includes(selectedLensType);
  }, [selectedLensType]);

  // Helper function to convert prescription values
  const convertPrescriptionValue = (value: string): number | undefined => {
    if (value === '± 0.00' || value === '-' || !value) return undefined;
    
    // Remove '+' prefix if present and convert to number
    const numericValue = parseFloat(value.replace('+', ''));
    return isNaN(numericValue) ? undefined : numericValue;
  };

  // Function to load filtered lenses based on prescription
  const loadFilteredLenses = useCallback(async () => {
    // Reset selected lens when filtering changes
    console.log('Resetting selected lens and filtering...');
    setSelectedLens(null);
    
    if (prescriptionOption === 'saved') {
      // For saved prescriptions, we would need to get the saved data first
      // For now, just show all lenses
      setLensesLoading(true);
      try {
        const response = await lensPrescriptionService.filterLensesByPrescription({
          page: currentPage,
          limit: 12
        }, selectedLensType);
        setFilteredLenses(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error loading lenses:', error);
        setFilteredLenses([]);
      } finally {
        setLensesLoading(false);
      }
      return;
    }

    // For manual prescription input, filter based on entered values
    setLensesLoading(true);
    try {
      const prescriptionParams = {
        sphereLeft: convertPrescriptionValue(prescriptionData.sphereL),
        sphereRight: convertPrescriptionValue(prescriptionData.sphereR),
        cylinderLeft: convertPrescriptionValue(prescriptionData.cylinderL),
        cylinderRight: convertPrescriptionValue(prescriptionData.cylinderR),
        ...(needsAddValue() && {
          addLeft: convertPrescriptionValue(prescriptionData.addL),
          addRight: convertPrescriptionValue(prescriptionData.addR),
        }),
        page: currentPage,
        limit: 12
      };

      console.log('Filtering lenses with prescription:', prescriptionParams);
      
      const response = await lensPrescriptionService.filterLensesByPrescription(prescriptionParams, selectedLensType);
      setFilteredLenses(response.data);
      setTotalPages(response.meta.totalPages);
      
      console.log(`Found ${response.data.length} compatible lenses`);
    } catch (error) {
      console.error('Error filtering lenses:', error);
      setFilteredLenses([]);
    } finally {
      setLensesLoading(false);
    }
  }, [
    prescriptionOption, 
    prescriptionData.sphereL,
    prescriptionData.sphereR,
    prescriptionData.cylinderL,
    prescriptionData.cylinderR,
    prescriptionData.addL,
    prescriptionData.addR,
    currentPage,
    needsAddValue,
    selectedLensType
  ]);

  // Function to load lens full details for step 4
  const loadLensDetails = useCallback(async (lensId: string) => {
    setLensOptionsLoading(true);
    try {
      const details = await lensDetailsService.getLensFullDetails(lensId);
      setLensFullDetails(details);
      console.log('Loaded lens details:', details);

      // Auto-select first options as defaults
      setSelectedLensOptions({
        variant: details.variants.length > 0 ? details.variants[0] : undefined,
        coatings: details.coatings.length > 0 
          ? [details.coatings[0]] 
          : [],
        tintColor: details.variants.length > 0 && details.variants[0].tintColors.length > 0
          ? details.variants[0].tintColors[0]
          : undefined,
      });
    } catch (error) {
      console.error('Error loading lens details:', error);
      toast.error('Unable to load lens options information');
    } finally {
      setLensOptionsLoading(false);
    }
  }, []);

  // Effect to reload filtered lenses when prescription changes
  useEffect(() => {
    if (showLensSelectionStep && prescriptionOption === 'manual') {
      // Debounce the filtering to avoid too many API calls
      const timeoutId = setTimeout(() => {
        loadFilteredLenses();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [
    prescriptionData.sphereL,
    prescriptionData.sphereR, 
    prescriptionData.cylinderL,
    prescriptionData.cylinderR,
    prescriptionData.addL,
    prescriptionData.addR,
    showLensSelectionStep,
    prescriptionOption,
    loadFilteredLenses
  ]);

  // Effect to reload filtered lenses when page changes
  useEffect(() => {
    if (showLensSelectionStep && currentPage > 1) {
      loadFilteredLenses();
    }
  }, [currentPage, loadFilteredLenses, showLensSelectionStep]);

  // Apply client-side filters to filteredLenses
  const displayedLenses = React.useMemo(() => {
    let result = [...filteredLenses];
    
    // Filter by brand
    if (selectedBrand) {
      result = result.filter(lens => 
        lens.brandLens && String(lens.brandLens.id) === selectedBrand
      );
    }
    
    // Note: categoryLens is not available in FilteredLens type from backend
    // Category filter would need backend support
    
    // Note: thickness filter would need to check variants, which are not in the list
    // Thickness will be applied when user selects a variant in step 4
    
    // Filter by price
    if (selectedPrice) {
      result = result.filter(lens => {
        const maxPrice = lens.priceRange.max;
        switch (selectedPrice) {
          case 'under-1m':
            return maxPrice < 1000000;
          case '1m-2m':
            return maxPrice >= 1000000 && maxPrice <= 2000000;
          case '2m-3m':
            return maxPrice > 2000000 && maxPrice <= 3000000;
          case 'over-3m':
            return maxPrice > 3000000;
          default:
            return true;
        }
      });
    }
    
    // Sort
    if (selectedSort) {
      switch (selectedSort) {
        case 'price-asc':
          result.sort((a, b) => a.priceRange.min - b.priceRange.min);
          break;
        case 'price-desc':
          result.sort((a, b) => b.priceRange.max - a.priceRange.max);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
    }
    
    return result;
  }, [filteredLenses, selectedBrand, selectedPrice, selectedSort]);

  const shouldShowAddWarning = () => {
    if (!needsAddValue()) return false;
    // Show warning if either R or L ADD value is still "-" (not selected)
    return prescriptionData.addR === '-' || prescriptionData.addL === '-';
  };

  const isPrescriptionComplete = () => {
    // Check if required prescription fields are filled
    const requiredFields = [
      prescriptionData.sphereR,
      prescriptionData.sphereL,
    ];

    // Check PD is filled (either single PD or both pdL and pdR)
    const pdComplete = prescriptionData.hasTwoPD 
      ? (prescriptionData.pdL !== '-' && prescriptionData.pdR !== '-')
      : prescriptionData.pd !== '-';

    // Check basic required fields
    const basicFieldsComplete = requiredFields.every(field => field !== '-' && field !== '');

    // For progressive lenses, also check ADD values
    const addFieldsComplete = !needsAddValue() || (prescriptionData.addR !== '-' && prescriptionData.addL !== '-');

    return basicFieldsComplete && pdComplete && addFieldsComplete;
  };

  const getAddBorderColor = (value: string) => {
    // Return red border if value is "-" (not selected), otherwise normal gray border
    return value === '-' ? 'border-red-300' : 'border-gray-300';
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedLens || !selectedLensOptions.variant) {
      alert('Please make sure you have selected product, lens, and lens type');
      return;
    }

    if (!isPrescriptionComplete()) {
      alert('Please complete your prescription information before adding to cart');
      return;
    }

    try {
      setIsAddingToCart(true);

      // Prepare prescription values - convert string to numbers
      const parseValue = (value: string) => {
        console.log('Parsing value:', value);
        if (value === '± 0.00') return 0;
        if (value === '-' || !value) return 0;
        if (value.includes('°')) return parseFloat(value.replace('°', ''));
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Prepare cart data
      const selectedColorIdParam = searchParams.get('selectedColorId');
      const cartData: AddLensProductToCartRequest = {
        cartId: 0, // Will be set by smart add method
        frameData: {
          productId: Number(selectedProduct.id),
          framePrice: selectedProduct.price,
          quantity: 1,
          selectedColorId: selectedColorIdParam ? Number(selectedColorIdParam) : undefined
        },
        lensData: {
          lensVariantId: Number(selectedLensOptions.variant?.id),
          lensPrice: selectedLensOptions.variant ? Number(selectedLensOptions.variant.price) : 0,
          prescriptionValues: {
            rightEyeSphere: parseValue(prescriptionData.sphereR),
            leftEyeSphere: parseValue(prescriptionData.sphereL),
            rightEyeCylinder: parseValue(prescriptionData.cylinderR),
            leftEyeCylinder: parseValue(prescriptionData.cylinderL),
            rightEyeAxis: parseValue(prescriptionData.axisR),
            leftEyeAxis: parseValue(prescriptionData.axisL),
            pdLeft: prescriptionData.hasTwoPD ? parseValue(prescriptionData.pdL) : parseValue(prescriptionData.pd) / 2,
            pdRight: prescriptionData.hasTwoPD ? parseValue(prescriptionData.pdR) : parseValue(prescriptionData.pd) / 2,
            addLeft: parseValue(prescriptionData.addL),
            addRight: parseValue(prescriptionData.addR)
          },
          selectedCoatingIds: selectedLensOptions.coatings.map(coating => Number(coating.id)),
          selectedTintColorId: selectedLensOptions.tintColor ? Number(selectedLensOptions.tintColor.id) : undefined,
          prescriptionNotes: 'From Lens Selection page',
          lensNotes: `Lens Type: ${selectedLensType}`
        }
      };

      console.log('Cart data being sent:', JSON.stringify(cartData, null, 2));
      
      // Get color info for localStorage
      const colorInfo = selectedProductDetail?.productColors?.find((color: any) => 
        color.id === Number(selectedColorIdParam)
      );

      console.log('Color info debug:', {
        selectedColorIdParam,
        selectedColorIdParamNumber: Number(selectedColorIdParam),
        availableColors: selectedProductDetail?.productColors,
        foundColorInfo: colorInfo
      });

      // Use smart add to cart (works for both authenticated and guest users)
      const result = await localCartService.smartAddToCart({
        type: 'lens',
        productId: Number(selectedProduct.id),
        productName: selectedProduct.displayName || selectedProductDetail?.productName,
        productImage: selectedProductDetail?.productImages?.[0]?.imageUrl,
        selectedColorId: selectedColorIdParam ? Number(selectedColorIdParam) : undefined,
        selectedColorName: colorInfo?.colorName || 'Unknown',
        productVariantName: colorInfo?.productVariantName || '',
        framePrice: selectedProduct.price,
        totalPrice: selectedProduct.price + (selectedLensOptions.variant ? Number(selectedLensOptions.variant.price) : 0),
        quantity: 1,
        discount: 0,
        lensDetail: {
          lensPrice: selectedLensOptions.variant ? Number(selectedLensOptions.variant.price) : 0,
          totalUpgradesPrice: 0,
          selectedCoatings: selectedLensOptions.coatings.map(coating => ({
            id: Number(coating.id),
            name: coating.name,
            price: Number(coating.price),
            description: coating.description || ''
          })),
          selectedTintColor: selectedLensOptions.tintColor ? {
            id: Number(selectedLensOptions.tintColor.id),
            name: selectedLensOptions.tintColor.name,
            price: Number(selectedLensOptions.tintColor.price)
          } : null,
          prescription: {
            rightEye: {
              sphere: parseValue(prescriptionData.sphereR),
              cylinder: parseValue(prescriptionData.cylinderR),
              axis: parseValue(prescriptionData.axisR)
            },
            leftEye: {
              sphere: parseValue(prescriptionData.sphereL),
              cylinder: parseValue(prescriptionData.cylinderL),
              axis: parseValue(prescriptionData.axisL)
            },
            pdLeft: prescriptionData.hasTwoPD ? parseValue(prescriptionData.pdL) : parseValue(prescriptionData.pd) / 2,
            pdRight: prescriptionData.hasTwoPD ? parseValue(prescriptionData.pdR) : parseValue(prescriptionData.pd) / 2,
            addLeft: parseValue(prescriptionData.addL),
            addRight: parseValue(prescriptionData.addR)
          }
        },
        lensInfo: selectedLens ? {
          id: selectedLens.id.toString(),
          name: selectedLens.name,
          lensType: selectedLensType,
          description: selectedLens.description || '',
          origin: selectedLens.origin || '',
          image: selectedLens.imageUrl || ''
        } : undefined,
        lensVariantInfo: selectedLensOptions.variant ? {
          id: Number(selectedLensOptions.variant.id),
          design: selectedLensOptions.variant.design || 'NONE',
          material: selectedLensOptions.variant.material || 'POLYCARBONATE',
          price: selectedLensOptions.variant.price.toString(),
          lensThickness: {
            id: Number(selectedLensOptions.variant.lensThickness?.id || 0),
            name: selectedLensOptions.variant.lensThickness?.name || '',
            indexValue: Number(selectedLensOptions.variant.lensThickness?.indexValue || 1.5),
            description: selectedLensOptions.variant.lensThickness?.description || ''
          }
        } : undefined,
        cartData: cartData // Pass full cart data for backend calls
      });
      
      console.log('Added to cart successfully:', result);
      toast.success('Product added to cart successfully!');
      
      // Navigate to cart page after successful addition
      setTimeout(() => {
        navigate('/cart');
      }, 1500); // Give user time to see the success message
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Fallback to local storage if backend fails
      try {
        console.log('Attempting fallback to local storage...');
        
        // Re-define parseValue for fallback
        const parseValueFallback = (value: string) => {
          if (value === '± 0.00') return 0;
          if (value === '-' || !value) return 0;
          if (value.includes('°')) return parseFloat(value.replace('°', ''));
          const parsed = parseFloat(value);
          return isNaN(parsed) ? 0 : parsed;
        };
        
        const framePrice = selectedProduct.price;
        const lensPrice = selectedLensOptions.variant ? Number(selectedLensOptions.variant.price) : 0;
        const totalPrice = framePrice + lensPrice;
        
        const localItem = {
          productId: Number(selectedProduct.id),
          framePrice: framePrice,
          totalPrice: totalPrice,
          quantity: 1,
          selectedColorId: searchParams.get('selectedColorId') ? Number(searchParams.get('selectedColorId')) : undefined,
          type: 'frame' as const,
          discount: 0
        };
        
        const addedItem = localCartService.addFrameToLocalCart(localItem);
        
        // Store lens data separately since addFrameToLocalCart doesn't support it
        const lensData = {
          itemId: addedItem.id,
          lensVariantId: Number(selectedLensOptions.variant?.id),
          prescriptionValues: {
            rightEyeSphere: parseValueFallback(prescriptionData.sphereR),
            leftEyeSphere: parseValueFallback(prescriptionData.sphereL),
            rightEyeCylinder: parseValueFallback(prescriptionData.cylinderR),
            leftEyeCylinder: parseValueFallback(prescriptionData.cylinderL),
            rightEyeAxis: parseValueFallback(prescriptionData.axisR),
            leftEyeAxis: parseValueFallback(prescriptionData.axisL),
            pdLeft: prescriptionData.hasTwoPD ? parseValueFallback(prescriptionData.pdL) : parseValueFallback(prescriptionData.pd) / 2,
            pdRight: prescriptionData.hasTwoPD ? parseValueFallback(prescriptionData.pdR) : parseValueFallback(prescriptionData.pd) / 2,
            addLeft: parseValueFallback(prescriptionData.addL),
            addRight: parseValueFallback(prescriptionData.addR)
          },
          selectedCoatingIds: selectedLensOptions.coatings.map(coating => Number(coating.id)),
          selectedTintColorId: selectedLensOptions.tintColor ? Number(selectedLensOptions.tintColor.id) : undefined,
          prescriptionNotes: 'From Lens Selection page',
          lensNotes: `Lens Type: ${selectedLensType}`
        };
        
        // Store lens data in separate localStorage key
        localStorage.setItem(`matnice_lens_data_${addedItem.id}`, JSON.stringify(lensData));
        toast.success('Product saved to temporary cart!');
        
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        toast.error('An error occurred while adding to cart. Please try again.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const selectedOption = lensTypeOptions.find(opt => opt.type === selectedLensType);

  // Calculate progress for mobile footer
  const calculateProgress = () => {
    let completedSteps = 0;
    const totalSteps = 4;

    // Step 1: Glasses Type selected
    if (selectedLensType) completedSteps++;
    
    // Step 2: Prescription filled (if needed)
    if (selectedLensType === 'NON_PRESCRIPTION' || (showPrescriptionStep && isPrescriptionComplete())) {
      completedSteps++;
    }
    
    // Step 3: Lens selected
    if (selectedLens) completedSteps++;
    
    // Step 4: Lens options selected
    if (selectedLensOptions.variant) completedSteps++;

    return (completedSteps / totalSteps) * 100;
  };

  // Calculate total price (frame + lens options)
  const calculateTotalPrice = () => {
    let total = 0;
    
    // Add frame price
    if (selectedProduct) {
      total += Number(selectedProduct.price) || 0;
    }
    
    // Add lens variant price (already includes base lens price)
    if (selectedLensOptions.variant) {
      total += parseFloat(selectedLensOptions.variant.price);
    }
    
    // Add coatings price
    selectedLensOptions.coatings.forEach(coating => {
      total += parseFloat(coating.price);
    });
    
    // Add tint color price
    if (selectedLensOptions.tintColor) {
      total += parseFloat(selectedLensOptions.tintColor.price);
    }
    
    return total;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Navigation />
      
      <main className="bg-white flex-grow max-w-full mx-auto px-4 md:px-8 py-6 md:py-12 pb-32 md:pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
          {/* Left Content - Lens Selection (smaller) */}
          <div className="xl:col-span-2">
            <div className="rounded-lg p-4 md:p-8 w-full md:w-[1024px] mx-auto">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Lens Selection</h1>
          
          {/* Step 1: Your Glasses Type */}
          <div ref={step1Ref} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 text-white" style={{backgroundColor: '#363434'}}>
                  1
                </div>
                <h2 className="text-lg font-semibold">Your Glasses Type</h2>
              </div>
              {showPrescriptionStep && (
                <button 
                  onClick={() => {
                    // Reset to step 1 - show glasses type selection form
                    setShowPrescriptionStep(false);
                    
                    // Reset step 3 selections (lens selection)
                    setShowLensSelectionStep(false);
                    setSelectedLens(null);
                    setFilteredLenses([]);
                    
                    // Reset step 4 selections (lens options)
                    setShowLensOptionsStep(false);
                    setLensFullDetails(null);
                    setSelectedLensOptions({
                      variant: undefined,
                      coatings: [],
                      tintColor: undefined
                    });
                  }}
                  className="text-black-600 text-sm hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {!showPrescriptionStep ? (
              <div className="space-y-3">
                {lensTypeOptions.map((option) => (
                  <div
                    key={option.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLensType === option.type
                        ? 'border-2 border-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleLensTypeSelect(option.type)}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
                
                {selectedLensType && !showPrescriptionStep && selectedLensType === 'NON_PRESCRIPTION' && (
                  <button
                    onClick={handleContinue}
                    className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors mt-6"
                  >
                    Continue to Lens Selection
                  </button>
                )}

                {selectedLensType && !showPrescriptionStep && ['SINGLE_VISION', 'PROGRESSIVE', 'OFFICE', 'DRIVE_SAFE'].includes(selectedLensType) && (
                  <button
                    onClick={handleContinueToPrescription}
                    className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors mt-6"
                  >
                    Continue to Prescription Values
                  </button>
                )}
              </div>
            ) : (
              <div className="border-2 rounded-lg p-4 bg-white" style={{borderColor: '#363434'}}>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedOption?.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedOption?.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Your Prescription Values */}
          {showPrescriptionStep && (
            <div ref={step2Ref} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 text-white" style={{backgroundColor: '#363434'}}>
                    2
                  </div>
                  <h2 className="text-lg font-semibold">Your Prescription Values</h2>
                </div>
                {showLensSelectionStep && (
                  <button 
                    onClick={() => {
                      // Reset to step 2 - show prescription form
                      setShowLensSelectionStep(false);
                      
                      // Reset step 3 selections (lens selection)
                      setSelectedLens(null);
                      setFilteredLenses([]);
                      
                      // Reset step 4 selections (lens options)
                      setShowLensOptionsStep(false);
                      setLensFullDetails(null);
                      setSelectedLensOptions({
                        variant: undefined,
                        coatings: [],
                        tintColor: undefined
                      });
                    }}
                    className="text-black-600 text-sm hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              {!showLensSelectionStep ? (
                // Full prescription form when not in step 3
                <>
                  {/* Prescription Options */}
                  <div className="space-y-4 mb-6">
                    {/* Saved Prescription Option */}
                    {prescriptionOption === 'saved' ? (
                      <SavedPrescriptionSelector
                        selectedLensType={selectedLensType}
                        onPrescriptionSelect={handleSavedPrescriptionSelect}
                      />
                    ) : (
                      <div
                        className="border rounded-lg p-4 cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                        onClick={() => setPrescriptionOption('saved')}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">Use saved prescription values</h3>
                        <p className="text-gray-600 text-sm">
                          If you have stored your values from an eye test or previous purchase in your customer account.
                        </p>
                      </div>
                    )}

                    {/* Manual Prescription Option */}
                    {prescriptionOption === 'manual' ? null : (
                      <div
                        className="border rounded-lg p-4 cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                        onClick={() => {
                          setPrescriptionOption('manual');
                          // Reset to default ± 0.00 values when switching to manual
                          setPrescriptionData(prev => ({
                            ...prev,
                            sphereR: '± 0.00',
                            sphereL: '± 0.00',
                            cylinderR: '± 0.00',
                            cylinderL: '± 0.00'
                          }));
                        }}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">Enter your prescription values manually</h3>
                        <p className="text-gray-600 text-sm">
                          Please enter your prescription values as recorded on your prescription card.
                        </p>
                      </div>
                    )}
                  </div>

              {/* Manual Prescription Form */}
              {prescriptionOption === 'manual' && (
                <div className="border-2 rounded-lg p-4 md:p-6 mt-4" style={{borderColor: '#363434'}}>
                  <h3 className="font-semibold text-gray-900 mb-2">Enter your prescription values manually</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Please enter your prescription values as recorded on your prescription card.
                  </p>
                  <div className="space-y-6">
                    {/* Sphere */}
                    <div>
                      <div className="flex items-center mb-3">
                        <h4 className="font-medium text-black-700">Sphere (S/SPH)</h4>
                        <div className="ml-2 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">i</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-600 w-6">R</label>
                          <div className="flex flex-1">
                            <select
                              value={prescriptionData.sphereR}
                              onChange={(e) => setPrescriptionData(prev => ({...prev, sphereR: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {SPHERE_VALUES.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                            <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                              dpt
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-600 w-6">L</label>
                          <div className="flex flex-1">
                            <select
                              value={prescriptionData.sphereL}
                              onChange={(e) => setPrescriptionData(prev => ({...prev, sphereL: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {SPHERE_VALUES.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                            <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                              dpt
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cylinder */}
                    <div>
                      <div className="flex items-center mb-3">
                        <h4 className="font-medium text-black-700">Cylinder (ZYL / CYL)</h4>
                        <div className="ml-2 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">i</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-600 w-6">R</label>
                          <div className="flex flex-1">
                            <select
                              value={prescriptionData.cylinderR}
                              onChange={(e) => setPrescriptionData(prev => ({...prev, cylinderR: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {CYLINDER_VALUES.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                            <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                              dpt
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-600 w-6">L</label>
                          <div className="flex flex-1">
                            <select
                              value={prescriptionData.cylinderL}
                              onChange={(e) => setPrescriptionData(prev => ({...prev, cylinderL: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {CYLINDER_VALUES.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                            <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                              dpt
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add - Only for Progressive and Office */}
                    {needsAddValue() && (
                      <div>
                        <h4 className="font-medium text-black-700 mb-3">Add (ADD)</h4>
                        <div className="space-y-3 mb-3">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-600 w-6">R</label>
                            <div className="flex flex-1">
                              <select
                                value={prescriptionData.addR}
                                onChange={(e) => setPrescriptionData(prev => ({...prev, addR: e.target.value}))}
                                className={`flex-1 px-3 py-2 border ${getAddBorderColor(prescriptionData.addR)} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              >
                                {ADD_VALUES.map((value) => (
                                  <option key={value} value={value}>{value}</option>
                                ))}
                              </select>
                              <div className={`bg-gray-100 border-t border-r border-b ${getAddBorderColor(prescriptionData.addR)} rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center`}>
                                dpt
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-600 w-6">L</label>
                            <div className="flex flex-1">
                              <select
                                value={prescriptionData.addL}
                                onChange={(e) => setPrescriptionData(prev => ({...prev, addL: e.target.value}))}
                                className={`flex-1 px-3 py-2 border ${getAddBorderColor(prescriptionData.addL)} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              >
                                {ADD_VALUES.map((value) => (
                                  <option key={value} value={value}>{value}</option>
                                ))}
                              </select>
                              <div className={`bg-gray-100 border-t border-r border-b ${getAddBorderColor(prescriptionData.addL)} rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center`}>
                                dpt
                              </div>
                            </div>
                          </div>
                        </div>
                        {shouldShowAddWarning() && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Please provide an addition value if you have selected progressive or office glasses.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Axis */}
                    <div>
                      <div className="flex items-center mb-3">
                        <h4 className="font-medium text-black-700">Axis (A/ACH)</h4>
                        <div className="ml-2 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">i</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-600 w-6">R</label>
                          <select
                            value={prescriptionData.axisR}
                            onChange={(e) => setPrescriptionData(prev => ({...prev, axisR: e.target.value}))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {AXIS_VALUES.map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-600 w-6">L</label>
                          <select
                            value={prescriptionData.axisL}
                            onChange={(e) => setPrescriptionData(prev => ({...prev, axisL: e.target.value}))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {AXIS_VALUES.map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Pupillary Distance */}
                    <div>
                      <div className="flex items-center mb-3">
                        <h4 className="font-medium text-black-700">Pupillary distance (PD)</h4>
                        <div className="ml-2 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">i</span>
                        </div>
                      </div>
                      
                      {!prescriptionData.hasTwoPD ? (
                        // Single PD value
                        <div className="mb-4">
                          <div className="flex w-40">
                            <select
                              value={prescriptionData.pd}
                              onChange={(e) => setPrescriptionData(prev => ({...prev, pd: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {PD_SINGLE_VALUES.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                            <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                              mm
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Two PD values
                        <div className="mb-4">
                          <div className="space-y-3 mb-3">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-600 w-6">R</label>
                              <div className="flex flex-1">
                                <select
                                  value={prescriptionData.pdR}
                                  onChange={(e) => setPrescriptionData(prev => ({...prev, pdR: e.target.value}))}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {PD_DUAL_VALUES.map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                  ))}
                                </select>
                                <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                                  mm
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-600 w-6">L</label>
                              <div className="flex flex-1">
                                <select
                                  value={prescriptionData.pdL}
                                  onChange={(e) => setPrescriptionData(prev => ({...prev, pdL: e.target.value}))}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {PD_DUAL_VALUES.map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                  ))}
                                </select>
                                <div className="bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-lg px-3 py-2 text-gray-600 text-sm flex items-center">
                                    mm
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Toggle Button - Centered */}
                      <div className="flex justify-center mb-4">
                        <button
                          onClick={() => setPrescriptionData(prev => ({...prev, hasTwoPD: !prev.hasTwoPD}))}
                          className="w-full bg-white border-2 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                          style={{color: '#363434', borderColor: '#363434'}}
                        >
                          {prescriptionData.hasTwoPD ? 'I have one PD value' : 'I have two PD values'}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 text-xs">
                        Please round up to the nearest mm. This value will be equally divided into 2 values, one for each eye.
                      </p>
                    </div>

                    {/* Date of prescription */}
                    <div>
                      <h4 className="font-medium text-black-700 mb-3">Date of my last prescription</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Your prescription must have been taken within the last two years
                      </p>
                      
                      {/* Desktop view - dropdowns */}
                      <div className="hidden md:grid md:grid-cols-3 gap-4">
                        <div>
                          <select
                            value={prescriptionData.prescriptionDate.day}
                            onChange={(e) => setPrescriptionData(prev => ({
                              ...prev,
                              prescriptionDate: {...prev.prescriptionDate, day: e.target.value}
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">DD</option>
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                              <option key={day} value={day.toString().padStart(2, '0')}>
                                {day.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <select
                            value={prescriptionData.prescriptionDate.month}
                            onChange={(e) => setPrescriptionData(prev => ({
                              ...prev,
                              prescriptionDate: {...prev.prescriptionDate, month: e.target.value}
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">MM</option>
                            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <select
                            value={prescriptionData.prescriptionDate.year}
                            onChange={(e) => setPrescriptionData(prev => ({
                              ...prev,
                              prescriptionDate: {...prev.prescriptionDate, year: e.target.value}
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">YYYY</option>
                            {Array.from({length: 3}, (_, i) => new Date().getFullYear() - i).map(year => (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Mobile view - button triggers */}
                      <div className="grid grid-cols-3 gap-4 md:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setDatePickerType('day');
                            setShowDateModal(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                        >
                          {prescriptionData.prescriptionDate.day || 'DD'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDatePickerType('month');
                            setShowDateModal(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                        >
                          {prescriptionData.prescriptionDate.month || 'MM'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDatePickerType('year');
                            setShowDateModal(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                        >
                          {prescriptionData.prescriptionDate.year || 'YYYY'}
                        </button>
                      </div>
                    </div>

                    {/* Certification checkbox */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={isCertified}
                        onChange={(e) => setIsCertified(e.target.checked)}
                        className="mt-1 mr-3 h-4 w-4 text-gray-900 border-gray-900 rounded focus:ring-gray-900"
                      />
                      <p className="text-gray-600 text-sm">
                        I certify that the person wearing these glasses is at least 16 years old and not registered as either blind or partially sighted.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button - Outside the form but inside prescription step */}
              {showPrescriptionStep && (
                <div className="mt-6">
                  {/* Validation error messages */}
                  {prescriptionOption === 'manual' && (
                    <div className="mb-4">
                      {shouldShowDateError() && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                          <p className="text-red-700 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Please enter a valid prescription date within the last 2 years.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue()}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      canContinue()
                        ? 'bg-green-700 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue to Lens Selection
                  </button>
                </div>
              )}
                </>
              ) : (
                // Collapsed view when in step 3
                <div className="border-2 rounded-lg p-4 bg-white" style={{borderColor: '#363434'}}>
                  
                  {prescriptionOption === 'manual' && (
                    <div className="bg-white w-full">
                      <h4 className="font-semibold text-gray-800 mb-4 md:mb-6">Manually entered prescription values</h4>
                      
                      {/* Mobile View - 2 Column Values Layout */}
                      <div className="block md:hidden">
                        {/* Header */}
                        <div className="grid grid-cols-2 gap-4 mb-4 pb-2">
                          <div className="font-medium text-gray-900">Right eye</div>
                          <div className="font-medium text-gray-900">Left eye</div>
                        </div>
                        
                        {/* Values */}
                        <div className="space-y-4">
                          {/* Sphere */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Sphere <span className="text-gray-400">(S/SPH)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.sphereR)} dpt</p>
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.sphereL)} dpt</p>
                            </div>
                          </div>
                          
                          {/* Cylinder */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Cylinder <span className="text-gray-400">(ZYL/CYL)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.cylinderR)} dpt</p>
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.cylinderL)} dpt</p>
                            </div>
                          </div>
                          
                          {/* Axis */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Axis <span className="text-gray-400">(A/ACH)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatAxisValue(prescriptionData.axisR)}°</p>
                              <p className="text-sm font-medium">{formatAxisValue(prescriptionData.axisL)}°</p>
                            </div>
                          </div>
                          
                          {/* Add - if needed */}
                          {needsAddValue() && (
                            <div className="bg-gray-100 p-2 rounded">
                              <p className="text-xs text-gray-600 mb-2">Add <span className="text-gray-400">(ADD)</span></p>
                              <div className="grid grid-cols-2 gap-4">
                                <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.addR)} dpt</p>
                                <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.addL)} dpt</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Pupillary Distance */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Pupillary distance <span className="text-gray-400">(PD)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatPDValue(true)} mm</p>
                              <p className="text-sm font-medium">{formatPDValue(false)} mm</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View - Grid Layout */}
                      <div className="hidden md:block prescription-grid">
                        {/* Header Row - All Prescription Types */}
                        <div className="prescription-headers">
                          <div className="prescription-spacer"></div>
                          <div className="prescription-type-header">Sphere (S/SPH)</div>
                          <div className="prescription-type-header">Cylinder (C/CYL)</div>
                          <div className="prescription-type-header">Axis (A/ACH)</div>
                          {needsAddValue() && <div className="prescription-type-header">Add (ADD)</div>}
                          <div className="prescription-type-header">PD</div>
                        </div>

                        {/* Right Eye Row */}
                        <div className="prescription-values-row">
                          <div className="prescription-eye-label">Right eye</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.sphereR)} dpt</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.cylinderR)} dpt</div>
                          <div className="prescription-value-box">{formatAxisValue(prescriptionData.axisR)}°</div>
                          {needsAddValue() && <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.addR)} dpt</div>}
                          <div className="prescription-value-box">{formatPDValue(true)} mm</div>
                        </div>

                        {/* Left Eye Row */}
                        <div className="prescription-values-row">
                          <div className="prescription-eye-label">Left eye</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.sphereL)} dpt</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.cylinderL)} dpt</div>
                          <div className="prescription-value-box">{formatAxisValue(prescriptionData.axisL)}°</div>
                          {needsAddValue() && <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.addL)} dpt</div>}
                          <div className="prescription-value-box">{formatPDValue(false)} mm</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {prescriptionOption === 'saved' && (
                    <div className="bg-white w-full">
                      <h4 className="font-semibold text-gray-800 mb-4 md:mb-6">Saved prescription values</h4>
                      
                      {/* Mobile View - 2 Column Values Layout */}
                      <div className="block md:hidden">
                        {/* Header */}
                        <div className="grid grid-cols-2 gap-4 mb-4 pb-2">
                          <div className="font-medium text-gray-900">Right eye</div>
                          <div className="font-medium text-gray-900">Left eye</div>
                        </div>
                        
                        {/* Values */}
                        <div className="space-y-4">
                          {/* Sphere */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Sphere <span className="text-gray-400">(S/SPH)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.sphereR)} dpt</p>
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.sphereL)} dpt</p>
                            </div>
                          </div>
                          
                          {/* Cylinder */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Cylinder <span className="text-gray-400">(ZYL/CYL)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.cylinderR)} dpt</p>
                              <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.cylinderL)} dpt</p>
                            </div>
                          </div>
                          
                          {/* Axis */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Axis <span className="text-gray-400">(A/ACH)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatAxisValue(prescriptionData.axisR)}°</p>
                              <p className="text-sm font-medium">{formatAxisValue(prescriptionData.axisL)}°</p>
                            </div>
                          </div>
                          
                          {/* Add - if needed */}
                          {needsAddValue() && (
                            <div className="bg-gray-100 p-2 rounded">
                              <p className="text-xs text-gray-600 mb-2">Add <span className="text-gray-400">(ADD)</span></p>
                              <div className="grid grid-cols-2 gap-4">
                                <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.addR)} dpt</p>
                                <p className="text-sm font-medium">{formatPrescriptionValue(prescriptionData.addL)} dpt</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Pupillary Distance */}
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600 mb-2">Pupillary distance <span className="text-gray-400">(PD)</span></p>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="text-sm font-medium">{formatPDValue(true)} mm</p>
                              <p className="text-sm font-medium">{formatPDValue(false)} mm</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View - Grid Layout */}
                      <div className="hidden md:block prescription-grid">
                        {/* Header Row - All Prescription Types */}
                        <div className="prescription-headers">
                          <div className="prescription-spacer"></div>
                          <div className="prescription-type-header">Sphere (S/SPH)</div>
                          <div className="prescription-type-header">Cylinder (C/CYL)</div>
                          <div className="prescription-type-header">Axis (A/ACH)</div>
                          {needsAddValue() && <div className="prescription-type-header">Add (ADD)</div>}
                          <div className="prescription-type-header">PD</div>
                        </div>

                        {/* Right Eye Row */}
                        <div className="prescription-values-row">
                          <div className="prescription-eye-label">Right eye</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.sphereR)} dpt</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.cylinderR)} dpt</div>
                          <div className="prescription-value-box">{formatAxisValue(prescriptionData.axisR)}°</div>
                          {needsAddValue() && <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.addR)} dpt</div>}
                          <div className="prescription-value-box">{formatPDValue(true)} mm</div>
                        </div>

                        {/* Left Eye Row */}
                        <div className="prescription-values-row">
                          <div className="prescription-eye-label">Left eye</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.sphereL)} dpt</div>
                          <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.cylinderL)} dpt</div>
                          <div className="prescription-value-box">{formatAxisValue(prescriptionData.axisL)}°</div>
                          {needsAddValue() && <div className="prescription-value-box">{formatPrescriptionValue(prescriptionData.addL)} dpt</div>}
                          <div className="prescription-value-box">{formatPDValue(false)} mm</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Lens Selection */}
          {showLensSelectionStep && (
            <div ref={step3Ref} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 text-white bg-gray-800">
                    3
                  </div>
                  <h2 className="text-lg font-semibold">Lens Selection</h2>
                </div>
                {showLensOptionsStep && (
                  <button 
                    onClick={() => {
                      // Reset to step 3 - show lens selection (keep step 3 visible)
                      setShowLensOptionsStep(false);
                      setSelectedLens(null);
                      setLensFullDetails(null);
                      setSelectedLensOptions({
                        variant: undefined,
                        coatings: [],
                        tintColor: undefined
                      });
                    }}
                    className="text-black-600 text-sm hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              {!showLensOptionsStep ? (
                // Show lens grid when not in step 4
                <>
                  {/* Lens Filter Section */}
                  <div className="bg-white rounded-lg border p-4 md:p-6">
                    
                    {/* Desktop Filter - Dropdowns */}
                    <div className="hidden md:flex md:flex-wrap gap-4 mb-6">
                      {/* Brand Filter */}
                      <div className="flex-1 md:min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <select 
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Brands</option>
                          {brandLensOptions && brandLensOptions.length > 0 && brandLensOptions.map(brand => (
                            <option key={brand.brandLensId} value={brand.brandLensId}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div className="flex-1 md:min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lens Type</label>
                        <select 
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Types</option>
                          {categoryLensOptions && categoryLensOptions.length > 0 && categoryLensOptions.map(category => (
                            <option key={category.categoryLensId} value={category.categoryLensId}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lens Thickness Filter */}
                      <div className="flex-1 md:min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thickness</label>
                        <select 
                          value={selectedThickness}
                          onChange={(e) => setSelectedThickness(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Thickness</option>
                          {lensThicknessOptions && lensThicknessOptions.length > 0 && lensThicknessOptions.map(thickness => (
                            <option key={thickness.id} value={thickness.id}>
                              {thickness.name} (Index: {thickness.indexValue})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Filter */}
                      <div className="flex-1 md:min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <select 
                          value={selectedPrice}
                          onChange={(e) => setSelectedPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Price Ranges</option>
                          <option value="under-1m">Under ₫1M</option>
                          <option value="1m-2m">₫1M - ₫2M</option>
                          <option value="2m-3m">₫2M - ₫3M</option>
                          <option value="over-3m">Over ₫3M</option>
                        </select>
                      </div>
                    </div>

                    {/* Mobile Filter - Horizontal Scrollable Chips */}
                    <div className="md:hidden mb-6">
                      {/* Filter Chips Row */}
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {/* Brand Filter Chip */}
                        <button
                          type="button"
                          onClick={() => {
                            setLensFilterType('brand');
                            setShowLensFilterModal(true);
                          }}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 border transition-colors ${
                            selectedBrand 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                        >
                          <span>Brand</span>
                          {selectedBrand && (
                            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                          )}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Category Filter Chip */}
                        <button
                          type="button"
                          onClick={() => {
                            setLensFilterType('category');
                            setShowLensFilterModal(true);
                          }}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 border transition-colors ${
                            selectedCategory 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                        >
                          <span>Type</span>
                          {selectedCategory && (
                            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                          )}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Thickness Filter Chip */}
                        <button
                          type="button"
                          onClick={() => {
                            setLensFilterType('thickness');
                            setShowLensFilterModal(true);
                          }}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 border transition-colors ${
                            selectedThickness 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                        >
                          <span>Thickness</span>
                          {selectedThickness && (
                            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                          )}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Price Filter Chip */}
                        <button
                          type="button"
                          onClick={() => {
                            setLensFilterType('price');
                            setShowLensFilterModal(true);
                          }}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 border transition-colors ${
                            selectedPrice 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                        >
                          <span>Price</span>
                          {selectedPrice && (
                            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                          )}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Sort Filter Chip */}
                        <button
                          type="button"
                          onClick={() => {
                            setLensFilterType('sort');
                            setShowLensFilterModal(true);
                          }}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 border transition-colors ${
                            selectedSort 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          }`}
                        >
                          <span>Sort</span>
                          {selectedSort && (
                            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                          )}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Clear All Button - Show when filters are active */}
                      {activeFilterCount > 0 && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                          </span>
                          <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear All
                          </button>
                        </div>
                      )}
                    </div>

                {/* Lens Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Suitable Lenses</h3>
                      {activeFilterCount > 0 && !lensesLoading && (
                        <p className="text-sm text-gray-600 mt-1">
                          Showing {displayedLenses.length} / {filteredLenses.length} results
                        </p>
                      )}
                    </div>
                    {lensesLoading && (
                      <div className="text-sm text-gray-600">Searching...</div>
                    )}
                  </div>
                  
                  {/* Loading state */}
                  {lensesLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}

                  {/* No results */}
                  {!lensesLoading && displayedLenses.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-2">No suitable lenses found</div>
                      <div className="text-sm text-gray-400">Please try adjusting your prescription values or filters</div>
                    </div>
                  )}

                  {/* Lens grid */}
                  {!lensesLoading && displayedLenses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedLenses.map((lens) => (
                        <div 
                          key={lens.id} 
                          className={`border rounded-lg p-4 transition-all cursor-pointer ${
                            selectedLens?.id === lens.id 
                              ? 'border-2 border-black shadow-md' 
                              : 'border hover:shadow-md hover:border-gray-300'
                          }`}
                          onClick={() => handleLensSelect(lens)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{lens.name}</h4>
                            <span className="text-lg font-semibold text-green-600">
                              {lens.priceRange.min.toLocaleString('vi-VN')}₫ - {lens.priceRange.max.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {lens.lensType === 'SINGLE_VISION' && 'Single Vision'}
                            {lens.lensType === 'PROGRESSIVE' && 'Progressive'}
                            {lens.lensType === 'OFFICE' && 'Office'}
                            {lens.lensType === 'DRIVE_SAFE' && 'Drive Safe'}
                            {lens.lensType === 'NON_PRESCRIPTION' && 'Non-Prescription'}
                            {lens.brandLens && ` - ${lens.brandLens.name}`}
                          </p>
                          {lens.description && (
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{lens.description}</p>
                          )}
                          {lens.imageUrl && (
                            <div className="mb-2 flex justify-center">
                              <img 
                                src={lens.imageUrl} 
                                alt={lens.name}
                                className="max-w-full max-h-80 object-contain rounded bg-gray-50"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {lens.origin || 'Imported'}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {lens.status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {!lensesLoading && filteredLenses.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            loadFilteredLenses();
                          }
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <span className="text-sm text-gray-600">
                        Page {currentPage} / {totalPages}
                      </span>
                      
                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                            loadFilteredLenses();
                          }
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
                </>
              ) : (
                // Show selected lens info when in step 4
                selectedLens && (
                  <div className="bg-white rounded-lg p-2">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        {selectedLens.imageUrl && (
                          <img 
                            src={selectedLens.imageUrl} 
                            alt={selectedLens.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{selectedLens.name}</p>
                          <p className="text-sm text-gray-700">
                            {selectedLens.lensType === 'SINGLE_VISION' && 'Single Vision'}
                            {selectedLens.lensType === 'PROGRESSIVE' && 'Progressive'}
                            {selectedLens.lensType === 'OFFICE' && 'Office'}
                            {selectedLens.lensType === 'DRIVE_SAFE' && 'Drive Safe'}
                            {selectedLens.lensType === 'NON_PRESCRIPTION' && 'Non-Prescription'}
                            {selectedLens.brandLens && ` - ${selectedLens.brandLens.name}`}
                          </p>
                          <p className="text-xs text-gray-600">{selectedLens.origin}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Continue to Lens Options Button */}
          {showLensSelectionStep && !showLensOptionsStep && (
            <div className="mb-8">
              <button 
                onClick={handleContinueToLensOptions}
                disabled={!selectedLens}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  selectedLens 
                    ? 'bg-green-700 text-white hover:bg-green-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              > 
                {selectedLens 
                  ? 'Continue to Lens Options' 
                  : 'Continue to Lens Options'
                }
              </button>
            </div>
          )}

          {/* Step 4: Lens Options */}
          {showLensOptionsStep && (
            <div ref={step4Ref} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 text-white bg-gray-800">
                    4
                  </div>
                  <h2 className="text-lg font-semibold">Customize Lens</h2>
                </div>
              </div>

              {/* Lens Options Content */}
              <div className="bg-white rounded-lg border p-6">
                {lensOptionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading options...</span>
                  </div>
                ) : lensFullDetails ? (
                  <div className="space-y-6">
                    {/* Selected Lens Info */}

                    {/* Variants Selection */}
                    {lensFullDetails.variants.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Select Lens Type and Thickness</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lensFullDetails.variants.map((variant) => (
                            <div 
                              key={variant.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedLensOptions.variant?.id === variant.id 
                                  ? 'border-2 border-black' 
                                  : 'border hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedLensOptions(prev => ({...prev, variant}))}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-900">{variant.lensThickness.name}</h5>
                                <span className="text-sm font-semibold text-green-600">
                                  +{Number(variant.price).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                Refractive Index: {variant.lensThickness.indexValue}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                Material: {variant.material} | Design: {variant.design}
                              </p>
                              <p className="text-xs text-gray-500">{variant.lensThickness.description}</p>
                              <div className="mt-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Coatings Selection */}
                    {lensFullDetails.coatings.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Select Coating</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lensFullDetails.coatings.map((coating) => (
                            <div 
                              key={coating.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedLensOptions.coatings.some(c => c.id === coating.id)
                                  ? 'border-2 border-black' 
                                  : 'border hover:border-gray-300'
                              }`}
                              onClick={() => {
                                const isSelected = selectedLensOptions.coatings.some(c => c.id === coating.id);
                                if (isSelected) {
                                  // Deselect current coating
                                  setSelectedLensOptions(prev => ({
                                    ...prev, 
                                    coatings: []
                                  }));
                                } else {
                                  // Select only this coating (replace any existing)
                                  setSelectedLensOptions(prev => ({
                                    ...prev, 
                                    coatings: [coating]
                                  }));
                                }
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-900">{coating.name}</h5>
                                <span className="text-sm font-semibold text-green-600">
                                  +{Number(coating.price).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{coating.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tint Colors Selection (if available) */}
                    {lensFullDetails.variants.some(v => v.tintColors.length > 0) && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Select Tint Color (Optional)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {lensFullDetails.variants
                            .flatMap(v => v.tintColors)
                            .filter((color, index, self) => self.findIndex(c => c.id === color.id) === index)
                            .map((tintColor) => (
                              <div 
                                key={tintColor.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                  selectedLensOptions.tintColor?.id === tintColor.id
                                    ? 'border-2 border-blue-500 bg-blue-50' 
                                    : 'border hover:border-gray-300'
                                }`}
                                onClick={() => {
                                  const isSelected = selectedLensOptions.tintColor?.id === tintColor.id;
                                  setSelectedLensOptions(prev => ({
                                    ...prev, 
                                    tintColor: isSelected ? undefined : tintColor
                                  }));
                                }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-6 h-6 rounded-full border-2 border-gray-300 mr-2"
                                      style={{ backgroundColor: tintColor.colorCode }}
                                    ></div>
                                    <span className="font-medium text-sm">{tintColor.name}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-green-600">
                                  +{Number(tintColor.price).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Unable to load lens options</p>
                  </div>
                )}
              </div>

              {/* Add to Cart Button - Only show in step 4 */}
              {lensFullDetails && (
                <div className="mt-8 border-t pt-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedProduct || !selectedLens || !isPrescriptionComplete() || !selectedLensOptions.variant}
                    className={`w-full py-2 px-6 rounded-lg font-semibold text-lg transition-colors ${
                      isAddingToCart || !selectedProduct || !selectedLens || !isPrescriptionComplete() || !selectedLensOptions.variant
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                  >
                    {isAddingToCart ? 'Adding to cart...' : 'Add to Cart'}
                  </button>
                  
                  {/* Validation message for incomplete prescription */}
                  {!isPrescriptionComplete() && selectedProduct && selectedLens && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        Please complete your prescription information to add to cart
                      </p>
                    </div>
                  )}
                  
                  {/* Validation message for lens variant selection */}
                  {!selectedLensOptions.variant && selectedProduct && selectedLens && isPrescriptionComplete() && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        Please select lens type and thickness to add to cart
                      </p>
                    </div>
                  )}
                  
                  {/* Validation message for Progressive lenses */}
                  {selectedLensType === 'PROGRESSIVE' && shouldShowAddWarning() && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        For Progressive lenses, please select ADD value for both eyes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step Preview - Upcoming Steps */}
          {!showPrescriptionStep && !showLensSelectionStep && !showLensOptionsStep && (
            <div className="space-y-4 opacity-40 mt-8">
              {selectedLensType !== 'NON_PRESCRIPTION' && (
                <div className="flex items-center">
                  <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 bg-gray-300 text-gray-600">
                    2
                  </div>
                  <h2 className="text-lg font-semibold text-gray-500">Your Prescription Values</h2>
                </div>
              )}
              
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 bg-gray-300 text-gray-600">
                  {selectedLensType === 'NON_PRESCRIPTION' ? '2' : '3'}
                </div>
                <h2 className="text-lg font-semibold text-gray-500">Your Lens Selection</h2>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 bg-gray-300 text-gray-600">
                  {selectedLensType === 'NON_PRESCRIPTION' ? '3' : '4'}
                </div>
                <h2 className="text-lg font-semibold text-gray-500">Your Lens Options</h2>
              </div>
            </div>
          )}

          {showPrescriptionStep && !showLensSelectionStep && !showLensOptionsStep && (
            <div className="space-y-4 opacity-40 mt-8">
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 bg-gray-300 text-gray-600">
                  3
                </div>
                <h2 className="text-lg font-semibold text-gray-500">Your Lens Selection</h2>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 bg-gray-300 text-gray-600">
                  4
                </div>
                <h2 className="text-lg font-semibold text-gray-500">Your Lens Options</h2>
              </div>
            </div>
          )}

          {showLensSelectionStep && !showLensOptionsStep && (
            <div className="space-y-4 opacity-40 mt-8">
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 bg-gray-300 text-gray-600">
                  {selectedLensType === 'NON_PRESCRIPTION' ? '3' : '4'}
                </div>
                <h2 className="text-lg font-semibold text-gray-500">Your Lens Options</h2>
              </div>
            </div>
          )}
            </div>
          </div>

          {/* Right Sidebar - Product Info */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-6">
              {/* Product Image */}
              <div className="mb-8">
                {selectedProduct ? (
                  <>
                    <img 
                      src={selectedColorImageUrl || selectedProduct.thumbnailUrl || 
                           "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=250&fit=crop&crop=center"} 
                      alt={selectedProduct.displayName}
                      className="w-full h-56 object-contain bg-gray-50 rounded-lg"
                    />
                    <p className="text-base text-gray-600 text-center mt-3 font-medium">
                      {selectedProductDetail ? 
                        `${selectedProductDetail.brand?.name} | ${getDisplayNameWithColor()}` :
                        `${selectedProduct.brandName} | ${selectedProduct.displayName}`
                      }
                    </p>
                  </>
                ) : (
                  <>
                    <img 
                      src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=250&fit=crop&crop=center" 
                      alt="Loading..."
                      className="w-full h-56 object-contain bg-gray-50 rounded-lg animate-pulse"
                    />
                    <p className="text-base text-gray-600 text-center mt-3 font-medium">
                      Loading product information...
                    </p>
                  </>
                )}
              </div>

              {/* Price Details */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Price Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Frame</span>
                    <span className="font-semibold text-lg">
                      {selectedProduct?.price ? `${Number(selectedProduct.price).toLocaleString('vi-VN')}₫` : '0₫'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 pl-0">
                    {selectedProductDetail ? 
                      getDisplayNameWithColor() :
                      (selectedProduct?.displayName || 'No frame selected')
                    }
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Lens Type</span>
                    <span className="font-medium text-base">
                      {selectedLens && !showLensOptionsStep ? 
                         `${selectedLens.priceRange.min.toLocaleString('vi-VN')}₫ - ${selectedLens.priceRange.max.toLocaleString('vi-VN')}₫` :
                       selectedLens && showLensOptionsStep ? 'Selected' :
                       selectedLensType === 'SINGLE_VISION' ? 'Single Vision' :
                       selectedLensType === 'PROGRESSIVE' ? 'Progressive' :
                       selectedLensType === 'OFFICE' ? 'Office' :
                       selectedLensType === 'DRIVE_SAFE' ? 'Drive Safe' :
                       selectedLensType === 'NON_PRESCRIPTION' ? 'Non-Prescription' :
                       'Select lens type'}
                    </span>
                  </div>
                  
                  {selectedLens && (
                    <div className="text-sm text-gray-500 pl-0">
                      <div>{selectedLens.name}</div>
                      {selectedLens.brandLens && (
                        <div className="text-xs text-gray-400 mt-1">{selectedLens.brandLens.name}</div>
                      )}
                    </div>
                  )}

                  {/* Lens Variant Option */}
                  {selectedLensOptions.variant && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-base">Lens Thickness</span>
                        <span className="font-semibold text-lg">
                          +{Number(selectedLensOptions.variant.price).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 pl-0">
                        {selectedLensOptions.variant.lensThickness.name} (Index: {selectedLensOptions.variant.lensThickness.indexValue})
                      </div>
                    </>
                  )}

                  {/* Lens Coatings */}
                  {selectedLensOptions.coatings.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-base">Coating</span>
                        <span className="font-semibold text-lg">
                          +{selectedLensOptions.coatings.reduce((sum, coating) => sum + Number(coating.price), 0).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 pl-0">
                        {selectedLensOptions.coatings.map(coating => coating.name).join(', ')}
                      </div>
                    </>
                  )}

                  {/* Tint Color */}
                  {selectedLensOptions.tintColor && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-base">Tint Color</span>
                        <span className="font-semibold text-lg">
                          +{Number(selectedLensOptions.tintColor.price).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 pl-0">
                        {selectedLensOptions.tintColor.name}
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Shipping (7-15 days)</span>
                    <span className="font-semibold text-green-600 text-lg">Free</span>
                  </div>
                </div>
                
                <hr className="my-6" />
                
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-xl text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-gray-800">
                    {(() => {
                      const framePrice = Number(selectedProduct?.price) || 0;
                      // Don't add lens base price as it's included in variant price
                      // const lensPrice = (selectedLens && showLensOptionsStep) ? selectedLens.basePrice : 0;
                      
                      // Add lens options prices only
                      const variantPrice = selectedLensOptions.variant ? Number(selectedLensOptions.variant.price) : 0;
                      const coatingsPrice = selectedLensOptions.coatings.reduce((sum, coating) => sum + Number(coating.price), 0);
                      const tintPrice = selectedLensOptions.tintColor ? Number(selectedLensOptions.tintColor.price) : 0;
                      
                      const totalPrice = framePrice + variantPrice + coatingsPrice + tintPrice;
                      return totalPrice.toLocaleString('vi-VN');
                    })()}₫
                  </span>
                </div>
                <p className="text-sm text-gray-500">VAT included</p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center text-blue-700">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-base font-semibold">Safe Online Shopping</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-base">Fast Free Shipping</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-base">30-Day Return Warranty</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-base">Over 15 Years Professional Experience</span>
                </div>

                <div className="flex items-center justify-center py-5">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 text-xl">★</span>
                    <span className="text-base font-medium">Matnice Reviews</span>
                    <span className="text-xs bg-green-700 text-white px-3 py-1 rounded">TRUST & QUALITY</span>
                  </div>
                </div>

                <hr className="my-6" />

                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-3">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-bold text-lg">1900 8828</span>
                  </div>
                  <p className="text-sm text-gray-500">T2 - T6: 8:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer - Only on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-50">
        {/* Progress Bar as Border Top */}
        <div className="w-full h-1 bg-gray-200 overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        
        {/* Product Summary */}
        <div className="p-4">
          {selectedProduct ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedProduct.thumbnailUrl && (
                  <img 
                    src={selectedProduct.thumbnailUrl} 
                    alt={selectedProduct.displayName}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedProductDetail ? 
                      getDisplayNameWithColor() :
                      selectedProduct.displayName
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedProduct.brandName}
                  </p>
                </div>
              </div>
              <div className="text-right ml-2">
                <p className="text-lg font-bold text-green-600">
                  {calculateTotalPrice().toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">Loading product...</p>
            </div>
          )}
        </div>
      </div>

      {/* Date Picker Bottom Modal - Mobile Only */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDateModal(false)}
          />
          
          {/* Modal Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {datePickerType === 'day' && 'Select Day'}
                {datePickerType === 'month' && 'Select Month'}
                {datePickerType === 'year' && 'Select Year'}
              </h3>
              <button
                onClick={() => setShowDateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable List */}
            <div className="max-h-96 overflow-y-auto">
              {datePickerType === 'day' && (
                <div className="divide-y">
                  {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                    const dayStr = day.toString().padStart(2, '0');
                    const isSelected = prescriptionData.prescriptionDate.day === dayStr;
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setPrescriptionData(prev => ({
                            ...prev,
                            prescriptionDate: {...prev.prescriptionDate, day: dayStr}
                          }));
                          setShowDateModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        {dayStr}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {datePickerType === 'month' && (
                <div className="divide-y">
                  {Array.from({length: 12}, (_, i) => i + 1).map(month => {
                    const monthStr = month.toString().padStart(2, '0');
                    const isSelected = prescriptionData.prescriptionDate.month === monthStr;
                    return (
                      <button
                        key={month}
                        onClick={() => {
                          setPrescriptionData(prev => ({
                            ...prev,
                            prescriptionDate: {...prev.prescriptionDate, month: monthStr}
                          }));
                          setShowDateModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        {monthStr}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {datePickerType === 'year' && (
                <div className="divide-y">
                  {Array.from({length: 3}, (_, i) => new Date().getFullYear() - i).map(year => {
                    const yearStr = year.toString();
                    const isSelected = prescriptionData.prescriptionDate.year === yearStr;
                    return (
                      <button
                        key={year}
                        onClick={() => {
                          setPrescriptionData(prev => ({
                            ...prev,
                            prescriptionDate: {...prev.prescriptionDate, year: yearStr}
                          }));
                          setShowDateModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        {yearStr}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lens Filter Bottom Modal - Mobile Only */}
      {showLensFilterModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowLensFilterModal(false)}
          />
          
          {/* Modal Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {lensFilterType === 'brand' && 'Select Brand'}
                {lensFilterType === 'category' && 'Select Lens Type'}
                {lensFilterType === 'thickness' && 'Select Thickness'}
                {lensFilterType === 'price' && 'Select Price Range'}
                {lensFilterType === 'sort' && 'Sort By'}
              </h3>
              <button
                onClick={() => setShowLensFilterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable List */}
            <div className="max-h-96 overflow-y-auto">
              {/* Brand Filter Options */}
              {lensFilterType === 'brand' && (
                <div className="divide-y">
                  <button
                    onClick={() => {
                      setSelectedBrand('');
                      setShowLensFilterModal(false);
                    }}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                      selectedBrand === '' ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    <span>All Brands</span>
                    {selectedBrand === '' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  {brandLensOptions && brandLensOptions.length > 0 && brandLensOptions.map(brand => {
                    const isSelected = selectedBrand === String(brand.brandLensId);
                    return (
                      <button
                        key={brand.brandLensId}
                        onClick={() => {
                          setSelectedBrand(String(brand.brandLensId));
                          setShowLensFilterModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        <span>{brand.name}</span>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Category Filter Options */}
              {lensFilterType === 'category' && (
                <div className="divide-y">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setShowLensFilterModal(false);
                    }}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                      selectedCategory === '' ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    <span>All Types</span>
                    {selectedCategory === '' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  {categoryLensOptions && categoryLensOptions.length > 0 && categoryLensOptions.map(category => {
                    const isSelected = selectedCategory === String(category.categoryLensId);
                    return (
                      <button
                        key={category.categoryLensId}
                        onClick={() => {
                          setSelectedCategory(String(category.categoryLensId));
                          setShowLensFilterModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        <span>{category.name}</span>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Thickness Filter Options */}
              {lensFilterType === 'thickness' && (
                <div className="divide-y">
                  <button
                    onClick={() => {
                      setSelectedThickness('');
                      setShowLensFilterModal(false);
                    }}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                      selectedThickness === '' ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    <span>All Thickness</span>
                    {selectedThickness === '' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  {lensThicknessOptions && lensThicknessOptions.length > 0 && lensThicknessOptions.map(thickness => {
                    const isSelected = selectedThickness === String(thickness.id);
                    return (
                      <button
                        key={thickness.id}
                        onClick={() => {
                          setSelectedThickness(String(thickness.id));
                          setShowLensFilterModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{thickness.name}</span>
                          <span className="text-sm text-gray-500">Refractive Index: {thickness.indexValue}</span>
                        </div>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Price Filter Options */}
              {lensFilterType === 'price' && (
                <div className="divide-y">
                  {[
                    { value: '', label: 'All Price Ranges' },
                    { value: 'under-1m', label: 'Under ₫1M' },
                    { value: '1m-2m', label: '₫1M - ₫2M' },
                    { value: '2m-3m', label: '₫2M - ₫3M' },
                    { value: 'over-3m', label: 'Over ₫3M' }
                  ].map(option => {
                    const isSelected = selectedPrice === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedPrice(option.value);
                          setShowLensFilterModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* Sort Filter Options */}
              {lensFilterType === 'sort' && (
                <div className="divide-y">
                  {[
                    { value: '', label: 'Default' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'name-asc', label: 'Name: A-Z' },
                    { value: 'name-desc', label: 'Name: Z-A' }
                  ].map(option => {
                    const isSelected = selectedSort === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option.value);
                          setShowLensFilterModal(false);
                        }}
                        className={`w-full text-left px-4 py-4 hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LensSelectionPage;
