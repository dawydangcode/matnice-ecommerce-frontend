import React from 'react';

interface HeroContentProps {
  title: string;
  description: string;
  heroImage?: string;
  categories?: Array<{
    name: string;
    href: string;
  }>;
}

const HeroContent: React.FC<HeroContentProps> = ({
  title,
  description,
  heroImage,
  categories = []
}) => {
  return (
    <section className="relative bg-gray-100 py-16 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/80"></div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
            
            {/* Categories Navigation */}
            {categories.length > 0 && (
              <div className="pt-6">
                <div className="flex flex-wrap gap-4">
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={category.href}
                      className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Image */}
          {heroImage && (
            <div className="relative">
              <img 
                src={heroImage}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
