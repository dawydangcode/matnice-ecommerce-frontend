import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Tag, Eye, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LensCategory {
  id: number;
  lensId: number;
  categoryId: number;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  lens?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

interface CreateLensCategoryDto {
  lensId: number;
  categoryId: number;
}

const LensCategoryManagementPage: React.FC = () => {
  const [lensCategories, setLensCategories] = useState<LensCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateLensCategoryDto>({
    lensId: 0,
    categoryId: 0
  });

  // Mock data for development
  useEffect(() => {
    // This would be replaced with actual API call
    const mockData: LensCategory[] = [
      {
        id: 1,
        lensId: 1,
        categoryId: 1,
        createdAt: new Date().toISOString(),
        createdBy: 1,
        updatedAt: new Date().toISOString(),
        updatedBy: 1,
        lens: { id: 1, name: 'Single Vision Lens' },
        category: { id: 1, name: 'Prescription' }
      },
      {
        id: 2,
        lensId: 2,
        categoryId: 2,
        createdAt: new Date().toISOString(),
        createdBy: 1,
        updatedAt: new Date().toISOString(),
        updatedBy: 1,
        lens: { id: 2, name: 'Progressive Lens' },
        category: { id: 2, name: 'Multifocal' }
      }
    ];
    setLensCategories(mockData);
  }, []);

  const filteredCategories = lensCategories.filter(category =>
    category.lens?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would be replaced with actual API call
      const newCategory: LensCategory = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        createdBy: 1,
        updatedAt: new Date().toISOString(),
        updatedBy: 1,
        lens: { id: formData.lensId, name: `Lens ${formData.lensId}` },
        category: { id: formData.categoryId, name: `Category ${formData.categoryId}` }
      };
      
      setLensCategories(prev => [...prev, newCategory]);
      setShowCreateModal(false);
      setFormData({ lensId: 0, categoryId: 0 });
      toast.success('Tạo lens category thành công');
    } catch (error) {
      toast.error('Không thể tạo lens category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lens category này?')) {
      return;
    }

    try {
      setLensCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Xóa lens category thành công');
    } catch (error) {
      toast.error('Không thể xóa lens category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Tag className="w-6 h-6 mr-2 text-blue-600" />
              Quản lý Lens Category
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý phân loại và nhóm lens theo danh mục
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm lens hoặc category..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng lens categories</p>
              <p className="text-2xl font-bold text-gray-900">{lensCategories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lens được phân loại</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(lensCategories.map(cat => cat.lensId)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories sử dụng</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(lensCategories.map(cat => cat.categoryId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {category.lens?.name || `Lens ID: ${category.lensId}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {category.lensId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-green-50">
                        <Tag className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {category.category?.name || `Category ID: ${category.categoryId}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {category.categoryId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thêm Lens Category
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lens ID
                </label>
                <input
                  type="number"
                  required
                  placeholder="Nhập Lens ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.lensId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lensId: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category ID
                </label>
                <input
                  type="number"
                  required
                  placeholder="Nhập Category ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: parseInt(e.target.value) }))}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang tạo...' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LensCategoryManagementPage;
