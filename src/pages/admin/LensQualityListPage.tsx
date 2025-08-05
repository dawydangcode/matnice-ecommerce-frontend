import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Check } from 'lucide-react';
import { useLensStore } from '../../stores/lens.store';
import { LensQuality } from '../../types/lens.types';
import { formatVND } from '../../utils/currency';

interface LensQualityListPageProps {
  onEditLensQuality: (lensQuality: LensQuality) => void;
  onCreateLensQuality: () => void;
}

const LensQualityListPage: React.FC<LensQualityListPageProps> = ({ 
  onEditLensQuality, 
  onCreateLensQuality
}) => {
  const {
    lensQualities,
    isLensQualityLoading,
    lensQualityError,
    fetchLensQualities,
    deleteLensQuality,
    clearLensQualityError,
  } = useLensStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLensQualities({
      page: 1,
      limit: 10,
    });
  }, [fetchLensQualities]);

  const handleSearch = () => {
    fetchLensQualities({
      search: searchTerm,
      page: 1,
    });
  };

  const handleDelete = async (lensQuality: LensQuality) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chất lượng lens "${lensQuality.name}"?`)) {
      await deleteLensQuality(lensQuality.id);
    }
  };

  if (lensQualityError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
            <p className="text-sm text-red-700 mt-1">{lensQualityError}</p>
          </div>
          <button
            onClick={clearLensQualityError}
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
          <h2 className="text-2xl font-bold text-gray-900">Quản lý chất lượng Lens</h2>
          <p className="text-gray-600">Quản lý các loại chất lượng và tính năng lens</p>
        </div>
        <button
          onClick={onCreateLensQuality}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chất lượng lens</span>
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
                placeholder="Tìm kiếm chất lượng lens..."
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

      {/* Lens Quality List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLensQualityLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : lensQualities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có chất lượng lens nào được tìm thấy</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tính năng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lensQualities.map((lensQuality) => (
                  <tr key={lensQuality.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lensQuality.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatVND(lensQuality.price)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {lensQuality.uvProtection && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            UV
                          </span>
                        )}
                        {lensQuality.antiReflective && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Check className="w-3 h-3 mr-1" />
                            Chống phản quang
                          </span>
                        )}
                        {lensQuality.hardCoating && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Check className="w-3 h-3 mr-1" />
                            Lớp phủ cứng
                          </span>
                        )}
                        {lensQuality.nightDayOptimization && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Check className="w-3 h-3 mr-1" />
                            Ngày đêm
                          </span>
                        )}
                        {lensQuality.transitionsOption && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            <Check className="w-3 h-3 mr-1" />
                            Đổi màu
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={lensQuality.description}>
                        {lensQuality.description || 'Không có mô tả'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEditLensQuality(lensQuality)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lensQuality)}
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
        )}
      </div>
    </div>
  );
};

export default LensQualityListPage;
