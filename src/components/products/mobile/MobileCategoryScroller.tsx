import React from 'react';

interface MobileCategoryScrollerProps {
  productType: string;
}

const MobileCategoryScroller: React.FC<MobileCategoryScrollerProps> = ({ productType }) => {
  if (productType !== 'glasses' && productType !== 'sunglasses') {
    return null;
  }

  return (
    <div className="md:hidden bg-white border-b">
      <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 py-3">
        <div className="flex space-x-3">
          {productType === 'glasses' && (
            <>
              <a href="/glasses?category=all-glasses" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                All Glasses
              </a>
              <a href="/glasses?category=women-s-glasses" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Women's Glasses
              </a>
              <a href="/glasses?category=men-s-glasses" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Men's Glasses
              </a>
              <a href="/glasses?category=varifocals" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Varifocals
              </a>
              <a href="/glasses?category=reading" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Reading Glasses
              </a>
            </>
          )}
          {productType === 'sunglasses' && (
            <>
              <a href="/sunglasses" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Category
              </a>
              <a href="/sunglasses?category=all" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                All sunglasses
              </a>
              <a href="/sunglasses?category=women" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Women's Sunglasses
              </a>
              <a href="/sunglasses?category=men" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Men's Sunglasses
              </a>
              <a href="/sunglasses?category=prescription" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Prescription sunglasses
              </a>
              <a href="/sunglasses?category=outlet" className="snap-center flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Sunglasses Outlet
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryScroller;
