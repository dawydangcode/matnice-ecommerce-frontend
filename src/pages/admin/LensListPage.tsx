import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { Lens } from '../../types/lens.types';

interface LensListPageProps {
  onEditLens: (lens: Lens) => void;
  onCreateLens: () => void;
  onViewLens?: (lens: Lens) => void;
}

const LensListPage: React.FC<LensListPageProps> = ({ 
  onEditLens, 
  onCreateLens,
  onViewLens 
}) => {
  const {
    lenses,
    isLoading,
    error,
    pagination,
    fetchLenses,
    deleteLens,
    clearError,
  } = useLensStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLenses({
      page: 1,
      limit: 10,
    });
  }, [fetchLenses]);

  const handleSearch = () => {
    fetchLenses({
      search: searchTerm,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    fetchLenses({ page });
  };

  const handleDelete = async (lens: Lens) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lens "${lens.name}"?`)) {
      await deleteLens(lens.id);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Lens</h2>
          <p className="text-gray-600">Quản lý danh sách các loại lens</p>
        </div>
        <button
          onClick={onCreateLens}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm lens</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm lens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* Lens List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : lenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có lens nào được tìm thấy</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên lens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lenses.map((lens) => (
                    <tr key={lens.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{lens.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lens.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lens.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{lens.createdBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {onViewLens && (
                            <button
                              onClick={() => onViewLens(lens)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditLens(lens)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lens)}
                            className="text-red-600 hover:text-red-900 p-1"
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số{' '}
                    {pagination.total} lens
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Trước
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${
                          page === pagination.page ? 'bg-blue-500 text-white' : ''
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LensListPage;
