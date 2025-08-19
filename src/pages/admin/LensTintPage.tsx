import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ArrowLeft, Upload, X } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensTint, CreateLensTintDto, UpdateLensTintDto, CreateTintColorDto } from '../../types/lens.types';
import { formatVNDWithSymbol } from '../../utils/currency';

interface TintColorFormData extends Omit<CreateTintColorDto, 'tintId'> {
  id?: number;
  imageFile?: File;
}

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
    // Tint color methods
    fetchTintColorsByTintId,
    createTintColor,
    uploadTintColorImage,
    // Compatibility methods
    fetchCompatibleThicknessesForTint,
    createTintThicknessCompatibility,
  } = useLensStore();

  // State for navigation between list and form
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<LensTint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<CreateLensTintDto>({
    name: '',
    description: '',
    price: 0,
  });

  // Tint colors management
  const [tintColors, setTintColors] = useState<TintColorFormData[]>([]);
  
  // Lens thickness compatibility
  const [selectedThicknesses, setSelectedThicknesses] = useState<number[]>([]);

  // Predefined tint types from your customer journey
  const tintTypes = [
    {
      name: 'No Tint',
      description: 'Clear lenses without any tint',
      price: 0,
    },
    {
      name: 'Polarised Lenses',
      description: 'Minimise disruptive glare from reflective surfaces',
      price: 1498500, // 49.95 * 30000
    },
    {
      name: 'Sunglasses Tint',
      description: 'Wear your glasses as sunglasses with 100% UV protection',
      price: 598500, // 19.95 * 30000
    },
    {
      name: 'Gradient Tint',
      description: 'Darker at the top edge and gradually becomes lighter towards the bottom',
      price: 1348500, // 44.95 * 30000
    },
    {
      name: 'Mirrored Lenses',
      description: 'Mirror effect for a stylish look and 100% UV protection',
      price: 1348500, // 44.95 * 30000
    }
  ];

  useEffect(() => {
    fetchLensTints();
    fetchLensThicknesses();
  }, [fetchLensTints, fetchLensThicknesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTintColors()) {
      return;
    }

    setUploading(true);
    try {
      let savedTint: LensTint | null;
      
      if (editingItem) {
        savedTint = await updateLensTint(editingItem.id, formData as UpdateLensTintDto);
      } else {
        savedTint = await createLensTint(formData);
      }
      
      if (savedTint) {
        // Save tint colors
        for (const color of tintColors) {
          if (color.name.trim()) {
            const colorData: CreateTintColorDto = {
              tintId: savedTint.id,
              name: color.name.trim(),
              ...(color.colorCode && color.colorCode !== '#000000' ? { colorCode: color.colorCode } : {}),
            };

            // Upload image if present
            if (color.imageFile) {
              try {
                colorData.imageUrl = await uploadImageToS3(color.imageFile);
              } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                // Continue without image if upload fails
              }
            } else if (color.imageUrl) {
              colorData.imageUrl = color.imageUrl;
            }

            await createTintColor(colorData);
          }
        }

        // Save lens thickness compatibility
        if (selectedThicknesses.length > 0) {
          await createTintThicknessCompatibility(savedTint.id, selectedThicknesses);
        }
      }
      
      resetForm();
      fetchLensTints();
      setCurrentView('list');
    } catch (error) {
      console.error('Error saving lens tint:', error);
      alert('Error creating lens tint. Please check your input and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: LensTint) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
    });
    
    // Load existing tint colors and thickness compatibility
    loadTintData(item.id);
    setCurrentView('form');
  };

  const loadTintData = async (tintId: number) => {
    try {
      // Load tint colors
      const colors = await fetchTintColorsByTintId(tintId);
      setTintColors(colors.map(color => ({
        id: color.id,
        name: color.name,
        colorCode: color.colorCode,
        imageUrl: color.imageUrl,
      })));

      // Load compatible thicknesses
      const compatibleThicknesses = await fetchCompatibleThicknessesForTint(tintId);
      setSelectedThicknesses(compatibleThicknesses.map(ct => ct.lensThicknessId || ct.id));
    } catch (error) {
      console.error('Error loading tint data:', error);
    }
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
    setCurrentView('form');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
    });
    setTintColors([]);
    setSelectedThicknesses([]);
    setEditingItem(null);
  };

  const handleNewTint = () => {
    resetForm();
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    resetForm();
  };

  // Tint color management functions
  const addTintColor = () => {
    setTintColors([...tintColors, { name: '', colorCode: '', imageUrl: '' }]);
  };

  const removeTintColor = (index: number) => {
    setTintColors(tintColors.filter((_, i) => i !== index));
  };

  const updateTintColor = (index: number, field: keyof TintColorFormData, value: string | File) => {
    const newTintColors = [...tintColors];
    if (field === 'imageFile') {
      newTintColors[index].imageFile = value as File;
      // TODO: Upload to S3 and get URL
      // For now, create a temporary URL for preview
      newTintColors[index].imageUrl = URL.createObjectURL(value as File);
    } else if (field === 'colorCode') {
      // Validate hex color format
      const colorValue = value as string;
      if (colorValue && !/^#[0-9A-Fa-f]{6}$/.test(colorValue)) {
        // If invalid format, don't update
        return;
      }
      newTintColors[index].colorCode = colorValue;
    } else {
      (newTintColors[index] as any)[field] = value;
    }
    setTintColors(newTintColors);
  };

  // Lens thickness compatibility functions
  const handleThicknessToggle = (thicknessId: number) => {
    setSelectedThicknesses(prev => 
      prev.includes(thicknessId)
        ? prev.filter(id => id !== thicknessId)
        : [...prev, thicknessId]
    );
  };

  // Validation helper
  const validateTintColors = (): boolean => {
    for (const color of tintColors) {
      if (color.name.trim()) {
        if (color.colorCode && !/^#[0-9A-Fa-f]{6}$/.test(color.colorCode)) {
          alert(`Invalid color code "${color.colorCode}" for color "${color.name}". Please use format #RRGGBB`);
          return false;
        }
      }
    }
    return true;
  };

  // Image upload helper (S3 upload)
  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      const result = await uploadTintColorImage(file);
      if (!result) {
        throw new Error('Upload failed - no result returned');
      }
      return result.imageUrl;
    } catch (error) {
      console.error('Failed to upload image to S3:', error);
      throw new Error('Failed to upload image');
    }
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

  // Form View
  if (currentView === 'form') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingItem ? 'Edit Lens Tint' : 'Add New Lens Tint'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tint Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tint name"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Preview: {formatVNDWithSymbol(formData.price)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Tint Colors */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tint Colors</h3>
              <button
                type="button"
                onClick={addTintColor}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Color
              </button>
            </div>

            <div className="space-y-4">
              {tintColors.map((color, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Color {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTintColor(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Remove color"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={color.name}
                        onChange={(e) => updateTintColor(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Smoke Gray"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={color.colorCode || '#000000'}
                          onChange={(e) => updateTintColor(index, 'colorCode', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300"
                          title="Select color"
                        />
                        <input
                          type="text"
                          value={color.colorCode || ''}
                          onChange={(e) => updateTintColor(index, 'colorCode', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#000000"
                          pattern="^#[0-9A-Fa-f]{6}$"
                          title="Enter a valid hex color code (e.g., #FF0000)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateTintColor(index, 'imageFile', file);
                            }
                          }}
                          className="hidden"
                          id={`image-${index}`}
                        />
                        <label
                          htmlFor={`image-${index}`}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-1 text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </label>
                        {color.imageUrl && (
                          <img
                            src={color.imageUrl}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded-lg border border-gray-300"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {tintColors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No colors added yet. Click "Add Color" to add tint color options.
                </div>
              )}
            </div>
          </div>

          {/* Lens Thickness Compatibility */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Lens Thickness Compatibility</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select which lens thicknesses are compatible with this tint:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lensThicknesses.map((thickness) => (
                <label
                  key={thickness.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedThicknesses.includes(thickness.id)}
                    onChange={() => handleThicknessToggle(thickness.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{thickness.name}</div>
                    <div className="text-sm text-gray-500">
                      Index: {thickness.indexValue} | {formatVNDWithSymbol(thickness.price)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBackToList}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingItem ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                editingItem ? 'Update Lens Tint' : 'Create Lens Tint'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lens Tint Management</h2>
          <p className="text-gray-600">Manage lens tint options and colors</p>
        </div>
        <button
          onClick={handleNewTint}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Tint
        </button>
      </div>

      {/* Quick Add Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Add Predefined Tints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tintTypes.map((tintType, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd(tintType)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900">{tintType.name}</div>
              <div className="text-sm text-gray-500 mt-1">{formatVNDWithSymbol(tintType.price)}</div>
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tint.name}</h3>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {formatVNDWithSymbol(tint.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tint)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(tint.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {tint.description || 'No description'}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>ID: {tint.id}</span>
              <span>Created: {new Date(tint.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredTints.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No lens tints found</div>
          <button
            onClick={handleNewTint}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Lens Tint
          </button>
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
