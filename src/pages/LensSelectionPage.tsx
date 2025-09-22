import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import productCardService from '../services/product-card.service';
import lensPrescriptionService, { FilteredLens, LensPrescriptionFilterResponse } from '../services/lens-prescription.service';
import { ProductCard } from '../types/product-card.types';

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
  const [selectedLensType, setSelectedLensType] = useState<string>('');
  const [availableProducts, setAvailableProducts] = useState<ProductCard[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionOption, setPrescriptionOption] = useState<'saved' | 'manual'>('saved');
  const [showPrescriptionStep, setShowPrescriptionStep] = useState(false);
  const [showLensSelectionStep, setShowLensSelectionStep] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const [filteredLenses, setFilteredLenses] = useState<FilteredLens[]>([]);
  const [lensesLoading, setLensesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
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
        
        // Select first product as default
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0]);
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, []);

  // Effect to reload filtered lenses when page changes
  useEffect(() => {
    if (showLensSelectionStep && currentPage > 1) {
      loadFilteredLenses();
    }
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLensTypeSelect = (lensType: string) => {
    setSelectedLensType(lensType);
    
    if (['SINGLE_VISION', 'DRIVE_SAFE', 'PROGRESSIVE', 'OFFICE'].includes(lensType)) {
      setShowPrescriptionStep(true);
    } else {
      // For NON_PRESCRIPTION, skip to next step
      handleContinue();
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

  const needsAddValue = () => {
    return ['PROGRESSIVE', 'OFFICE'].includes(selectedLensType);
  };

  // Helper function to convert prescription values
  const convertPrescriptionValue = (value: string): number | undefined => {
    if (value === '± 0.00' || value === '-' || !value) return undefined;
    
    // Remove '+' prefix if present and convert to number
    const numericValue = parseFloat(value.replace('+', ''));
    return isNaN(numericValue) ? undefined : numericValue;
  };

  // Function to load filtered lenses based on prescription
  const loadFilteredLenses = async () => {
    if (prescriptionOption === 'saved') {
      // For saved prescriptions, we would need to get the saved data first
      // For now, just show all lenses
      setLensesLoading(true);
      try {
        const response = await lensPrescriptionService.filterLensesByPrescription({
          page: currentPage,
          limit: 12
        });
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
      
      const response = await lensPrescriptionService.filterLensesByPrescription(prescriptionParams);
      setFilteredLenses(response.data);
      setTotalPages(response.meta.totalPages);
      
      console.log(`Found ${response.data.length} compatible lenses`);
    } catch (error) {
      console.error('Error filtering lenses:', error);
      setFilteredLenses([]);
    } finally {
      setLensesLoading(false);
    }
  };

  const shouldShowAddWarning = () => {
    if (!needsAddValue()) return false;
    // Show warning if either R or L ADD value is still "-" (not selected)
    return prescriptionData.addR === '-' || prescriptionData.addL === '-';
  };

  const getAddBorderColor = (value: string) => {
    // Return red border if value is "-" (not selected), otherwise normal gray border
    return value === '-' ? 'border-red-300' : 'border-gray-300';
  };

  const selectedOption = lensTypeOptions.find(opt => opt.type === selectedLensType);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="flex-grow max-w-full mx-auto px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Content - Lens Selection (smaller) */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full min-w-[950px] min-h-[1544px]">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Lens Selection</h1>
          
          {/* Step 1: Your Glasses Type */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 text-white" style={{backgroundColor: '#363434'}}>
                  1
                </div>
                <h2 className="text-lg font-semibold">Your Glasses Type</h2>
              </div>
              {showPrescriptionStep && (
                <button 
                  onClick={() => setShowPrescriptionStep(false)}
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
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors mt-6"
                  >
                    Continue to Lens Selection
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
            <div className="mb-8">
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
                      setShowLensSelectionStep(false);
                    }}
                    className="text-blue-600 text-sm hover:underline"
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
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    prescriptionOption === 'saved'
                      ? 'border-2 bg-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={prescriptionOption === 'saved' ? {borderColor: '#363434'} : {}}
                  onClick={() => setPrescriptionOption('saved')}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Use saved prescription values</h3>
                  {prescriptionOption === 'saved' ? (
                    <>
                      <p className="text-gray-600 text-sm mb-4">Please sign in to load saved values from your account.</p>
                      <button className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                        Login now
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      If you have stored your values from an eye test or previous purchase in your customer account.
                    </p>
                  )}
                </div>

                {prescriptionOption !== 'manual' && (
                  <div
                    className="border rounded-lg p-4 cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                    onClick={() => setPrescriptionOption('manual')}
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
                <div className="border-2 rounded-lg p-6 mt-4" style={{borderColor: '#363434'}}>
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
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">R</label>
                          <div className="flex">
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
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">L</label>
                          <div className="flex">
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
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">R</label>
                          <div className="flex">
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
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">L</label>
                          <div className="flex">
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
                        <div className="space-y-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">R</label>
                            <div className="flex">
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
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">L</label>
                            <div className="flex">
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
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">R</label>
                          <select
                            value={prescriptionData.axisR}
                            onChange={(e) => setPrescriptionData(prev => ({...prev, axisR: e.target.value}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {AXIS_VALUES.map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">L</label>
                          <select
                            value={prescriptionData.axisL}
                            onChange={(e) => setPrescriptionData(prev => ({...prev, axisL: e.target.value}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          <div className="space-y-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">R</label>
                              <div className="flex">
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
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">L</label>
                              <div className="flex">
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
                      <div className="grid grid-cols-3 gap-4">
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
                        ? 'bg-green-600 text-white hover:bg-green-700'
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{prescriptionOption === 'saved' ? 'Using saved prescription values' : 'Manual prescription values entered'}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {selectedLensType} lens prescription completed
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Lens Selection */}
          {showLensSelectionStep && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 text-white" style={{backgroundColor: '#363434'}}>
                    3
                  </div>
                  <h2 className="text-lg font-semibold">Lens Selection</h2>
                </div>
                <button 
                  onClick={() => setShowLensSelectionStep(false)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Lens Filter Tabs */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  {/* Brand Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hãng</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả hãng</option>
                      <option value="essilor">Essilor</option>
                      <option value="zeiss">Zeiss</option>
                      <option value="hoya">Hoya</option>
                      <option value="rodenstock">Rodenstock</option>
                    </select>
                  </div>

                  {/* Thickness Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ dày</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả độ dày</option>
                      <option value="thin">Mỏng (1.56)</option>
                      <option value="medium">Trung bình (1.60)</option>
                      <option value="thick">Dày (1.67)</option>
                      <option value="ultra-thin">Siêu mỏng (1.74)</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả mức giá</option>
                      <option value="under-1m">Dưới 1 triệu</option>
                      <option value="1m-2m">1 - 2 triệu</option>
                      <option value="2m-3m">2 - 3 triệu</option>
                      <option value="over-3m">Trên 3 triệu</option>
                    </select>
                  </div>
                </div>

                {/* Lens Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tròng kính phù hợp</h3>
                    {lensesLoading && (
                      <div className="text-sm text-gray-600">Đang tìm kiếm...</div>
                    )}
                  </div>
                  
                  {/* Loading state */}
                  {lensesLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}

                  {/* No results */}
                  {!lensesLoading && filteredLenses.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-2">Không tìm thấy tròng kính phù hợp</div>
                      <div className="text-sm text-gray-400">Vui lòng thử điều chỉnh các thông số đo mắt</div>
                    </div>
                  )}

                  {/* Lens grid */}
                  {!lensesLoading && filteredLenses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredLenses.map((lens) => (
                        <div key={lens.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{lens.name}</h4>
                            <span className="text-lg font-semibold text-green-600">
                              {lens.basePrice.toLocaleString('vi-VN')}₫
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
                            <div className="mb-2">
                              <img 
                                src={lens.imageUrl} 
                                alt={lens.name}
                                className="w-full h-32 object-cover rounded"
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
                              {lens.status === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
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
                        Trước
                      </button>
                      
                      <span className="text-sm text-gray-600">
                        Trang {currentPage} / {totalPages}
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
                        Tiếp
                      </button>
                    </div>
                  )}
                </div>

                <button className="w-full mt-6 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Thêm vào giỏ hàng
                </button>
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
                      src={selectedProduct.thumbnailUrl || 
                           "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=250&fit=crop&crop=center"} 
                      alt={selectedProduct.displayName}
                      className="w-full h-56 object-contain bg-gray-50 rounded-lg"
                    />
                    <p className="text-base text-gray-600 text-center mt-3 font-medium">
                      {selectedProduct.brandName} | {selectedProduct.displayName}
                    </p>
                  </>
                ) : (
                  <>
                    <img 
                      src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=250&fit=crop&crop=center" 
                      alt="Đang tải..."
                      className="w-full h-56 object-contain bg-gray-50 rounded-lg animate-pulse"
                    />
                    <p className="text-base text-gray-600 text-center mt-3 font-medium">
                      Đang tải thông tin sản phẩm...
                    </p>
                  </>
                )}
              </div>

              {/* Price Details */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Chi tiết giá</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Gọng kính</span>
                    <span className="font-semibold text-lg">
                      {selectedProduct?.price ? `${Number(selectedProduct.price).toLocaleString('vi-VN')}₫` : '0₫'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 pl-0">
                    {selectedProduct?.displayName || 'Chưa chọn gọng kính'}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Loại tròng</span>
                    <span className="font-semibold text-lg">
                      {selectedLensType === 'SINGLE_VISION' ? 'Miễn phí' :
                       selectedLensType === 'PROGRESSIVE' ? '1.800.000₫' :
                       selectedLensType === 'OFFICE' ? '2.300.000₫' :
                       selectedLensType === 'DRIVE_SAFE' ? '2.100.000₫' :
                       'Miễn phí'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 pl-0">
                    {selectedLensType === 'SINGLE_VISION' ? 'Tròng đơn tròng' :
                     selectedLensType === 'PROGRESSIVE' ? 'Tròng đa tròng' :
                     selectedLensType === 'OFFICE' ? 'Tròng văn phòng' :
                     selectedLensType === 'DRIVE_SAFE' ? 'Tròng lái xe an toàn' :
                     selectedLensType === 'NON_PRESCRIPTION' ? 'Không có độ' :
                     'Chọn loại tròng kính'}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-base">Giao hàng (7-15 ngày)</span>
                    <span className="font-semibold text-green-600 text-lg">Miễn phí</span>
                  </div>
                </div>
                
                <hr className="my-6" />
                
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-xl text-gray-900">Tổng cộng</span>
                  <span className="font-bold text-2xl" style={{color: '#363434'}}>
                    {((Number(selectedProduct?.price) || 0) + (
                      selectedLensType === 'PROGRESSIVE' ? 1800000 :
                      selectedLensType === 'OFFICE' ? 2300000 :
                      selectedLensType === 'DRIVE_SAFE' ? 2100000 :
                      0
                    )).toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <p className="text-sm text-gray-500">Đã bao gồm VAT</p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center text-blue-700">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-base font-semibold">Mua sắm trực tuyến an toàn</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-base">Giao hàng nhanh miễn phí</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-base">Bảo hành đổi trả 30 ngày</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-base">Hơn 15 năm kinh nghiệm chuyên nghiệp</span>
                </div>

                <div className="flex items-center justify-center py-5">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 text-xl">★</span>
                    <span className="text-base font-medium">Matnice Reviews</span>
                    <span className="text-xs bg-green-600 text-white px-3 py-1 rounded">UY TÍN & CHẤT LƯỢNG</span>
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

      <Footer />
    </div>
  );
};

export default LensSelectionPage;
