import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import stockService, { 
  OrderStockAvailability,
  StockItem 
} from '../services/stock.service';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Edit, 
  Search,
  Eye,
  Plus
} from 'lucide-react';

const StockManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [stockCheckResult, setStockCheckResult] = useState<OrderStockAvailability | null>(null);
  
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  // Load stock data on component mount
  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const items = await stockService.getAllStockItems();
      setStockItems(items);
      toast.success('Đã tải dữ liệu stock thành công');
    } catch (error) {
      console.error('Error loading stock data:', error);
      toast.error('Không thể tải dữ liệu stock');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'low-stock':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'out-of-stock':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckOrderStock = async () => {
    if (!selectedOrderId) {
      toast.error('Vui lòng nhập Order ID');
      return;
    }

    setLoading(true);
    try {
      const result = await stockService.checkOrderStockAvailability(selectedOrderId);
      setStockCheckResult(result);
      
      if (result.available) {
        toast.success('Stock đủ cho order này');
      } else {
        toast.error(`Stock không đủ: ${result.issues.join(', ')}`);
      }
    } catch (error) {
      console.error('Error checking order stock:', error);
      toast.error('Không thể kiểm tra stock cho order này');
    } finally {
      setLoading(false);
    }
  };

  // ĐÃ ẨN - Stock tự động trừ khi order confirmed/thanh toán thành công
  // Giữ lại code để sau này có thể dùng cho trường hợp đặc biệt (offline order, fix lỗi data)
  /*
  const handleReduceOrderStock = async () => {
    if (!selectedOrderId) {
      toast.error('Vui lòng nhập Order ID');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn trừ stock cho order này?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await stockService.reduceStockForOrder(selectedOrderId);
      
      if (result.success) {
        toast.success(`Trừ stock thành công: ${result.message}`);
        console.log('Stock reduction details:', result.details);
      } else {
        toast.error(`Lỗi trừ stock: ${result.message}`);
      }
    } catch (error) {
      console.error('Error reducing order stock:', error);
      toast.error('Không thể trừ stock cho order này');
    } finally {
      setLoading(false);
    }
  };
  */

  const handleRestoreOrderStock = async () => {
    if (!selectedOrderId) {
      toast.error('Vui lòng nhập Order ID');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn hoàn stock cho order này?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await stockService.restoreStockForOrder(selectedOrderId);
      
      if (result.success) {
        toast.success(`Hoàn stock thành công: ${result.message}`);
        console.log('Stock restoration details:', result.details);
      } else {
        toast.error(`Lỗi hoàn stock: ${result.message}`);
      }
    } catch (error) {
      console.error('Error restoring order stock:', error);
      toast.error('Không thể hoàn stock cho order này');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (itemId: number, newStock: number) => {
    if (newStock < 0) {
      toast.error('Stock không thể âm');
      return;
    }

    if (!window.confirm(`Cập nhật stock thành ${newStock}?`)) {
      return;
    }

    setLoading(true);
    try {
      // Find the item to determine its type
      const item = stockItems.find(item => item.id === itemId);
      if (!item) {
        toast.error('Không tìm thấy sản phẩm');
        return;
      }

      // Call appropriate API based on item type
      if (item.type === 'product') {
        await stockService.updateProductColorStock(itemId, newStock);
      } else if (item.type === 'lens-variant') {
        await stockService.updateLensVariantStock(itemId, newStock);
      }
      
      // Update local state
      setStockItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              stock: newStock
            }
          : item
      ));
      
      toast.success('Cập nhật stock thành công');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Không thể cập nhật stock');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockStats = {
    total: stockItems.length,
    inStock: stockItems.filter(item => getStockStatus(item.stock) === 'in-stock').length,
    lowStock: stockItems.filter(item => getStockStatus(item.stock) === 'low-stock').length,
    outOfStock: stockItems.filter(item => getStockStatus(item.stock) === 'out-of-stock').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý tồn kho</h1>
              <p className="text-gray-600 mt-1">Theo dõi và quản lý stock sản phẩm</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadStockData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Quay lại Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stock Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{stockStats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Còn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stockStats.inStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sắp hết</p>
                <p className="text-2xl font-bold text-gray-900">{stockStats.lowStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stockStats.outOfStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Stock Operations */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Thao tác stock theo Order</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="number"
                  value={selectedOrderId || ''}
                  onChange={(e) => setSelectedOrderId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập Order ID..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mb-4">
              <button
                onClick={handleCheckOrderStock}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Kiểm tra Stock
              </button>
              
              {/* Ẩn chức năng Trừ Stock - stock tự động trừ khi order confirmed */}
              {/* <button
                onClick={handleReduceOrderStock}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Minus className="w-4 h-4 mr-2" />
                Trừ Stock
              </button> */}
              
              <button
                onClick={handleRestoreOrderStock}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Hoàn Stock
              </button>
            </div>

            {/* Stock Check Result */}
            {stockCheckResult && (
              <div className={`p-4 rounded-lg ${
                stockCheckResult.available 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {stockCheckResult.available ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`font-medium ${
                    stockCheckResult.available ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {stockCheckResult.available ? 'Stock đủ' : 'Stock không đủ'}
                  </span>
                </div>
                {stockCheckResult.issues.length > 0 && (
                  <ul className="text-sm text-red-700 ml-7">
                    {stockCheckResult.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stock Items List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Danh sách tồn kho</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(getStockStatus(item.stock))}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {item.type === 'product' ? 'Sản phẩm' : 'Tròng kính'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{item.stock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(getStockStatus(item.stock))}`}>
                        {getStockStatus(item.stock) === 'in-stock' ? 'Còn hàng' :
                         getStockStatus(item.stock) === 'low-stock' ? 'Sắp hết' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const newStock = prompt(`Nhập stock mới cho ${item.name}:`, item.stock.toString());
                            if (newStock !== null) {
                              handleUpdateStock(item.id, parseInt(newStock) || 0);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagementPage;
