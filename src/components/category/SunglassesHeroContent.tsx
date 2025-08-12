import React from 'react';
import HeroContent from '../HeroContent';

const SunglassesHeroContent: React.FC = () => {
  const sunglassesCategories = [
    { name: "Women's Sunglasses", href: "/sunglasses/women" },
    { name: "Men's Sunglasses", href: "/sunglasses/men" },
    { name: "Sport Sunglasses", href: "/sunglasses/sport" },
    { name: "Designer Sunglasses", href: "/sunglasses/designer" },
    { name: "Polarized Sunglasses", href: "/sunglasses/polarized" },
    { name: "Vintage Sunglasses", href: "/sunglasses/vintage" }
  ];

  return (
    <HeroContent
      title="Sunglasses"
      description="Protect your eyes in style with our premium collection of sunglasses"
      heroImage="/api/placeholder/600/400"
      categories={sunglassesCategories}
    />
  );
};

export default SunglassesHeroContent;
