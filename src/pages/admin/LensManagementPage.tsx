import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Eye,
  Layers,
  Palette,
  Package,
  Grid3X3,
  Star,
  Sparkles
} from 'lucide-react';
import LensListPage from './LensListPage';
import LensQualityListPage from './LensQualityListPage';
import LensForm from '../../components/admin/LensForm';
import LensQualityForm from '../../components/admin/LensQualityForm';
import { Lens, LensQuality, CreateLensDto, CreateLensQualityDto } from '../../types/lens.types';
import { useLensStore } from '../../stores/lens.store';

// Lazy load components to avoid circular imports
const LensThicknessPage = React.lazy(() => import('./LensThicknessPage'));
const LensTintPage = React.lazy(() => import('./LensTintPage'));
const LensUpgradePage = React.lazy(() => import('./LensUpgradePage'));
const LensDetailPage = React.lazy(() => import('./LensDetailPage'));

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component?: React.ComponentType<any>;
  description: string;
  category?: string;
}

const LensManagementPage: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('lenses.basic');
  
  // State for lens CRUD operations
  const [showLensForm, setShowLensForm] = useState(false);
  const [editingLens, setEditingLens] = useState<Lens | null>(null);
  const [showLensQualityForm, setShowLensQualityForm] = useState(false);
  const [editingLensQuality, setEditingLensQuality] = useState<LensQuality | null>(null);

  const { createLens, updateLens, createLensQuality, updateLensQuality } = useLensStore();

  // Lens CRUD handlers
  const handleCreateLens = () => {
    setEditingLens(null);
    setShowLensForm(true);
  };

  const handleEditLens = (lens: Lens) => {
    setEditingLens(lens);
    setShowLensForm(true);
  };

  const handleLensFormSubmit = async (data: CreateLensDto) => {
    try {
      if (editingLens) {
        await updateLens(editingLens.id, data);
        toast.success('Lens updated successfully');
      } else {
        await createLens(data);
        toast.success('Lens created successfully');
      }
      setShowLensForm(false);
      setEditingLens(null);
    } catch (error) {
      console.error('Error saving lens:', error);
      toast.error('Error saving lens');
    }
  };

  const handleLensFormCancel = () => {
    setShowLensForm(false);
    setEditingLens(null);
  };

  // Lens Quality CRUD handlers
  const handleCreateLensQuality = () => {
    setEditingLensQuality(null);
    setShowLensQualityForm(true);
  };

  const handleEditLensQuality = (lensQuality: LensQuality) => {
    setEditingLensQuality(lensQuality);
    setShowLensQualityForm(true);
  };

  const handleLensQualityFormSubmit = async (data: CreateLensQualityDto) => {
    try {
      if (editingLensQuality) {
        await updateLensQuality(editingLensQuality.id, data);
        toast.success('Lens quality updated successfully');
      } else {
        await createLensQuality(data);
        toast.success('Lens quality created successfully');
      }
      setShowLensQualityForm(false);
      setEditingLensQuality(null);
    } catch (error) {
      console.error('Error saving lens quality:', error);
      toast.error('Error saving lens quality');
    }
  };

  const handleLensQualityFormCancel = () => {
    setShowLensQualityForm(false);
    setEditingLensQuality(null);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'lenses.basic',
      label: 'Basic Lens Types',
      icon: <Grid3X3 className="w-5 h-5" />,
      component: LensListPage,
      description: 'Single Vision, Progressive, Office lenses',
      category: 'Lens Types'
    },
    {
      id: 'lenses.thickness',
      label: 'Lens Thickness',
      icon: <Layers className="w-5 h-5" />,
      component: LensThicknessPage,
      description: 'Standard, Thin, Very Thin, Extra Thin options',
      category: 'Lens Types'
    },
    {
      id: 'lenses.details',
      label: 'Lens Details & Specs',
      icon: <Package className="w-5 h-5" />,
      component: LensDetailPage,
      description: 'Detailed lens specifications and configurations',
      category: 'Lens Types'
    },
    {
      id: 'quality.basic',
      label: 'Quality Options',
      icon: <Star className="w-5 h-5" />,
      component: LensQualityListPage,
      description: 'Classic, SpexPro, Premium quality options',
      category: 'Quality & Coatings'
    },
    {
      id: 'quality.tints',
      label: 'Tints & Colors',
      icon: <Palette className="w-5 h-5" />,
      component: LensTintPage,
      description: 'Polarised, Sunglasses, Gradient, etc.',
      category: 'Quality & Coatings'
    },
    {
      id: 'upgrades.features',
      label: 'Lens Upgrades',
      icon: <Sparkles className="w-5 h-5" />,
      component: LensUpgradePage,
      description: 'Blue Light Filter, Smart Focus, etc.',
      category: 'Premium Upgrades'
    }
  ];

  const getActiveComponent = () => {
    const activeMenu = menuItems.find(menu => menu.id === activeMenuItem);
    return activeMenu?.component || LensListPage;
  };

  const getActiveDescription = () => {
    const activeMenu = menuItems.find(menu => menu.id === activeMenuItem);
    return activeMenu?.description || 'Manage lens configurations';
  };

  const ActiveComponent = getActiveComponent();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Menu */}
      <div className="w-80 bg-white shadow-sm border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lens Management</h1>
              <p className="text-sm text-gray-600">Manage all lens configurations</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {/* Group by category */}
          {['Lens Types', 'Quality & Coatings', 'Premium Upgrades'].map((category) => (
            <div key={category} className="mb-6">
              {/* Category Header */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category}
              </div>
              
              {/* Menu Items in Category */}
              <div className="space-y-1">
                {menuItems
                  .filter(item => item.category === category)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenuItem(item.id)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                        ${activeMenuItem === item.id 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <div className={`
                        ${activeMenuItem === item.id ? 'text-blue-600' : 'text-gray-500'}
                      `}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Journey Info */}
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <h3 className="font-medium text-blue-900 mb-2 text-sm">Customer Journey:</h3>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">1</span>
              <span>Lens Type</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">2</span>
              <span>Prescription</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">3</span>
              <span>Thickness & Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">4</span>
              <span>Tint & Upgrades</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {menuItems.find(m => m.id === activeMenuItem)?.label || 'Lens Management'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {getActiveDescription()}
          </p>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <React.Suspense 
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            {activeMenuItem === 'lenses.basic' && <ActiveComponent onEditLens={handleEditLens} onCreateLens={handleCreateLens} />}
            {activeMenuItem === 'quality.basic' && <LensQualityListPage onEditLensQuality={handleEditLensQuality} onCreateLensQuality={handleCreateLensQuality} />}
            {activeMenuItem === 'lenses.thickness' && <LensThicknessPage />}
            {activeMenuItem === 'quality.tints' && <LensTintPage />}
            {activeMenuItem === 'upgrades.features' && <LensUpgradePage />}
            {activeMenuItem === 'lenses.details' && <LensDetailPage />}
          </React.Suspense>
        </div>
      </div>

      {/* Lens Form Modal */}
      {showLensForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingLens ? 'Chỉnh sửa kính' : 'Thêm kính mới'}
            </h2>
            <LensForm
              lens={editingLens}
              onSubmit={handleLensFormSubmit}
              onCancel={handleLensFormCancel}
            />
          </div>
        </div>
      )}

      {/* Lens Quality Form Modal */}
      {showLensQualityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingLensQuality ? 'Chỉnh sửa chất lượng kính' : 'Thêm chất lượng kính mới'}
            </h2>
            <LensQualityForm
              lensQuality={editingLensQuality}
              onSubmit={handleLensQualityFormSubmit}
              onCancel={handleLensQualityFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LensManagementPage;
