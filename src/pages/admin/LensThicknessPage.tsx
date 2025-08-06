import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Layers } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensThickness, CreateLensThicknessDto, UpdateLensThicknessDto } from '../../types/lens.types';
import { formatVNDWithSymbol } from '../../utils/currency';

const LensThicknessPage: React.FC = () => {
  const {
    lensThicknesses,
    isLensThicknessLoading: loading,
    error,
    fetchLensThicknesses,
    createLensThickness,
    updateLensThickness,
    deleteLensThickness,
  } = useLensStore();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LensThickness | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateLensThicknessDto>({
    name: '',
    description: '',
    indexValue: 1.50,
    price: 0,
  });

  useEffect(() => {
    fetchLensThicknesses();
  }, [fetchLensThicknesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate data before sending
      const submitData = {
        name: formData.name.trim(),
        indexValue: Number(formData.indexValue),
        price: Number(formData.price),
        description: formData.description?.trim() || ''
      };

      // Check for invalid numbers
      if (isNaN(submitData.indexValue) || isNaN(submitData.price)) {
        throw new Error('Invalid number values');
      }

      console.log('Submitting lens thickness data:', submitData);

      if (editingItem) {
        await updateLensThickness(editingItem.id, submitData as UpdateLensThicknessDto);
      } else {
        await createLensThickness(submitData);
      }
      resetForm();
      fetchLensThicknesses();
    } catch (error) {
      console.error('Error saving lens thickness:', error);
    }
  };

  const handleEdit = (item: LensThickness) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      indexValue: item.indexValue,
      price: item.price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lens thickness?')) {
      try {
        await deleteLensThickness(id);
        fetchLensThicknesses();
      } catch (error) {
        console.error('Error deleting lens thickness:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      indexValue: 1.50,
      price: 0,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const filteredThicknesses = lensThicknesses.filter(thickness =>
    thickness.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thickness.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">Lens Thickness Management</h2>
          <p className="text-gray-600">Manage lens thickness options and refractive indices</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Thickness
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search lens thickness..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Thickness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredThicknesses.map((thickness) => (
          <div key={thickness.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{thickness.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Index: {thickness.indexValue}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(thickness)}
                  title="Edit thickness"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(thickness.id)}
                  title="Delete thickness"
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 flex-1">
              {thickness.description || 'No description'}
            </p>

            <div className="flex justify-between items-center mt-auto">
              <span className="text-lg font-bold text-green-600">
                {Number(thickness.price) === 0 ? 'Free' : formatVNDWithSymbol(Number(thickness.price || 0))}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
              {editingItem ? 'Edit Lens Thickness' : 'Add New Lens Thickness'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Standard (1.50)"
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
                  placeholder="Standard lens thickness"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refractive Index *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="2.0"
                  required
                  value={formData.indexValue}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    indexValue: parseFloat(e.target.value) || 1.50 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1.50"
                  title="Refractive Index"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  title="Giá bằng VNĐ"
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

export default LensThicknessPage;
