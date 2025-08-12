import React from 'react';
import HeroContent from '../HeroContent';

const BrandsHeroContent: React.FC = () => {
  const brandCategories = [
    { name: "Ray-Ban", href: "/brands/ray-ban" },
    { name: "Tom Ford", href: "/brands/tom-ford" },
    { name: "Gucci", href: "/brands/gucci" },
    { name: "Prada", href: "/brands/prada" },
    { name: "Oakley", href: "/brands/oakley" },
    { name: "Saint Laurent", href: "/brands/saint-laurent" },
    { name: "All Brands", href: "/brands/all" }
  ];

  return (
    <HeroContent
      title="Brands"
      description="Discover premium eyewear from the world's most prestigious brands"
      heroImage="/api/placeholder/600/400"
      categories={brandCategories}
    />
  );
};

export default BrandsHeroContent;
