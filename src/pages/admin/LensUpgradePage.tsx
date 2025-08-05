import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Zap, Shield, Eye, Sparkles } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensUpgrade, CreateLensUpgradeDto, UpdateLensUpgradeDto } from '../../types/lens.types';

const LensUpgradePage: React.FC = () => {
  const {
    lensUpgrades,
    isLensUpgradeLoading: loading,
    error,
    fetchLensUpgrades,
    createLensUpgrade,
    updateLensUpgrade,
    deleteLensUpgrade,
  } = useLensStore();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LensUpgrade | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateLensUpgradeDto>({
    upgradeName: '',
    description: '',
    price: 0,
  });

  // Predefined upgrade types from your customer journey
  const upgradeTypes = [
    {
      name: 'Extra easy-care lotus effect',
      description: 'Extremely water and grease-repellent coating with beading effect',
      price: 14.95,
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Blue Light Filter Technology',
      description: 'Wellness for all eyes that spend a lot of time in front of screens every day',
      price: 29.95,
      icon: Shield,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Smart Focus',
      description: 'Support for the eyes when transitioning to near vision during daily use of phones and digital devices',
      price: 49.95,
      icon: Eye,
      color: 'bg-green-100 text-green-600'
    }
  ];

  useEffect(() => {
    fetchLensUpgrades();
  }, [fetchLensUpgrades]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateLensUpgrade(editingItem.id, formData as UpdateLensUpgradeDto);
      } else {
        await createLensUpgrade(formData);
      }
      resetForm();
      fetchLensUpgrades();
    } catch (error) {
      console.error('Error saving lens upgrade:', error);
    }
  };

  const handleEdit = (item: LensUpgrade) => {
    setEditingItem(item);
    setFormData({
      upgradeName: item.upgradeName,
      description: item.description || '',
      price: item.price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lens upgrade?')) {
      try {
        await deleteLensUpgrade(id);
        fetchLensUpgrades();
      } catch (error) {
        console.error('Error deleting lens upgrade:', error);
      }
    }
  };

  const handleQuickAdd = (upgradeType: typeof upgradeTypes[0]) => {
    setFormData({
      upgradeName: upgradeType.name,
      description: upgradeType.description,
      price: upgradeType.price,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      upgradeName: '',
      description: '',
      price: 0,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const filteredUpgrades = lensUpgrades.filter(upgrade =>
    upgrade.upgradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upgrade.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">Lens Upgrades Management</h2>
          <p className="text-gray-600">Manage additional lens features and enhancements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Upgrade
        </button>
      </div>

      {/* Quick Add Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Add Standard Upgrades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upgradeTypes.map((upgradeType, index) => {
            const IconComponent = upgradeType.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAdd(upgradeType)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${upgradeType.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{upgradeType.name}</h4>
                    <span className="text-lg font-bold text-green-600">£{upgradeType.price.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{upgradeType.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search lens upgrades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredUpgrades.map((upgrade) => (
          <div key={upgrade.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{upgrade.upgradeName}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(upgrade)}
                  title="Edit upgrade"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(upgrade.id)}
                  title="Delete upgrade"
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 min-h-[3rem]">
              {upgrade.description || 'No description'}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">
                £{upgrade.price.toFixed(2)}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Enhancement
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
              {editingItem ? 'Edit Lens Upgrade' : 'Add New Lens Upgrade'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upgrade Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.upgradeName}
                  onChange={(e) => setFormData({ ...formData, upgradeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Blue Light Filter Technology"
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
                  placeholder="Describe the upgrade benefits and features"
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

export default LensUpgradePage;
