import React from 'react';
import { Link } from 'react-router-dom';
import { LensCard as LensCardType, LensType } from '../types/lensCard.types';

interface LensCardProps {
  lens: LensCardType;
}

const LensCard: React.FC<LensCardProps> = ({ lens }) => {
  // Get lens type display name
  const getLensTypeDisplayName = (type?: LensType): string => {
    if (!type) return 'Standard Lens';
    
    const typeNames: Record<LensType, string> = {
      [LensType.SINGLE_VISION]: 'Single Vision',
      [LensType.DRIVE_SAFE]: 'Drive Safe',
      [LensType.PROGRESSIVE]: 'Progressive',
      [LensType.OFFICE]: 'Office',
      [LensType.NON_PRESCRIPTION]: 'Non-Prescription',
    };
    return typeNames[type] || type;
  };

  // Get primary image (with orderImage 'a')
  const getPrimaryImage = (): string | null => {
    if (!lens.images || lens.images.length === 0) return null;
    
    // Find image with orderImage 'a'
    const primaryImage = lens.images.find(img => img.orderImage === 'a');
    if (primaryImage) return primaryImage.imageUrl;
    
    // If no 'a' image, return first image
    return lens.images[0]?.imageUrl || null;
  };

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const primaryImageUrl = getPrimaryImage();

  return (
    <Link
      to={`/lenses/${lens.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {primaryImageUrl ? (
          <img
            src={primaryImageUrl}
            alt={lens.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <div className="text-sm text-gray-500 mb-1">
          {lens.brandLens?.name || 'Unknown Brand'}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {lens.name}
        </h3>

        {/* Type */}
        <div className="text-sm text-blue-600 mt-1 mb-2">
          {getLensTypeDisplayName(lens.type)}
        </div>

        {/* Category */}
        <div className="text-sm text-gray-500 mb-2">
          Category: {lens.categoryLens?.name || 'Uncategorized'}
        </div>

        {/* Description */}
        {lens.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {lens.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(lens.basePrice)}
          </div>
          <div className="text-sm text-gray-500">
            Starting from
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-3 text-center">
          <span className="text-sm text-blue-600 group-hover:text-blue-700 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default LensCard;
