import React from 'react';
import HeroContent from '../HeroContent';

const BoutiqueHeroContent: React.FC = () => {
  const boutiqueCategories = [
    { name: "Limited Edition", href: "/boutique/limited-edition" },
    { name: "Handcrafted", href: "/boutique/handcrafted" },
    { name: "Exclusive Designs", href: "/boutique/exclusive" },
    { name: "Vintage Collection", href: "/boutique/vintage" },
    { name: "Artisan Frames", href: "/boutique/artisan" },
    { name: "Custom Made", href: "/boutique/custom" }
  ];

  return (
    <HeroContent
      title="Boutique"
      description="Exclusive and unique eyewear pieces crafted with exceptional attention to detail"
      heroImage="/api/placeholder/600/400"
      categories={boutiqueCategories}
    />
  );
};

export default BoutiqueHeroContent;
