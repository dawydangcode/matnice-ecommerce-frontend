import React from 'react';

interface HeroContentProps {
  title: string;
  description: string;
  heroImage?: string;
  backgroundColor?: string;
  categories?: Array<{
    name: string;
    href: string;
  }>;
}

const HeroContent: React.FC<HeroContentProps> = ({
  title,
  description,
  heroImage,
  backgroundColor = "from-green-200 to-green-400",
  categories = []
}) => {
  return (
    <section className="relative bg-gray-100 pt-10 overflow-hidden">
      {/* Background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundColor}`}></div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {description}
            </p>
            
            {/* Categories Navigation */}
            {categories.length > 0 && (
              <div className="pt-4">
                <div className="flex flex-wrap gap-3">
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={category.href}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-xs font-medium"
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
                className="w-full h-64 object-cover shadow-lg"
              />
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
