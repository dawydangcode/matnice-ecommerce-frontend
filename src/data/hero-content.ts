// Hero content mapping for different categories
export interface HeroContentData {
  title: string;
  description: string;
  heroImage?: string;
  backgroundColor: string;
}

export const glassesHeroContent: Record<string, HeroContentData> = {
  // Default glasses
  default: {
    title: 'Glasses',
    description:
      'Browse our complete range of prescription glasses for every style and occasion.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-blue-200 to-blue-400',
  },

  // Category filters
  'all-glasses': {
    title: 'Glasses',
    description:
      'Browse our complete range of prescription glasses for every style and occasion.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-purple-200 to-purple-400',
  },

  'womens-glasses': {
    title: "Women's Glasses",
    description:
      "Elegant and fashionable frames designed specifically for women's unique style preferences.",
    heroImage: '/assets/categories-hero-content/womens_glasses.jpg',
    backgroundColor: 'from-pink-200 to-pink-400',
  },

  'mens-glasses': {
    title: "Men's Glasses",
    description:
      "Strong, sophisticated frames that complement the modern man's lifestyle and personality.",
    heroImage: '/assets/categories-hero-content/mens_glasses.jpg',
    backgroundColor: 'from-gray-200 to-gray-400',
  },

  // Add specific glasses types
  varifocals: {
    title: 'Varifocal Glasses',
    description:
      'Progressive lenses that provide clear vision at all distances - near, intermediate, and far.',
    heroImage: '/assets/categories-hero-content/varifocal_glasses.jpg',
    backgroundColor: 'from-green-200 to-green-400',
  },

  'reading-glasses': {
    title: 'Reading Glasses',
    description:
      'Comfortable reading glasses designed to reduce eye strain and improve close-up vision.',
    heroImage: '/assets/categories-hero-content/reading_glasses.jpg',
    backgroundColor: 'from-amber-200 to-orange-400',
  },

  // Shape filters
  round: {
    title: 'Round Glasses',
    description:
      'Classic round frames that offer a timeless, intellectual look perfect for any face shape.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-yellow-200 to-orange-400',
  },

  square: {
    title: 'Square Glasses',
    description:
      'Bold square frames that provide a strong, confident appearance with modern appeal.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-red-200 to-red-400',
  },

  'cat-eye': {
    title: 'Cat Eye Glasses',
    description:
      'Vintage-inspired cat eye frames that add a touch of retro glamour to your look.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-purple-200 to-pink-400',
  },

  aviator: {
    title: 'Aviator Glasses',
    description:
      'Iconic aviator style frames that bring timeless cool to your everyday wear.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-green-200 to-blue-400',
  },
};

export const sunglassesHeroContent: Record<string, HeroContentData> = {
  default: {
    title: 'Sunglasses Collection',
    description:
      'Protect your eyes in style with our premium sunglasses collection.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-orange-200 to-yellow-400',
  },

  aviator: {
    title: 'Aviator Sunglasses',
    description: 'Classic aviator sunglasses that never go out of style.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-blue-200 to-indigo-400',
  },

  wayfarer: {
    title: 'Wayfarer Sunglasses',
    description: 'Iconic wayfarer style that suits every face and occasion.',
    heroImage:
      '/assets/categories-hero-content/boutique-slider-plp_brillen.jpg',
    backgroundColor: 'from-green-200 to-teal-400',
  },
};

export const lensesHeroContent: Record<string, HeroContentData> = {
  default: {
    title: 'Prescription Lenses',
    description:
      'Discover our premium collection of prescription lenses for clear vision and optimal eye health.',
    heroImage: '/assets/Lens_Product_Herocontent_1730x722.jpeg',
    backgroundColor: '#F0EDE9',
  },

  'single-vision': {
    title: 'Single Vision Lenses',
    description:
      'Perfect prescription lenses for near or far vision correction with exceptional clarity.',
    heroImage: '/assets/Lens_Product_Herocontent_1730x722.jpeg',
    backgroundColor: '#F0EDE9',
  },

  'drive-safe': {
    title: 'Drive Safe Lenses',
    description:
      'Specialized lenses designed for enhanced vision and safety while driving, day and night.',
    heroImage: '/assets/Lens_Product_Herocontent_1730x722.jpeg',
    backgroundColor: '#F0EDE9',
  },

  progressive: {
    title: 'Progressive Lenses',
    description:
      'Seamless multifocal lenses for clear vision at all distances without visible lines.',
    heroImage: '/assets/Lens_Product_Herocontent_1730x722.jpeg',
    backgroundColor: '#F0EDE9',
  },

  office: {
    title: 'Office Lenses',
    description:
      'Optimized lenses for computer work and office environments with reduced eye strain.',
    heroImage: '/assets/Lens_Product_Herocontent_1730x722.jpeg',
    backgroundColor: '#F0EDE9',
  },

  'non-prescription': {
    title: 'Non-Prescription Lenses',
    description:
      'Fashion lenses without prescription for style enhancement and eye protection.',
    heroImage: '/assets/Lens_Product_Herocontent_1730x722.jpeg',
    backgroundColor: '#F0EDE9',
  },
};

// Function to get hero content based on URL params
export const getHeroContent = (
  productType: 'glasses' | 'sunglasses' | 'contact-lenses' | 'lenses',
  params: URLSearchParams,
): HeroContentData => {
  if (productType === 'glasses') {
    // Check for specific category filters
    let category = params
      .get('category')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    // Handle special mappings
    if (category === 'women-s-glasses') category = 'womens-glasses';
    if (category === 'men-s-glasses') category = 'mens-glasses';

    const shape = params
      .get('shop_by_shape')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const faceShape = params
      .get('face_shape')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    // Priority: category > shape > face_shape > default
    const key = category || shape || faceShape || 'default';

    return glassesHeroContent[key] || glassesHeroContent.default;
  }

  if (productType === 'sunglasses') {
    const style = params
      .get('by_style')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const key = style || 'default';

    return sunglassesHeroContent[key] || sunglassesHeroContent.default;
  }

  if (productType === 'lenses' || productType === 'contact-lenses') {
    const type = params
      .get('type')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const category = params
      .get('category')
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    // Priority: type > category > default
    const key = type || category || 'default';

    return lensesHeroContent[key] || lensesHeroContent.default;
  }

  // Default fallback
  return {
    title: 'Our Products',
    description: 'Discover our amazing collection of eyewear.',
    backgroundColor: 'from-gray-200 to-gray-400',
  };
};
