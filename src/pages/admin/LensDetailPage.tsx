import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, User, Calendar } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensDetail, CreateLensDetailDto, UpdateLensDetailDto } from '../../types/lens.types';

const LensDetailPage: React.FC = () => {
  const {
    lensDetails,
    isLensDetailLoading: loading,
    error,
    fetchLensDetails,
    createLensDetail,
    updateLensDetail,
    deleteLensDetail,
  } = useLensStore();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LensDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateLensDetailDto>({
    lensId: 1,
    prescriptionDate: new Date(),
    material: '',
    coating: '',
  });

  useEffect(() => {
    fetchLensDetails();
  }, [fetchLensDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateLensDetail(editingItem.id, formData as UpdateLensDetailDto);
      } else {
        await createLensDetail(formData);
      }
      resetForm();
      fetchLensDetails();
    } catch (error) {
      console.error('Error saving lens detail:', error);
    }
  };

  const handleEdit = (item: LensDetail) => {
    setEditingItem(item);
    setFormData({
      lensId: item.lensId,
      lensThicknessId: item.lensThicknessId,
      lensQualityId: item.lensQualityId,
      tintId: item.tintId,
      powerSphereLeft: item.powerSphereLeft,
      powerSphereRight: item.powerSphereRight,
      powerCylinderLeft: item.powerCylinderLeft,
      powerCylinderRight: item.powerCylinderRight,
      axisLeft: item.axisLeft,
      axisRight: item.axisRight,
      pdLeft: item.pdLeft,
      pdRight: item.pdRight,
      prescriptionDate: new Date(item.prescriptionDate),
      material: item.material || '',
      coating: item.coating || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lens detail?')) {
      try {
        await deleteLensDetail(id);
        fetchLensDetails();
      } catch (error) {
        console.error('Error deleting lens detail:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      lensId: 1,
      prescriptionDate: new Date(),
      material: '',
      coating: '',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const filteredDetails = lensDetails.filter(detail =>
    detail.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.coating?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">Lens Details Management</h2>
          <p className="text-gray-600">Manage lens prescriptions and configurations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Lens Detail
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by material or coating..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lens Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredDetails.map((detail) => (
          <div key={detail.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Prescription #{detail.id}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(detail)}
                  title="Edit lens detail"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(detail.id)}
                  title="Delete lens detail"
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {detail.material && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Material: {detail.material}</span>
                </div>
              )}
              {detail.coating && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Coating: {detail.coating}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">
                  Date: {new Date(detail.prescriptionDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Power Information */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Power Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {detail.powerSphereLeft !== null && detail.powerSphereLeft !== undefined && (
                  <div>
                    <span className="text-gray-500">Left SPH:</span>
                    <span className="ml-1 font-mono">{detail.powerSphereLeft}</span>
                  </div>
                )}
                {detail.powerSphereRight !== null && detail.powerSphereRight !== undefined && (
                  <div>
                    <span className="text-gray-500">Right SPH:</span>
                    <span className="ml-1 font-mono">{detail.powerSphereRight}</span>
                  </div>
                )}
                {detail.powerCylinderLeft !== null && detail.powerCylinderLeft !== undefined && (
                  <div>
                    <span className="text-gray-500">Left CYL:</span>
                    <span className="ml-1 font-mono">{detail.powerCylinderLeft}</span>
                  </div>
                )}
                {detail.powerCylinderRight !== null && detail.powerCylinderRight !== undefined && (
                  <div>
                    <span className="text-gray-500">Right CYL:</span>
                    <span className="ml-1 font-mono">{detail.powerCylinderRight}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Lens Detail' : 'Add New Lens Detail'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lens ID *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.lensId}
                    onChange={(e) => setFormData({ ...formData, lensId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter lens ID"
                    title="Lens ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prescription Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.prescriptionDate.toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, prescriptionDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Prescription Date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CR-39 Plastic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coating
                  </label>
                  <input
                    type="text"
                    value={formData.coating}
                    onChange={(e) => setFormData({ ...formData, coating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Anti-reflective"
                  />
                </div>
              </div>

              {/* Power Fields */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Power Details (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Left Sphere</label>
                    <input
                      type="number"
                      step="0.25"
                      value={formData.powerSphereLeft || ''}
                      onChange={(e) => setFormData({ ...formData, powerSphereLeft: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Right Sphere</label>
                    <input
                      type="number"
                      step="0.25"
                      value={formData.powerSphereRight || ''}
                      onChange={(e) => setFormData({ ...formData, powerSphereRight: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
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

export default LensDetailPage;
