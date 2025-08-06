import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Palette, Settings, Eye, Layers } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensTint, CreateLensTintDto, UpdateLensTintDto, TintColor, LensThickness } from '../../types/lens.types';
import { formatVNDWithSymbol } from '../../utils/currency';

const LensTintPage: React.FC = () => {
  const {
    lensTints,
    isLensTintLoading: loading,
    error,
    fetchLensTints,
    createLensTint,
    updateLensTint,
    deleteLensTint,
    lensThicknesses,
    fetchLensThicknesses,
  } = useLensStore();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LensTint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTint, setSelectedTint] = useState<LensTint | null>(null);
  const [showTintDetails, setShowTintDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'compatibility'>('overview');
  const [formData, setFormData] = useState<CreateLensTintDto>({
    name: '',
    description: '',
    price: 0,
  });

  // Predefined tint types from your customer journey
  const tintTypes = [
    {
      name: 'No Tint',
      description: 'Clear lenses without any tint',
      price: 0,
      color: 'transparent'
    },
    {
      name: 'Polarised Lenses',
      description: 'Minimise disruptive glare from reflective surfaces',
      price: 1498500, // 49.95 * 30000
      color: '#1f2937'
    },
    {
      name: 'Sunglasses Tint',
      description: 'Wear your glasses as sunglasses with 100% UV protection',
      price: 598500, // 19.95 * 30000
      color: '#374151'
    },
    {
      name: 'Gradient Tint',
      description: 'Darker at the top edge and gradually becomes lighter towards the bottom',
      price: 1348500, // 44.95 * 30000
      color: 'linear-gradient(to bottom, #374151, #f3f4f6)'
    },
    {
      name: 'Mirrored Lenses',
      description: 'Mirror effect for a stylish look and 100% UV protection',
      price: 1348500, // 44.95 * 30000
      color: '#c0392b'
    }
  ];

  useEffect(() => {
    fetchLensTints();
    fetchLensThicknesses();
  }, [fetchLensTints, fetchLensThicknesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateLensTint(editingItem.id, formData as UpdateLensTintDto);
      } else {
        await createLensTint(formData);
      }
      resetForm();
      fetchLensTints();
    } catch (error) {
      console.error('Error saving lens tint:', error);
    }
  };

  const handleEdit = (item: LensTint) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lens tint?')) {
      try {
        await deleteLensTint(id);
        fetchLensTints();
      } catch (error) {
        console.error('Error deleting lens tint:', error);
      }
    }
  };

  const handleQuickAdd = (tintType: typeof tintTypes[0]) => {
    setFormData({
      name: tintType.name,
      description: tintType.description,
      price: tintType.price,
    });
    setShowForm(true);
  };

  const handleViewTintDetails = (tint: LensTint) => {
    setSelectedTint(tint);
    setShowTintDetails(true);
    setActiveTab('overview');
  };

  const handleCloseTintDetails = () => {
    setSelectedTint(null);
    setShowTintDetails(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const filteredTints = lensTints.filter(tint =>
    tint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tint.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Main tint management view
  if (!showTintDetails) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lens Tint & Colors Management</h2>
            <p className="text-gray-600">Manage lens tinting options and color variants</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tint Option
          </button>
        </div>

        {/* Rest of main view content... */}
        {/* Quick Add Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Add Standard Tints</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {tintTypes.map((tintType, index) => (
              <button
                key={index}
                onClick={() => handleQuickAdd(tintType)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className={`w-4 h-4 rounded border border-gray-300 ${
                      tintType.name === 'No Tint' ? 'bg-white' :
                      tintType.name === 'Polarised Lenses' ? 'bg-gray-800' :
                      tintType.name === 'Sunglasses Tint' ? 'bg-gray-700' :
                      tintType.name === 'Gradient Tint' ? 'bg-gradient-to-b from-gray-700 to-gray-100' :
                      'bg-red-500'
                    }`}
                  />
                  <span className="font-medium text-sm">{tintType.name}</span>
                </div>
                <span className="text-xs text-green-600 font-medium">{formatVNDWithSymbol(Number(tintType.price || 0))}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search lens tints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTints.map((tint) => (
            <div key={tint.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{tint.name}</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewTintDetails(tint)}
                    title="Manage colors & compatibility"
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(tint)}
                    title="Edit tint"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tint.id)}
                    title="Delete tint"
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 min-h-[3rem]">
                {tint.description || 'No description'}
              </p>

              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-green-600">
                  {Number(tint.price) === 0 ? 'Free' : formatVNDWithSymbol(Number(tint.price || 0))}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Available
                </span>
              </div>

              {/* Quick info about colors and compatibility */}
              <div className="border-t pt-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    <span>0 colors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>0 compatible</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Lens Tint' : 'Add New Lens Tint'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tint Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Polarised Lenses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the tint benefits and features"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Detailed tint management view (colors + compatibility)
  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCloseTintDetails}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedTint?.name} - Management
          </h2>
          <p className="text-gray-600">Manage colors and thickness compatibility</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'colors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tint Colors
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compatibility'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thickness Compatibility
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tint Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{selectedTint?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-gray-900">
                  {Number(selectedTint?.price) === 0 ? 'Free' : formatVNDWithSymbol(Number(selectedTint?.price || 0))}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{selectedTint?.description || 'No description'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Color Variants</h4>
              <div className="text-center py-8 text-gray-500">
                <Palette className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No colors added yet</p>
                <button 
                  onClick={() => setActiveTab('colors')}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Add colors →
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Compatible Thicknesses</h4>
              <div className="text-center py-8 text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No compatibility set</p>
                <button 
                  onClick={() => setActiveTab('compatibility')}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Set compatibility →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'colors' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tint Colors</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Color
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center text-gray-500">
              <Palette className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Colors Added</h4>
              <p>Add color variants for this tint type (e.g., Grey, Brown, Green)</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add First Color
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compatibility' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thickness Compatibility</h3>
              <p className="text-sm text-gray-600">Select which lens thicknesses are compatible with this tint</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Save Compatibility
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              {lensThicknesses.map((thickness) => (
                <div key={thickness.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`thickness-${thickness.id}`}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`thickness-${thickness.id}`} className="text-sm font-medium text-gray-900">
                        {thickness.name}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 ml-7">
                      Index: {thickness.indexValue} | {formatVNDWithSymbol(Number(thickness.price || 0))}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {thickness.description}
                  </div>
                </div>
              ))}
            </div>

            {lensThicknesses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Layers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Thickness Options</h4>
                <p>Add lens thickness options first to set compatibility</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LensTintPage;
