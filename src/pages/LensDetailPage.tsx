import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import { apiService } from '../services/api.service';
import { formatVND } from '../utils/currency';
import '../styles/ProductDetailPage.css';

interface LensImage {
  id: string;
  imageUrl: string;
  imageOrder: string;
  isThumbnail: boolean;
}

interface LensBrand {
  id: string;
  name: string;
  description?: string;
}

interface LensCategory {
  id: string;
  name: string;
  description?: string;
}

interface LensThickness {
  id: string;
  name: string;
  indexValue: number;
  price: string;
  description: string;
}

interface RefractionRange {
  id: string;
  refractionType: string;
  minValue: string;
  maximumValue: string;
  stepValue: string;
}

interface LensVariant {
  id: string;
  lensThicknessId: string;
  design: string;
  material: string;
  price: string;
  stock: number;
  refractionRanges: RefractionRange[];
  tintColors: any[];
  lensThickness: LensThickness;
}

interface LensCoating {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface LensSummary {
  totalVariants: number;
  totalCoatings: number;
  totalImages: number;
  priceRange: { min: number; max: number };
  availableStock: number;
}

interface LensDetail {
  id: string;
  name: string;
  origin: string;
  lensType: string;
  status: string;
  description: string;
  createdAt: string;
  brandLens: LensBrand;
}

interface LensFullDetails {
  lens: LensDetail;
  categories: LensCategory[];
  variants: LensVariant[];
  coatings: LensCoating[];
  images: LensImage[];
  summary: LensSummary;
}

const LensDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<LensFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Option selections
  const [selectedThickness, setSelectedThickness] = useState<string>('');
  const [selectedCoating, setSelectedCoating] = useState<string>('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'articles' | 'care'>('description');

  // Computed values
  const sortedVariants = data?.variants ? 
    [...data.variants].sort((a, b) => a.lensThickness.indexValue - b.lensThickness.indexValue) : 
    [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await apiService.get<LensFullDetails>(`/api/v1/lens/${id}/full-details`);
        setData(json);
        // Default selections - chọn variant có stock > 0
        if (json.variants && json.variants.length > 0) {
          const availableVariant = json.variants.find(v => v.stock > 0);
          if (availableVariant) {
            setSelectedThickness(availableVariant.lensThickness?.id || '');
          } else {
            // Nếu tất cả đều hết hàng, chọn cái đầu tiên
            setSelectedThickness(json.variants[0].lensThickness?.id || '');
          }
        }
        if (json.coatings && json.coatings.length > 0) {
          setSelectedCoating(json.coatings[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const formatVNDLocal = (price: string | number) => {
    return formatVND(typeof price === 'string' ? parseFloat(price) : price);
  };

  // Calculate total price based on selections
  const getTotalPrice = () => {
    let total = 0;
    
    // Base price from selected variant
    const selectedVariant = variants.find(v => v.lensThickness.id === selectedThickness);
    if (selectedVariant) {
      total += parseFloat(selectedVariant.price || '0');
      total += parseFloat(selectedVariant.lensThickness.price || '0');
    }
    
    // Add coating price
    const selectedCoatingData = coatings.find(c => c.id === selectedCoating);
    if (selectedCoatingData) {
      total += parseFloat(selectedCoatingData.price || '0');
    }
    
    return total;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Không tìm thấy sản phẩm'}</div>;

  const { lens, images, variants, coatings, summary } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-grow">
        <div className="product-detail-container">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="gallery-grid">
              {images.map((img, idx) => (
                <div key={img.id} className="gallery-item">
                  <img src={img.imageUrl} alt={lens.name} className="gallery-image" width="400" height="300" loading={idx === 0 ? 'eager' : 'lazy'} />
                </div>
              ))}
            </div>
          </div>

          {/* Info & Options */}
          <div className="product-info">
            <div className="product-category">Lens / {lens.brandLens?.name}</div>
            <h1 className="product-brand">{lens.brandLens?.name}</h1>
            <h2 className="product-name">{lens.name}</h2>
            
            <div className="mb-6 space-y-2">
              <div className="text-gray-600"><strong>Tình trạng:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${lens.status === 'IN_STOCK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {lens.status === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Options UI giống ảnh */}
            <div className="mb-6 space-y-4">
              {/* Chiết suất */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Chiết suất</span>
                <div className="flex gap-2">
                  {sortedVariants.map(v => (
                    <button 
                      key={v.lensThickness.id} 
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        v.stock === 0 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                          : selectedThickness === v.lensThickness.id 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                      onClick={() => v.stock > 0 && setSelectedThickness(v.lensThickness.id)}
                      disabled={v.stock === 0}
                      title={v.stock === 0 ? 'Hết hàng' : `Còn ${v.stock} sản phẩm`}
                    >
                      {v.lensThickness.indexValue} {v.stock === 0 && '(Hết hàng)'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Lớp phủ */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Lớp phủ</span>
                <div className="flex gap-2 flex-wrap">
                  {coatings.map(c => (
                    <button 
                      key={c.id} 
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        selectedCoating === c.id 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedCoating(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Giá và kho */}
            <div className="pricing-section">
              <div className="price-row">
                <span className="price-label">Giá</span>
                <span className="price-value">{formatVNDLocal(getTotalPrice())}</span>
              </div>
              <div className="vat-note">VAT đã bao gồm</div>
              <div className={`stock-status ${
                variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 ? 'text-red-600' : ''
              }`}>
                {variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 
                  ? 'Hết hàng' 
                  : `Còn ${variants.find(v => v.lensThickness.id === selectedThickness)?.stock || 0} sản phẩm`}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                disabled={
                  summary.availableStock === 0 || 
                  variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0
                }
              >
                {summary.availableStock === 0 || variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 
                  ? 'Hết hàng' : 'Mua ngay'}
              </button>
              <button className="btn-secondary">Tư vấn thêm</button>
            </div>

            {/* Thông tin chi tiết về lựa chọn */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Thông tin lựa chọn:</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Chiết suất:</strong> {variants.find(v => v.lensThickness.id === selectedThickness)?.lensThickness.name || 'Chưa chọn'}</div>
                <div><strong>Độ dày:</strong> {variants.find(v => v.lensThickness.id === selectedThickness)?.lensThickness.indexValue || 'N/A'}</div>
                <div><strong>Chất liệu:</strong> {variants.find(v => v.lensThickness.id === selectedThickness)?.material || 'N/A'}</div>
                <div><strong>Thiết kế:</strong> {variants.find(v => v.lensThickness.id === selectedThickness)?.design || 'N/A'}</div>
                <div><strong>Số lượng còn lại:</strong> 
                  <span className={variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 ? 'text-red-600' : 'text-green-600'}>
                    {variants.find(v => v.lensThickness.id === selectedThickness)?.stock === 0 
                      ? 'Hết hàng' 
                      : `${variants.find(v => v.lensThickness.id === selectedThickness)?.stock || 0} sản phẩm`}
                  </span>
                </div>
                {selectedCoating && (
                  <div><strong>Lớp phủ:</strong> {coatings.find(c => c.id === selectedCoating)?.name} - {formatVNDLocal(coatings.find(c => c.id === selectedCoating)?.price || 0)}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mô tả
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thông số
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bài viết
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'care'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bảo quản
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Mô tả sản phẩm</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {lens.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Xuất xứ:</span> {lens.origin}
                  </div>
                  <div>
                    <span className="font-medium">Loại tròng:</span> {lens.lensType}
                  </div>
                  <div>
                    <span className="font-medium">Tình trạng:</span> {lens.status === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
                  </div>
                  <div>
                    <span className="font-medium">Thương hiệu:</span> {lens.brandLens?.name}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Thông số kỹ thuật</h3>
                <div className="space-y-4">
                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Thương hiệu tròng</span>
                    <span className="text-gray-900">{lens.brandLens?.name}</span>
                  </div>
                  
                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Chiết suất</span>
                    <span className="text-gray-900">
                      {sortedVariants.map(v => v.lensThickness.indexValue).join(', ')}
                    </span>
                  </div>
                  
                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Loại tròng kính</span>
                    <span className="text-gray-900">
                      {lens.lensType === 'SINGLE_VISION' ? 'Đơn tròng' : 
                       lens.lensType === 'PROGRESSIVE' ? 'Đa tròng' : 
                       lens.lensType === 'OFFICE' ? 'Văn phòng' :
                       lens.lensType === 'DRIVE_SAFE' ? 'Lái xe an toàn' :
                       lens.lensType === 'NON_PRESCRIPTION' ? 'Không độ' : lens.lensType}
                    </span>
                  </div>
                  
                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Tính năng</span>
                    <span className="text-gray-900">
                      {data.categories.map(cat => cat.name).join(', ') || 'Không có thông tin'}
                    </span>
                  </div>
                  
                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Lớp phủ</span>
                    <span className="text-gray-900">
                      {coatings.map(c => c.name).join(', ') || 'Không có thông tin'}
                    </span>
                  </div>

                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Chất liệu</span>
                    <span className="text-gray-900">
                      {sortedVariants.map(v => v.material).filter((value, index, self) => self.indexOf(value) === index).join(', ')}
                    </span>
                  </div>

                  <div className="flex py-3 border-b border-gray-100">
                    <span className="w-48 font-medium text-gray-700">Phạm vi độ cận</span>
                    <span className="text-gray-900">
                      {variants[0]?.refractionRanges?.map(r => 
                        `${r.refractionType}: ${r.minValue} đến ${r.maximumValue} (bước ${r.stepValue})`
                      ).join(', ') || 'Không có thông tin'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>
                <p className="text-gray-600">Hiện tại chưa có bài viết nào cho sản phẩm này.</p>
              </div>
            )}

            {activeTab === 'care' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Hướng dẫn bảo quản</h3>
                <div className="prose max-w-none">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Vệ sinh tròng kính bằng nước sạch và dung dịch chuyên dụng</li>
                    <li>Sử dụng khăn mềm, không xơ để lau khô</li>
                    <li>Tránh để tròng kính tiếp xúc với nhiệt độ cao</li>
                    <li>Bảo quản trong hộp đựng khi không sử dụng</li>
                    <li>Kiểm tra định kỳ để phát hiện sớm các vết xước hoặc hư hỏng</li>
                    <li>Tránh sử dụng các chất tẩy rửa mạnh</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LensDetailPage;
