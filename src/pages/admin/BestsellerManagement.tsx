import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  Pin,
  TrendingUp,
  Search,
  X,
  Save,
  AlertCircle,
  Package,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api.service';

interface BestsellerProduct {
  id: number;
  productId: number;
  isPinned: boolean;
  customPriority: number | null;
  displayOrder: number | null;
  totalSales: number;
  salesLast30Days: number;
  revenueGenerated: number;
  isActive: boolean;
  notes: string | null;
  product: {
    id: number;
    productName: string;
    price: number;
    brand: {
      id: number;
      name: string;
    };
    productColors: Array<{
      id: number;
      colorName: string;
      productNumber: string;
      productImage: Array<{
        imageUrl: string;
      }>;
    }>;
  };
}

interface Product {
  id: number;
  productName: string;
  price: number;
  brand: {
    name: string;
  };
  thumbnailUrl?: string;
  displayName?: string;
  productType?: string;
}

const BestsellerManagement: React.FC = () => {
  const [bestsellers, setBestsellers] = useState<BestsellerProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BestsellerProduct | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    isPinned: false,
    customPriority: '',
    displayOrder: '',
    notes: '',
  });

  useEffect(() => {
    fetchBestsellers();
    fetchAllProducts();
  }, []);

  const fetchBestsellers = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<BestsellerProduct[]>('/api/v1/bestsellers/admin/all');
      setBestsellers(data);
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      toast.error('Không thể tải danh sách bestsellers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await apiService.get<any>('/api/v1/products/cards', {
        page: 1,
        limit: 1000,
      });
      
      // API returns PageList structure: { total: number, data: Product[] }
      const products = response.data || [];
      
      // Group products by ID to avoid duplicates (API returns one row per color variant)
      const uniqueProductsMap = new Map<number, any>();
      
      products.forEach((p: any) => {
        if (!uniqueProductsMap.has(p.id)) {
          uniqueProductsMap.set(p.id, {
            id: p.id,
            productName: p.productName,
            price: p.price,
            brand: { name: p.brandName || 'Unknown' },
            thumbnailUrl: p.thumbnailUrl || null,
            displayName: p.displayName || p.productName,
            productType: p.productType || 'N/A',
          });
        }
      });
      
      // Convert Map to Array
      const uniqueProducts = Array.from(uniqueProductsMap.values());
      
      setAllProducts(uniqueProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    }
  };

  const handleAddBestseller = async () => {
    if (!selectedProductId) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }

    try {
      await apiService.post('/api/v1/bestsellers/admin', {
        productId: selectedProductId,
        isPinned: formData.isPinned,
        customPriority: formData.customPriority ? parseInt(formData.customPriority) : undefined,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : undefined,
        notes: formData.notes || undefined,
      });

      toast.success('Đã thêm bestseller thành công');
      setShowAddModal(false);
      resetForm();
      fetchBestsellers();
    } catch (error: any) {
      console.error('Error adding bestseller:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm bestseller');
    }
  };

  const handleUpdateBestseller = async (id: number) => {
    try {
      await apiService.put(`/api/v1/bestsellers/admin/${id}`, {
        isPinned: formData.isPinned,
        customPriority: formData.customPriority ? parseInt(formData.customPriority) : undefined,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : undefined,
        isActive: true,
        notes: formData.notes || undefined,
      });

      toast.success('Cập nhật thành công');
      setEditingItem(null);
      resetForm();
      fetchBestsellers();
    } catch (error) {
      console.error('Error updating bestseller:', error);
      toast.error('Không thể cập nhật bestseller');
    }
  };

  const handleDeleteBestseller = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bestseller này?')) {
      return;
    }

    try {
      await apiService.delete(`/api/v1/bestsellers/admin/${id}`);
      toast.success('Đã xóa bestseller');
      fetchBestsellers();
    } catch (error) {
      console.error('Error deleting bestseller:', error);
      toast.error('Không thể xóa bestseller');
    }
  };

  const handleToggleActive = async (item: BestsellerProduct) => {
    try {
      await apiService.put(`/api/v1/bestsellers/admin/${item.id}`, {
        isActive: !item.isActive,
      });
      toast.success(item.isActive ? 'Đã ẩn bestseller' : 'Đã hiển thị bestseller');
      fetchBestsellers();
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const startEdit = (item: BestsellerProduct) => {
    setEditingItem(item);
    setFormData({
      isPinned: item.isPinned,
      customPriority: item.customPriority?.toString() || '',
      displayOrder: item.displayOrder?.toString() || '',
      notes: item.notes || '',
    });
  };

  const resetForm = () => {
    setFormData({
      isPinned: false,
      customPriority: '',
      displayOrder: '',
      notes: '',
    });
    setSelectedProductId(null);
  };

  const filteredBestsellers = bestsellers.filter((item) =>
    item.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableProducts = allProducts.filter(
    (product) => !bestsellers.some((bs) => bs.productId === product.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43AC78]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bestseller Products</h2>
          <p className="text-gray-600 mt-1">
            Quản lý sản phẩm bán chạy hiển thị trên Homepage
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-[#43AC78] to-[#64C695] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm Bestseller
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Tổng Bestsellers</p>
              <p className="text-2xl font-bold text-blue-900">{bestsellers.length}</p>
            </div>
            <Star className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Pinned Products</p>
              <p className="text-2xl font-bold text-green-900">
                {bestsellers.filter((bs) => bs.isPinned).length}
              </p>
            </div>
            <Pin className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-purple-900">
                {bestsellers.filter((bs) => bs.isActive).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Sales (30d)</p>
              <p className="text-2xl font-bold text-orange-900">
                {bestsellers.reduce((sum, bs) => sum + bs.salesLast30Days, 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78] focus:border-[#43AC78]"
          />
        </div>
      </div>

      {/* Bestsellers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pinned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sales (30d)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBestsellers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {editingItem?.id === item.id ? (
                    <>
                      <td className="px-6 py-4" colSpan={8}>
                        <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900">
                            Chỉnh sửa: {item.product.productName}
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.isPinned}
                                  onChange={(e) =>
                                    setFormData({ ...formData, isPinned: e.target.checked })
                                  }
                                  className="rounded text-[#43AC78] focus:ring-[#43AC78]"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Pin Product
                                </span>
                              </label>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Custom Priority
                              </label>
                              <input
                                type="number"
                                value={formData.customPriority}
                                onChange={(e) =>
                                  setFormData({ ...formData, customPriority: e.target.value })
                                }
                                placeholder="1 = Highest"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Order
                              </label>
                              <input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) =>
                                  setFormData({ ...formData, displayOrder: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                              </label>
                              <input
                                type="text"
                                value={formData.notes}
                                onChange={(e) =>
                                  setFormData({ ...formData, notes: e.target.value })
                                }
                                placeholder="Admin notes..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                resetForm();
                              }}
                              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleUpdateBestseller(item.id)}
                              className="flex items-center px-4 py-2 bg-[#43AC78] text-white rounded-lg hover:bg-[#64C695]"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Lưu
                            </button>
                          </div>
                        </div>
                      </td>
                    </> 
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={
                              item.product.productColors?.[0]?.productImage?.[0]?.imageUrl ||
                              '/api/placeholder/64/64'
                            }
                            alt={item.product.productName}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {item.product.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product.brand?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {item.isPinned ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Auto</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {item.customPriority ? (
                            <span className="font-medium text-blue-600">
                              #{item.customPriority}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.salesLast30Days}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.totalSales}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#43AC78]">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.revenueGenerated)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBestseller(item.id)}
                          className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBestsellers.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy bestseller nào</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Thêm Bestseller Product</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Product Selection Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm sản phẩm theo tên, thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                />
              </div>

              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="max-h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chọn
                        </th>
                        <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hình
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên sản phẩm
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thương hiệu
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availableProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            {searchTerm
                              ? 'Không tìm thấy sản phẩm nào'
                              : 'Không có sản phẩm nào khả dụng'}
                          </td>
                        </tr>
                      ) : (
                        availableProducts.map((product) => (
                          <tr
                            key={product.id}
                            onClick={() => setSelectedProductId(product.id)}
                            className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                              selectedProductId === product.id ? 'bg-blue-100' : ''
                            }`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="radio"
                                name="selectedProduct"
                                checked={selectedProductId === product.id}
                                onChange={() => setSelectedProductId(product.id)}
                                className="w-4 h-4 text-[#43AC78] focus:ring-[#43AC78]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              {product.thumbnailUrl ? (
                                <img
                                  src={product.thumbnailUrl}
                                  alt={product.productName}
                                  className="w-14 h-14 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">
                                {product.productName}
                              </div>
                              {product.displayName !== product.productName && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {product.displayName}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {product.brand?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              ${product.price?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                {product.productType || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bestseller Settings */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#43AC78]" />
                  Cài đặt Bestseller
                </h4>

                {/* Pin Product */}
                <div className="mb-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) =>
                        setFormData({ ...formData, isPinned: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#43AC78] focus:ring-[#43AC78]"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      📌 Ghim sản phẩm (hiển thị ưu tiên hàng đầu)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 ml-7">
                    Sản phẩm được ghim sẽ luôn xuất hiện đầu tiên trong danh sách bestseller
                  </p>
                </div>

                {/* Priority & Order */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độ ưu tiên <span className="text-gray-500">(1 = cao nhất)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.customPriority}
                      onChange={(e) =>
                        setFormData({ ...formData, customPriority: e.target.value })
                      }
                      placeholder="VD: 1, 2, 3..."
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: e.target.value })
                      }
                      placeholder="Tùy chọn"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú cho admin <span className="text-gray-500">(tùy chọn)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="VD: Khuyến mãi Black Friday, Sản phẩm mới ra mắt, Combo đặc biệt..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43AC78]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedProductId ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Đã chọn 1 sản phẩm
                    </span>
                  ) : (
                    <span className="text-orange-600">⚠️ Vui lòng chọn sản phẩm</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddBestseller}
                    disabled={!selectedProductId}
                    className="flex items-center px-5 py-2 bg-gradient-to-r from-[#43AC78] to-[#64C695] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Bestseller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestsellerManagement;
