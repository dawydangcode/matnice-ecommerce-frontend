import React from 'react';
import { Lens } from '../../types/lens.types';
import LensManagementPage from './LensManagementPage';

interface LensManagementDashboardProps {
  onCreateLens?: () => void;
  onViewLensDetail?: (lensId: number) => void;
}

const LensManagementDashboard: React.FC<LensManagementDashboardProps> = ({ 
  onCreateLens, 
  onViewLensDetail 
}) => {
  const handleEditLens = (lens: Lens) => {
    // Handle edit logic - có thể navigate đến trang edit hoặc mở modal
    console.log('Edit lens:', lens);
  };

  const handleCreateLens = () => {
    if (onCreateLens) {
      onCreateLens();
    } else {
      // Fallback: Handle create logic - có thể navigate đến trang create hoặc mở modal
      console.log('Create new lens');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LensManagementPage
          onCreateLensAdvanced={handleCreateLens}
          onViewLensDetail={onViewLensDetail}
        />
      </div>
    </div>
  );
};

export default LensManagementDashboard;
