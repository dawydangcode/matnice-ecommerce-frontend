import React from 'react';
import { Lens } from '../../types/lens.types';
import LensListPage from './LensListPage';

const LensManagementDashboard: React.FC = () => {
  const handleEditLens = (lens: Lens) => {
    // Handle edit logic - có thể navigate đến trang edit hoặc mở modal
    console.log('Edit lens:', lens);
  };

  const handleCreateLens = () => {
    // Handle create logic - có thể navigate đến trang create hoặc mở modal
    console.log('Create new lens');
  };

  const handleCreateLensAdvanced = () => {
    // Có thể redirect đến trang khác hoặc mở form nâng cao
    console.log('Create advanced lens');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LensListPage
          onEditLens={handleEditLens}
          onCreateLens={handleCreateLens}
          onCreateLensAdvanced={handleCreateLensAdvanced}
        />
      </div>
    </div>
  );
};

export default LensManagementDashboard;
