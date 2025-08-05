import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Palette } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensTint, CreateLensTintDto, UpdateLensTintDto } from '../../types/lens.types';

const LensTintPage: React.FC = () => {
  const {
    lensTints,
    isLensTintLoading: loading,
    error,
    fetchLensTints,
    createLensTint,
    updateLensTint,
    deleteLensTint,
  } = useLensStore();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LensTint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      price: 49.95,
      color: '#1f2937'
    },
    {
      name: 'Sunglasses Tint',
      description: 'Wear your glasses as sunglasses with 100% UV protection',
      price: 19.95,
      color: '#374151'
    },
    {
      name: 'Gradient Tint',
      description: 'Darker at the top edge and gradually becomes lighter towards the bottom',
      price: 44.95,
      color: 'linear-gradient(to bottom, #374151, #f3f4f6)'
    },
    {
      name: 'Mirrored Lenses',
      description: 'Mirror effect for a stylish look and 100% UV protection',
      price: 44.95,
      color: '#c0392b'
    }
  ];

  useEffect(() => {
    fetchLensTints();
  }, [fetchLensTints]);

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
              <span className="text-xs text-green-600 font-medium">£{tintType.price.toFixed(2)}</span>
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

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">
                £{tint.price.toFixed(2)}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Available
              </span>
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
                  Price (£) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
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
};

export default LensTintPage;
