import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VirtualTryOnImage from '../assets/Virtual-Eyewear-Try-On.jpg';
import WomenGlassesImage from '../assets/home-page-image/cd72032b96f1b3bf579e848b96fe6aaf.jpg';
import MenGlassesImage from '../assets/home-page-image/8de8cf9366092e37a8d5b2e9148e577b.jpg';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import '../styles/scrollbar.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 because we have a clone before
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

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

      {/* Bestsellers Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12">Bestsellers</h2>
          
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-4 md:gap-6 pb-4">
              {/* Product 1 */}
              <div className="group cursor-pointer flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    -25%
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs rounded">
                    Boutique
                  </div>
                  <div className="absolute top-4 right-16">
                    <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                  </div>
                  <img 
                    src="/api/placeholder/250/200" 
                    alt="Miu Miu glasses"
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Miu Miu</h3>
                  <p className="text-gray-600 text-sm">MU 11WS 1AB5S0</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 line-through text-sm">10.798.500₫</span>
                    <span className="font-bold text-lg">8.098.500₫</span>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="group cursor-pointer flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    -30%
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs rounded">
                    Boutique
                  </div>
                  <div className="absolute top-4 right-16">
                    <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                  </div>
                  <img 
                    src="/api/placeholder/250/200" 
                    alt="Saint Laurent glasses"
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Saint Laurent</h3>
                  <p className="text-gray-600 text-sm">SL M115 004</p>
                  <p className="text-sm text-gray-500">Prescription-ready</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 line-through text-sm">8.938.500₫</span>
                    <span className="font-bold text-lg">6.253.500₫</span>
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="group cursor-pointer flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    -25%
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-xs rounded">
                    Boutique
                  </div>
                  <div className="absolute top-4 right-16">
                    <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                  </div>
                  <img 
                    src="/api/placeholder/250/200" 
                    alt="Tom Ford sunglasses"
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Tom Ford</h3>
                  <p className="text-gray-600 text-sm">Bronson FT 1044 01E</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 line-through text-sm">11.218.500₫</span>
                    <span className="font-bold text-lg">6.163.500₫</span>
                  </div>
                </div>
              </div>

              {/* Product 4 */}
              <div className="group cursor-pointer flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                <div className="relative bg-gray-100 rounded-2xl p-8 mb-4">
                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition" />
                  </div>
                  <img 
                    src="/api/placeholder/250/200" 
                    alt="Boss glasses"
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Boss</h3>
                  <p className="text-gray-600 text-sm">BV 1033 R80</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">5.698.500₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* View more button */}
          <div className="text-center mt-8 md:mt-12">
            <button 
              className="w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="View more products"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
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
