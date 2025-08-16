import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { LensFormModal, LensType } from '../../components/admin/LensFormModal';
import { lensService } from '../../services/lens.service';
import { lensDetailService } from '../../services/lens-detail.service';
import { Lens, CreateLensDto, UpdateLensDto } from '../../types/lens.types';
import toast from 'react-hot-toast';

const LensManagementPage: React.FC = () => {
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [filteredLenses, setFilteredLenses] = useState<Lens[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLens, setSelectedLens] = useState<Lens | null>(null);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const fetchLenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await lensService.getLenses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined
      });
      
      setLenses(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching lenses:', error);
      toast.error('Không thể tải danh sách lens');
      setLenses([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLenses();
    }, searchTerm ? 500 : 0); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [fetchLenses, searchTerm]);

  useEffect(() => {
    // Reset to page 1 when search term changes
    if (searchTerm && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    // Set filtered lenses to all lenses since filtering is done server-side
    setFilteredLenses(lenses);
  }, [lenses]);

  const handleCreate = async (lensData: { name: string; description: string; lensType: any; hasAxisCorrection: boolean; isNonPrescription: boolean }) => {
    try {
      const createData: CreateLensDto = {
        name: lensData.name,
        description: lensData.description
      };

      const newLens = await lensService.createLens(createData);
      
      // Create lens_detail record with lensType and other properties
      const lensDetailData = {
        lensId: newLens.id,
        lensType: lensData.lensType,
        hasAxisCorrection: lensData.hasAxisCorrection,
        isNonPrescription: lensData.isNonPrescription
      };

      console.log('Creating lens_detail with data:', lensDetailData);
      try {
        await lensDetailService.createLensDetail(lensDetailData);
        console.log('LensDetail created successfully');
      } catch (error) {
        console.error('Error creating lens_detail:', error);
        // Continue with success message as the main lens was created
      }

      toast.success('Tạo lens thành công');
      setShowCreateModal(false);
      await fetchLenses(); // Refresh list
    } catch (error) {
      console.error('Error creating lens:', error);
      toast.error('Không thể tạo lens');
    }
  };

  const handleEdit = (lens: Lens) => {
    setSelectedLens(lens);
    setShowEditModal(true);
  };

  const handleUpdate = async (lensData: { name: string; description: string; hasAxisCorrection: boolean; isNonPrescription: boolean }) => {
    if (!selectedLens) return;
    
    try {
      const updateData: UpdateLensDto = {
        name: lensData.name,
        description: lensData.description
      };

      await lensService.updateLens(selectedLens.id, updateData);
      
      // Update lens_detail record with hasAxisCorrection/isNonPrescription
      try {
        // First get existing lens_detail for this lens
        const lensDetails = await lensDetailService.getLensDetailsByLensId(selectedLens.id);
        if (lensDetails.length > 0) {
          // Update the first lens_detail (assuming one per lens)
          await lensDetailService.updateLensDetail(lensDetails[0].id, {
            hasAxisCorrection: lensData.hasAxisCorrection,
            isNonPrescription: lensData.isNonPrescription
          });
        }
      } catch (error) {
        console.error('Error updating lens_detail:', error);
        // Continue with success message as the main lens was updated
      }

      toast.success('Cập nhật lens thành công');
      setShowEditModal(false);
      setSelectedLens(null);
      await fetchLenses(); // Refresh list
    } catch (error) {
      console.error('Error updating lens:', error);
      toast.error('Không thể cập nhật lens');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lens này?')) {
      return;
    }

    try {
      await lensService.deleteLens(id);
      toast.success('Xóa lens thành công');
      await fetchLenses(); // Refresh list
    } catch (error) {
      console.error('Error deleting lens:', error);
      toast.error('Không thể xóa lens');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Loại Lens
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các loại lens cơ bản và thuộc tính liên quan
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
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600">
            Hiển thị {filteredLenses.length} / {lenses.length} kết quả
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Ngày cập nhật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLenses.map((lens) => (
                  <tr key={lens.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <div className="text-sm font-medium text-gray-900">
                        #{lens.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="text-sm font-medium text-gray-900">
                        {lens.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {lens.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <div className="text-sm text-gray-600">
                        {formatDate(lens.createdAt)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Bởi: User {lens.createdBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <div className="text-sm text-gray-600">
                        {formatDate(lens.updatedAt)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Bởi: User {lens.updatedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(lens)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lens.id)}
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
        )}

        {filteredLenses.length === 0 && !loading && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có lens nào được tạo'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <LensFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        mode="create"
        title="Thêm Lens Mới"
      />

      <LensFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLens(null);
        }}
        onSubmit={handleUpdate}
        mode="edit"
        title="Sửa Lens"
        initialData={selectedLens ? {
          name: selectedLens.name,
          description: selectedLens.description || '',
          lensType: LensType.SINGLE_VISION, // TODO: Get from lens_detail
          hasAxisCorrection: false, // TODO: Get from lens_detail
          isNonPrescription: false, // TODO: Get from lens_detail
        } : undefined}
      />
    </div>
  );
};

export default LensManagementPage;
