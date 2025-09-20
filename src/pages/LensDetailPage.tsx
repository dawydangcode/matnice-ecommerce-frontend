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
  const [selectedStock, setSelectedStock] = useState('Đặt LAB nước ngoài');
  const [selectedThickness, setSelectedThickness] = useState<string>('');
  const [selectedCoating, setSelectedCoating] = useState<string>('');
  const [selectedVangPhu, setSelectedVangPhu] = useState<string>('');
  const [selectedFit, setSelectedFit] = useState<'Có' | 'Không'>('Không');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await apiService.get<LensFullDetails>(`/api/v1/lens/${id}/full-details`);
        setData(json);
        // Default selections
        if (json.variants && json.variants.length > 0) {
          setSelectedThickness(json.variants[0].lensThickness?.id || '');
        }
        if (json.coatings && json.coatings.length > 0) {
          setSelectedCoating(json.coatings[0].id);
        }
        if (json.coatings && json.coatings.length > 0) {
          setSelectedVangPhu(json.coatings[0].name);
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
            <div className="text-gray-500 mb-2">Xuất xứ: {lens.origin}</div>
            <div className="text-gray-500 mb-2">Loại tròng: {lens.lensType}</div>
            <div className="text-gray-500 mb-2">Tình trạng: {lens.status === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}</div>
            <div className="mb-4">{lens.description}</div>

            {/* Options UI giống ảnh */}
            <div className="mb-6 space-y-4">
              {/* Stock */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Stock</span>
                <button 
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    selectedStock === 'Đặt LAB nước ngoài' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedStock('Đặt LAB nước ngoài')}
                >
                  Đặt LAB nước ngoài
                </button>
                <span className="text-sm text-gray-500 ml-2">XÓA</span>
              </div>
              
              {/* Chiết suất */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Chiết suất</span>
                <div className="flex gap-2">
                  {variants.map(v => (
                    <button 
                      key={v.lensThickness.id} 
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        selectedThickness === v.lensThickness.id 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedThickness(v.lensThickness.id)}
                    >
                      {v.lensThickness.indexValue}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Lớp phủ */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Lớp phủ</span>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedCoating === 'BlueUV' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCoating('BlueUV')}
                  >
                    BlueUV
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedCoating === 'Clear' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCoating('Clear')}
                  >
                    Clear
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedCoating === 'Transitions Gen S' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCoating('Transitions Gen S')}
                  >
                    Transitions Gen S
                  </button>
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
              
              {/* Váng phủ */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Váng Phủ</span>
                <div className="flex gap-2">
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedVangPhu === 'Transitions XTRACTIVE' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedVangPhu('Transitions XTRACTIVE')}
                  >
                    Transitions XTRACTIVE
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedVangPhu === 'Transitions XTRACTIVE Polarized' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedVangPhu('Transitions XTRACTIVE Polarized')}
                  >
                    Transitions XTRACTIVE Polarized
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedVangPhu === 'CRIZAL ROCK' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedVangPhu('CRIZAL ROCK')}
                  >
                    CRIZAL ROCK
                  </button>
                </div>
              </div>
              
              {/* Công nghệ FIT */}
              <div className="flex items-center gap-4 mb-4">
                <span className="min-w-[120px] font-medium text-gray-700">Công nghệ FIT</span>
                <div className="flex gap-2">
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedFit === 'Có' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedFit('Có')}
                  >
                    Có
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedFit === 'Không' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedFit('Không')}
                  >
                    Không
                  </button>
                </div>
              </div>
            </div>

            {/* Giá và kho */}
            <div className="pricing-section">
              <div className="price-row">
                <span className="price-label">Giá</span>
                <span className="price-value">{formatVNDLocal(variants.find(v => v.lensThickness.id === selectedThickness)?.price || 0)}</span>
              </div>
              <div className="vat-note">VAT đã bao gồm</div>
              <div className={`stock-status ${summary.availableStock === 0 ? 'text-red-600' : ''}`}>{summary.availableStock === 0 ? 'Hết hàng' : 'Còn hàng'}</div>
            </div>

            {/* Nút hành động */}
            <div className="action-buttons">
              <button className="btn-primary">Mua ngay</button>
              <button className="btn-secondary">Tư vấn thêm</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LensDetailPage;
