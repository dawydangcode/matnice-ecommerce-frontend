import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VirtualTryOnImage from '../assets/Virtual-Eyewear-Try-On.jpg';
import WomenGlassesImage from '../assets/home-page-image/cd72032b96f1b3bf579e848b96fe6aaf.jpg';
import MenGlassesImage from '../assets/home-page-image/8de8cf9366092e37a8d5b2e9148e577b.jpg';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import bestsellerService, { BestsellerProduct } from '../services/bestsellerService';
import { useWishlistStore } from '../stores/wishlist.store';
import { useAuthStore } from '../stores/auth.store';
import { toastService } from '../services/toast.service';
import { formatVND } from '../utils/currency';
import '../styles/scrollbar.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 because we have a clone before
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // Bestseller state
  const [bestsellers, setBestsellers] = useState<BestsellerProduct[]>([]);
  const [bestsellerLoading, setBestsellerLoading] = useState(true);
  const [bestsellerError, setBestsellerError] = useState<string | null>(null);

  // Wishlist store
  const { addToWishlist, removeItemByProductId, isItemInWishlist, fetchWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const heroSlides = [
    {
      id: 1,
      image: VirtualTryOnImage,
      title: "Find Your",
      highlight: "Perfect Glasses",
      description: "Tỏa sáng với mắt kính thông minh! AI 'soi' khuôn mặt, AR cho bạn thử kính ảo siêu chất. Chọn kính chuẩn gu, chuẩn dáng, chuẩn luôn tầm nhìn!",
      primaryBtn: { text: "Shop Glasses", link: "/glasses" },
      secondaryBtn: { text: "Try AI Fitting", link: "/ai" }
    },
    {
      id: 2,
      image: VirtualTryOnImage,
      title: "Gọng + Tròng",
      highlight: "Theo Đơn Mắt",
      description: "Đo mắt xong rồi? Chọn gọng yêu thích, chúng tôi tự động lọc tròng kính phù hợp với đơn mắt của bạn. Dễ dàng, chính xác, tiết kiệm thời gian!",
      primaryBtn: { text: "Xem Gọng Kính", link: "/glasses" },
      secondaryBtn: { text: "Tìm Hiểu Thêm", link: "/lens-selection" }
    },
    {
      id: 3,
      image: WomenGlassesImage,
      title: "Women's",
      highlight: "Collection 2025",
      description: "Khám phá bộ sưu tập kính mắt nữ mới nhất. Thiết kế thanh lịch, phong cách hiện đại, phù hợp với mọi khuôn mặt.",
      primaryBtn: { text: "Shop Women", link: "/glasses?category=women-s-glasses" },
      secondaryBtn: { text: "View Sunglasses", link: "/glasses?category=women-s-sunglasses" }
    },
    {
      id: 4,
      image: MenGlassesImage,
      title: "Men's",
      highlight: "Signature Style",
      description: "Bộ sưu tập kính nam sang trọng, lịch lãm. Từ classic đến trendy, tự tin thể hiện phong cách riêng của bạn.",
      primaryBtn: { text: "Shop Men", link: "/glasses?category=men-s-glasses" },
      secondaryBtn: { text: "View Sunglasses", link: "/glasses?category=men-s-sunglasses" }
    }
  ];

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  // Fetch bestsellers on mount
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setBestsellerLoading(true);
        setBestsellerError(null);
        const data = await bestsellerService.getBestsellers({ limit: 8 });
        setBestsellers(data);
      } catch (error) {
        console.error('Failed to fetch bestsellers:', error);
        setBestsellerError('Không thể tải sản phẩm bán chạy');
      } finally {
        setBestsellerLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  // Fetch wishlist when user is available
  useEffect(() => {
    if (user) {
      fetchWishlist().catch(error => {
        console.error('Error fetching wishlist:', error);
      });
    }
  }, [user, fetchWishlist]);

  // Handle wishlist toggle
  const handleWishlistToggle = async (productId: number, isInWishlist: boolean) => {
    if (!user) {
      toastService.warning('Please login to add items to wishlist');
      return;
    }

    try {
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

  // Handle infinite loop: reset position when reaching clones
  useEffect(() => {
    if (heroSlides.length === 0) return;

    // If we're at the clone at the end, jump to the real first slide
    if (currentSlide === heroSlides.length + 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 300); // Wait for transition to complete
    }
    
    // If we're at the clone at the start, jump to the real last slide
    if (currentSlide === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(heroSlides.length);
      }, 300); // Wait for transition to complete
    }
  }, [currentSlide, heroSlides.length]);

  // Re-enable transition after jumping
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index + 1); // +1 because of clone at start
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    setIsTransitioning(true);
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    // Reset
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        <Header />
        <Navigation />
      </header>

      {/* Hero Section - Slideshow */}
      <section className="relative h-auto md:h-[600px] bg-gray-50 overflow-hidden">
        <div 
          className="max-w-7xl mx-auto md:px-4 md:h-[550px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Container */}
          <div className="relative h-full min-h-[550px] md:min-h-0 overflow-hidden">
            <div 
              className="flex h-full"
              style={{
                transform: `translateX(calc(-${currentSlide * 100}% + ${isDragging ? dragOffset : 0}px))`,
                transition: isDragging || !isTransitioning ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {/* Clone of last slide (for infinite loop from first to last) */}
              {heroSlides.length > 0 && (
                <div
                  className="w-full flex-shrink-0"
                  style={{
                    display: 'block'
                  }}
                >
                <div className="flex flex-col md:flex-row items-center h-full md:gap-8 lg:gap-12">
                  <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2 mb-6 md:mb-0">
                    <div className="relative w-full md:max-w-none">
                      <img 
                        src={heroSlides[heroSlides.length - 1].image}
                        alt={`${heroSlides[heroSlides.length - 1].title} ${heroSlides[heroSlides.length - 1].highlight}`}
                        className="w-full h-[300px] md:h-[450px] object-cover md:object-contain"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6 md:space-y-8 order-2 md:order-1 px-4 py-6 md:px-0 md:py-0">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                        {heroSlides[heroSlides.length - 1].title}
                        <span className="block text-gray-900">{heroSlides[heroSlides.length - 1].highlight}</span>
                      </h1>
                      <p className="hidden md:block text-base sm:text-lg md:text-xl text-gray-600 mt-4 md:mt-6 leading-relaxed">
                        {heroSlides[heroSlides.length - 1].description}
                      </p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <Link 
                        to={heroSlides[heroSlides.length - 1].primaryBtn.link}
                        className="flex-1 bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg text-center"
                      >
                        {heroSlides[heroSlides.length - 1].primaryBtn.text}
                      </Link>
                      <Link 
                        to={heroSlides[heroSlides.length - 1].secondaryBtn.link}
                        className="flex-1 border-2 border-gray-900 text-gray-900 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors text-center"
                      >
                        {heroSlides[heroSlides.length - 1].secondaryBtn.text}
                      </Link>
                    </div>
                    <div className="hidden md:flex items-center justify-around sm:justify-start sm:space-x-8 mt-8 md:mt-12">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">10K+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">500+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Frame Styles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">50+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Premium Brands</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
              
              {/* Real slides */}
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0"
                  style={{
                    display: 'block'
                  }}
                >
                <div className="flex flex-col md:flex-row items-center h-full md:gap-8 lg:gap-12">
                  {/* Image First on Mobile, Second on Desktop */}
                  <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2 mb-6 md:mb-0">
                    <div className="relative w-full md:max-w-none">
                      <img 
                        src={slide.image}
                        alt={`${slide.title} ${slide.highlight}`}
                        className="w-full h-[300px] md:h-[450px] object-cover md:object-contain"
                      />
                    </div>
                  </div>

                  {/* Content Second on Mobile, First on Desktop */}
                  <div className="w-full md:w-1/2 space-y-6 md:space-y-8 order-2 md:order-1 px-4 py-6 md:px-0 md:py-0">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                        {slide.title}
                        <span className="block text-gray-900">{slide.highlight}</span>
                      </h1>
                      <p className="hidden md:block text-base sm:text-lg md:text-xl text-gray-600 mt-4 md:mt-6 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-row gap-3">
                      <Link 
                        to={slide.primaryBtn.link}
                        className="flex-1 bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg text-center"
                      >
                        {slide.primaryBtn.text}
                      </Link>
                      <Link 
                        to={slide.secondaryBtn.link}
                        className="flex-1 border-2 border-gray-900 text-gray-900 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors text-center"
                      >
                        {slide.secondaryBtn.text}
                      </Link>
                    </div>

                    <div className="hidden md:flex items-center justify-around sm:justify-start sm:space-x-8 mt-8 md:mt-12">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">10K+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">500+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Frame Styles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">50+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Premium Brands</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Clone of first slide (for infinite loop from last to first) */}
            {heroSlides.length > 0 && (
              <div
                className="w-full flex-shrink-0"
                style={{
                  display: 'block'
                }}
              >
              <div className="flex flex-col md:flex-row items-center h-full md:gap-8 lg:gap-12">
                <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2 mb-6 md:mb-0">
                  <div className="relative w-full md:max-w-none">
                    <img 
                      src={heroSlides[0].image}
                      alt={`${heroSlides[0].title} ${heroSlides[0].highlight}`}
                      className="w-full h-[300px] md:h-[450px] object-cover md:object-contain"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6 md:space-y-8 order-2 md:order-1 px-4 py-6 md:px-0 md:py-0">
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                      {heroSlides[0].title}
                      <span className="block text-gray-900">{heroSlides[0].highlight}</span>
                    </h1>
                    <p className="hidden md:block text-base sm:text-lg md:text-xl text-gray-600 mt-4 md:mt-6 leading-relaxed">
                      {heroSlides[0].description}
                    </p>
                  </div>
                  <div className="flex flex-row gap-3">
                    <Link 
                      to={heroSlides[0].primaryBtn.link}
                      className="flex-1 bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg text-center"
                    >
                      {heroSlides[0].primaryBtn.text}
                    </Link>
                    <Link 
                      to={heroSlides[0].secondaryBtn.link}
                      className="flex-1 border-2 border-gray-900 text-gray-900 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors text-center"
                    >
                      {heroSlides[0].secondaryBtn.text}
                    </Link>
                  </div>
                  <div className="hidden md:flex items-center justify-around sm:justify-start sm:space-x-8 mt-8 md:mt-12">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800">10K+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800">500+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Frame Styles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800">50+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Premium Brands</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
            </div>
          </div>
        </div>
        
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition z-20"
          aria-label="Previous slide"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button 
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                (currentSlide === index + 1 || 
                 (currentSlide === 0 && index === heroSlides.length - 1) ||
                 (currentSlide === heroSlides.length + 1 && index === 0))
                  ? 'bg-gray-900 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Find your new favourite glasses
            </h2>
            <button className="border border-gray-400 text-gray-700 px-4 md:px-6 py-2 rounded-full hover:bg-gray-100 transition text-sm md:text-base">
              Discover all glasses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Women Category */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[650px] rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src={WomenGlassesImage} 
                alt="Women glasses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Women</h3>
                <div className="space-y-2">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/glasses?category=women-s-glasses')}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl font-thin opacity-90">Glasses</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/glasses?category=women-s-sunglasses')}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl font-thin opacity-90">Sunglasses</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Men Category */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[650px] md:mt-12 rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src={MenGlassesImage} 
                alt="Men glasses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Men</h3>
                <div className="space-y-2">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/glasses?category=men-s-glasses')}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl font-thin opacity-90">Glasses</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/glasses?category=men-s-sunglasses')}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl font-thin opacity-90">Sunglasses</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section - Redesigned */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sản Phẩm Bán Chạy
            </h2>
          </div>

          {/* Loading State */}
          {bestsellerLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
            </div>
          )}

          {/* Error State */}
          {bestsellerError && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{bestsellerError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Products Carousel - Horizontal Scroll */}
          {!bestsellerLoading && !bestsellerError && (
            <>
              {/* Products Horizontal Scroll */}
              <div 
                className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                id="bestseller-carousel"
              >
                {bestsellers.map((product) => {
                  const productId = product.id;
                  const currentIsInWishlist = isItemInWishlist('product', productId);
                  
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover: transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0 snap-start"
                      style={{ width: 'calc(25% - 18px)', minWidth: '280px' }}
                    >
                      <div className="relative bg-gray-50 overflow-hidden flex items-center justify-center" style={{ height: '350px' }}>
                        {/* Badges */}
                        <div className="absolute top-6 left-6 flex flex-row space-x-2 z-10">
                          {product.isNew && (
                            <div className="bg-white text-green-700 px-4 py-2 text-sm font-medium rounded shadow-sm">
                              New
                            </div>
                          )}
                          {product.isBoutique && (
                            <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded shadow-sm">
                              Boutique
                            </div>
                          )}
                          {product.discountPercentage && (
                            <div className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded shadow-sm">
                              -{product.discountPercentage}%
                            </div>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <div className="absolute top-4 right-6 z-10">
                          <button
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-xl transition-all"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleWishlistToggle(productId, currentIsInWishlist);
                            }}
                          >
                            <Heart
                              className={`w-6 h-6 transition-colors ${
                                currentIsInWishlist
                                  ? 'text-red-500 fill-red-500'
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Product Image */}
                        <img
                          src={product.image || '/api/placeholder/400/320'}
                          alt={`${product.brand.name} ${product.productName}`}
                          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/320';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-6 space-y-3 bg-gray-50">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">
                            {product.brand.name}
                          </h3>
                          <p className="text-base text-gray-600 line-clamp-1 mt-1">
                            {product.productCode || product.productName}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-end">
                            <div className="text-right">
                              {product.discountPrice ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-gray-400 line-through text-sm">
                                    {formatVND(product.price)}
                                  </span>
                                  <span className="text-xl font-bold text-red-600">
                                    {formatVND(product.discountPrice)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xl font-bold text-gray-900">
                                  {formatVND(product.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Navigation Arrows - Below Carousel (Right Aligned, Hidden on Mobile) */}
              <div className="hidden md:flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    const carousel = document.getElementById('bestseller-carousel');
                    if (carousel) {
                      carousel.scrollBy({ left: -400, behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:bg-gray-50"
                  aria-label="Previous products"
                >
                  <ChevronRight className="w-6 h-6 transform rotate-180" />
                </button>

                <button
                  onClick={() => {
                    const carousel = document.getElementById('bestseller-carousel');
                    if (carousel) {
                      carousel.scrollBy({ left: 400, behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:bg-gray-50"
                  aria-label="Next products"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* View More Button */}
              <div className="text-center mt-12">
                <button
                  onClick={() => navigate('/glasses')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
                >
                  <span className="font-semibold">Xem Tất Cả Sản Phẩm</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
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
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Glasses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Sunglasses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Contact Lenses</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Brands</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">Returns</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <li><a href="#" className="hover:text-white">FAQ</a></li>
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

export default HomePage;
