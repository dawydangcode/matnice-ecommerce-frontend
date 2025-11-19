import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import { apiService } from '../services/api.service';
import { formatVND } from '../utils/currency';
import '../styles/ProductDetailPage.css';
import { ShoppingCart, RefreshCcw, Package, CircleCheck, CircleX } from 'lucide-react';

interface LensImage {
  id: string;
  imageUrl: string;
  imageOrder: string;
  isThumbnail: boolean;
}

interface LensBrand {
  id: string;
  name: string;
  description?: string;
}

interface LensCategory {
  id: string;
  name: string;
  description?: string;
}

interface LensThickness {
  id: string;
  name: string;
  indexValue: number;
  price: string;
  description: string;
}

interface RefractionRange {
  id: string;
  refractionType: string;
  minValue: string;
  maximumValue: string;
  stepValue: string;
}

interface LensVariant {
  id: string;
  lensThicknessId: string;
  design: string;
  material: string;
  price: string;
  stock: number;
  refractionRanges: RefractionRange[];
  tintColors: any[];
  lensThickness: LensThickness;
}

interface LensCoating {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface LensSummary {
  totalVariants: number;
  totalCoatings: number;
  totalImages: number;
  priceRange: { min: number; max: number };
  availableStock: number;
}

interface LensDetail {
  id: string;
  name: string;
  origin: string;
  lensType: string;
  status: string;
  description: string;
  createdAt: string;
  brandLens: LensBrand;
}

interface LensFullDetails {
  lens: LensDetail;
  categories: LensCategory[];
  variants: LensVariant[];
  coatings: LensCoating[];
  images: LensImage[];
  summary: LensSummary;
}

const LensDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<LensFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Option selections
  const [selectedThickness, setSelectedThickness] = useState<string>('');
  const [selectedCoating, setSelectedCoating] = useState<string>('');

  // Gallery slideshow states for mobile
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState({
    dimensions: false,
    properties: false,
    description: false,
    manufacturer: false,
    safety: false
  });

  // Computed values
  const sortedVariants = data?.variants ? 
    [...data.variants].sort((a, b) => a.lensThickness.indexValue - b.lensThickness.indexValue) : 
    [];

  // Touch handlers for mobile gallery swipe
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleGalleryTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
  };

  const handleGalleryTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const images = data?.images || [];
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    setIsTransitioning(true);
    
    if (isLeftSwipe) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe) {
      setCurrentImageIndex(prev => prev - 1);
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Handle infinite loop: reset position when reaching clones
  useEffect(() => {
    const images = data?.images || [];
    if (images.length === 0) return;

    if (currentImageIndex === images.length + 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(1);
      }, 300);
    }
    
    if (currentImageIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(images.length);
      }, 300);
    }
  }, [currentImageIndex, data?.images]);

  // Re-enable transition after jumping
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Reset image index when thickness changes
  useEffect(() => {
    setCurrentImageIndex(1);
    setIsTransitioning(true);
  }, [selectedThickness]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await apiService.get<LensFullDetails>(`/api/v1/lens/${id}/full-details`);
        setData(json);
        // Default selections - chọn variant có stock > 0
        if (json.variants && json.variants.length > 0) {
          const availableVariant = json.variants.find(v => v.stock > 0);
          if (availableVariant) {
            setSelectedThickness(availableVariant.lensThickness?.id || '');
          } else {
            // Nếu tất cả đều hết hàng, chọn cái đầu tiên
            setSelectedThickness(json.variants[0].lensThickness?.id || '');
          }
        }
        if (json.coatings && json.coatings.length > 0) {
          setSelectedCoating(json.coatings[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const formatVNDLocal = (price: string | number) => {
    return formatVND(typeof price === 'string' ? parseFloat(price) : price);
  };

  // Calculate total price based on selections
  const getTotalPrice = () => {
    let total = 0;
    
    // Base price from selected variant
    const selectedVariant = variants.find(v => v.lensThickness.id === selectedThickness);
    if (selectedVariant) {
      total += parseFloat(selectedVariant.price || '0');
      total += parseFloat(selectedVariant.lensThickness.price || '0');
    }
    
    // Add coating price
    const selectedCoatingData = coatings.find(c => c.id === selectedCoating);
    if (selectedCoatingData) {
      total += parseFloat(selectedCoatingData.price || '0');
    }
    
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg">Đang tải...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg text-red-600">{error || 'Không tìm thấy sản phẩm'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const { lens, images, variants, coatings } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-grow">
        <div className="product-detail-container">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="gallery-custom-layout">
              {(() => {
                const imageMap = images.reduce((acc: any, img: any) => {
                  acc[img.imageOrder] = img;
                  return acc;
                }, {});

                // Create array for slideshow with clones for infinite loop
                const slideshowImages = images.length > 0 
                  ? [images[images.length - 1], ...images, images[0]]
                  : [];

                return (
                  <>
                    {/* Mobile Slideshow */}
                    <div className="md:hidden relative">
                      <div 
                        className="relative overflow-hidden"
                        onTouchStart={handleGalleryTouchStart}
                        onTouchMove={handleGalleryTouchMove}
                        onTouchEnd={handleGalleryTouchEnd}
                      >
                        <div 
                          className="flex"
                          style={{
                            transform: `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))`,
                            transition: isTransitioning && !isDragging ? 'transform 0.3s ease-out' : 'none'
                          }}
                        >
                          {slideshowImages.map((img, idx) => (
                            <div key={`slide-${idx}`} className="w-full flex-shrink-0">
                              <img 
                                src={img.imageUrl} 
                                alt={lens.name}
                                className="w-full h-auto object-cover"
                                style={{ aspectRatio: '4/3' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dots Navigation */}
                      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentImageIndex === idx + 1 
                                ? 'bg-white w-6' 
                                : 'bg-white/50'
                            }`}
                            onClick={() => {
                              setIsTransitioning(true);
                              setCurrentImageIndex(idx + 1);
                            }}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div className="hidden md:block">
                      <div className="gallery-row gallery-row-2">
                        {imageMap['a'] && (
                          <div className="gallery-item">
                            <img src={imageMap['a'].imageUrl} alt={lens.name} loading="eager" />
                          </div>
                        )}
                        {imageMap['b'] && (
                          <div className="gallery-item">
                            <img src={imageMap['b'].imageUrl} alt={lens.name} loading="lazy" />
                          </div>
                        )}
                      </div>

                      <div className="gallery-row gallery-row-2">
                        {imageMap['c'] && (
                          <div className="gallery-item">
                            <img src={imageMap['c'].imageUrl} alt={lens.name} loading="lazy" />
                          </div>
                        )}
                        {imageMap['d'] && (
                          <div className="gallery-item">
                            <img src={imageMap['d'].imageUrl} alt={lens.name} loading="lazy" />
                          </div>
                        )}
                      </div>

                      {imageMap['e'] && (
                        <div className="gallery-row gallery-row-1">
                          <div className="gallery-item">
                            <img src={imageMap['e'].imageUrl} alt={lens.name} loading="lazy" />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Category and Brand Breadcrumb */}
            <div className="product-category">
              Lens / {lens.brandLens?.name}
            </div>

            {/* Brand and Product Name */}
            <h1 className="product-brand">{lens.brandLens?.name}</h1>
            <h2 className="product-name">{lens.name}</h2>

            {/* Lens Thickness Selection */}
            <div className="color-section">
              <label className="section-label">Chiết suất: {sortedVariants.find(v => v.lensThickness.id === selectedThickness)?.lensThickness.indexValue || ''}</label>
              <div className="product-color-options">
                {sortedVariants.map(v => {
                  const isOutOfStock = v.stock === 0;
                  return (
                    <button
                      key={v.lensThickness.id}
                      className={`product-color-option ${selectedThickness === v.lensThickness.id ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                      onClick={() => !isOutOfStock && setSelectedThickness(v.lensThickness.id)}
                      title={`${v.lensThickness.indexValue}${isOutOfStock ? ' (Hết hàng)' : ''}`}
                      disabled={isOutOfStock}
                    >
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm font-medium">{v.lensThickness.indexValue}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coating Selection */}
            <div className="frame-width-section">
              <label className="section-label">Lớp phủ</label>
              <div className="flex gap-2 flex-wrap">
                {coatings.map(c => (
                  <button
                    key={c.id}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedCoating === c.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCoating(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="stock-status text-gray-900 mt-4">
                {variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 ? (
                  <>
                    <CircleX size={20} className="inline mr-1" style={{ color: '#dc2626' }} />
                    Hết hàng
                  </>
                ) : (
                  <>
                    <CircleCheck size={20} className="inline mr-1" style={{ color: '#059669' }} />
                    Còn {variants.find(v => v.lensThickness.id === selectedThickness)?.stock || 0} sản phẩm
                  </>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="pricing-section">
              <div className="price-row">
                <span className="price-label">Giá tròng kính</span>
                <span className="price-value">{formatVNDLocal(getTotalPrice())}</span>
              </div>
              <div className="vat-note">VAT đã bao gồm</div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className={`btn-primary ${variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 ? 'disabled' : ''}`}
                disabled={variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0}
              >
                <ShoppingCart className="icon-inline" size={24} />
                {variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </button>
              <div className="divider">hoặc</div>
              <button className="btn-outline">Tư vấn thêm</button>
            </div>

            {/* Delivery Times */}
            <div className="delivery-info">
              <h3 className="delivery-title">Thời gian giao hàng</h3>
              <div className="delivery-option">
                <span className="delivery-icon">👓</span>
                <span className="delivery-text">Tròng kính có độ</span>
                <span className="delivery-time">7 - 15 ngày</span>
              </div>
              <div className="delivery-option">
                <span className="delivery-icon">📦</span>
                <span className="delivery-text">Giao hàng tiêu chuẩn</span>
                <span className="delivery-time">3 - 5 ngày</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <span className="trust-icon"><RefreshCcw /></span>
                <span className="trust-text">Đổi trả trong 30 ngày</span>
              </div>
              <div className="trust-badge">
                <span className="trust-icon"><Package /></span>
                <span className="trust-text">Sản phẩm có sẵn trong kho</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details-section">
          <div className="product-details-container-full">
            <header className="product-details-header">
              <h2 className="product-details-title">Thông tin chi tiết</h2>
            </header>
            
            <div className="product-details-accordions">
              {/* Description Accordion */}
              <div className="accordion-item">
                <button 
                  className="accordion-button"
                  onClick={() => setAccordionOpen(prev => ({ ...prev, description: !prev.description }))}
                  aria-expanded={accordionOpen.description}
                >
                  <div className="accordion-label">
                    <h3>Mô tả sản phẩm</h3>
                  </div>
                  <div className="accordion-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 12h17M12 20.5v-17" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
                {accordionOpen.description && (
                  <div className="accordion-content">
                    <div className="description-content">
                      <p className="text-gray-700 leading-relaxed mb-6">{lens.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Xuất xứ:</span> {lens.origin}
                        </div>
                        <div>
                          <span className="font-medium">Loại tròng:</span> {lens.lensType}
                        </div>
                        <div>
                          <span className="font-medium">Tình trạng:</span> {lens.status === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
                        </div>
                        <div>
                          <span className="font-medium">Thương hiệu:</span> {lens.brandLens?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Specs Accordion */}
              <div className="accordion-item">
                <button 
                  className="accordion-button"
                  onClick={() => setAccordionOpen(prev => ({ ...prev, properties: !prev.properties }))}
                  aria-expanded={accordionOpen.properties}
                >
                  <div className="accordion-label">
                    <h3>Thông số kỹ thuật</h3>
                  </div>
                  <div className="accordion-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 12h17M12 20.5v-17" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
                {accordionOpen.properties && (
                  <div className="accordion-content">
                    <div className="properties-content">
                      <div className="space-y-4">
                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Thương hiệu tròng</span>
                          <span className="text-gray-900">{lens.brandLens?.name}</span>
                        </div>
                        
                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Chiết suất</span>
                          <span className="text-gray-900">
                            {sortedVariants.map(v => v.lensThickness.indexValue).join(', ')}
                          </span>
                        </div>
                        
                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Loại tròng kính</span>
                          <span className="text-gray-900">
                            {lens.lensType === 'SINGLE_VISION' ? 'Đơn tròng' : 
                             lens.lensType === 'PROGRESSIVE' ? 'Đa tròng' : 
                             lens.lensType === 'OFFICE' ? 'Văn phòng' :
                             lens.lensType === 'DRIVE_SAFE' ? 'Lái xe an toàn' :
                             lens.lensType === 'NON_PRESCRIPTION' ? 'Không độ' : lens.lensType}
                          </span>
                        </div>
                        
                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Tính năng</span>
                          <span className="text-gray-900">
                            {data.categories.map(cat => cat.name).join(', ') || 'Không có thông tin'}
                          </span>
                        </div>
                        
                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Lớp phủ</span>
                          <span className="text-gray-900">
                            {coatings.map(c => c.name).join(', ') || 'Không có thông tin'}
                          </span>
                        </div>

                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Chất liệu</span>
                          <span className="text-gray-900">
                            {sortedVariants.map(v => v.material).filter((value, index, self) => self.indexOf(value) === index).join(', ')}
                          </span>
                        </div>

                        <div className="flex py-3 border-b border-gray-100">
                          <span className="w-48 font-medium text-gray-700">Phạm vi độ cận</span>
                          <span className="text-gray-900">
                            {variants[0]?.refractionRanges?.map(r => 
                              `${r.refractionType}: ${r.minValue} đến ${r.maximumValue} (bước ${r.stepValue})`
                            ).join(', ') || 'Không có thông tin'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manufacturer Information Accordion */}
              <div className="accordion-item">
                <button 
                  className="accordion-button"
                  onClick={() => setAccordionOpen(prev => ({ ...prev, manufacturer: !prev.manufacturer }))}
                  aria-expanded={accordionOpen.manufacturer}
                >
                  <div className="accordion-label">
                    <h3>Thông tin nhà sản xuất</h3>
                  </div>
                  <div className="accordion-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 12h17M12 20.5v-17" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
                {accordionOpen.manufacturer && (
                  <div className="accordion-content">
                    <div className="manufacturer-content">
                      <p>Thông tin nhà sản xuất:</p>
                      <p>Thương hiệu: {lens.brandLens?.name}</p>
                      <p>Xuất xứ: {lens.origin}</p>
                      <p>Liên hệ: support@matnice.com</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Care Instructions Accordion */}
              <div className="accordion-item">
                <button 
                  className="accordion-button"
                  onClick={() => setAccordionOpen(prev => ({ ...prev, safety: !prev.safety }))}
                  aria-expanded={accordionOpen.safety}
                >
                  <div className="accordion-label">
                    <h3>Hướng dẫn bảo quản</h3>
                  </div>
                  <div className="accordion-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 12h17M12 20.5v-17" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
                {accordionOpen.safety && (
                  <div className="accordion-content">
                    <div className="safety-content">
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Vệ sinh tròng kính bằng nước sạch và dung dịch chuyên dụng</li>
                        <li>Sử dụng khăn mềm, không xơ để lau khô</li>
                        <li>Tránh để tròng kính tiếp xúc với nhiệt độ cao</li>
                        <li>Bảo quản trong hộp đựng khi không sử dụng</li>
                        <li>Kiểm tra định kỳ để phát hiện sớm các vết xước hoặc hư hỏng</li>
                        <li>Tránh sử dụng các chất tẩy rửa mạnh</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LensDetailPage;
