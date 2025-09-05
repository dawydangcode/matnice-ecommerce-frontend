import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import productService, { ProductDetail } from '../services/productService';
import '../styles/ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productService.getProductWithDetails(parseInt(id));
        console.log('Product data received:', productData);
        
        // Fallback data nếu API không trả về đủ dữ liệu
        const mockProductData = {
          ...productData,
          productColors: (productData.productColors && productData.productColors.length > 0) ? productData.productColors : [
            { id: 5, colorName: 'Havana', productVariantName: '002', productNumber: '6514022', stock: 10, isThumbnail: true },
            { id: 6, colorName: 'Black', productVariantName: '001', productNumber: '6514021', stock: 5, isThumbnail: false },
            { id: 7, colorName: 'Green', productVariantName: '003', productNumber: '6514023', stock: 8, isThumbnail: false }
          ],
          productImages: (productData.productImages && productData.productImages.length > 0) ? productData.productImages : [
            { id: 13, imageUrl: 'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_a.png', imageOrder: 'a', productColorId: 5 },
            { id: 14, imageUrl: 'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_b.png', imageOrder: 'b', productColorId: 5 },
            { id: 15, imageUrl: 'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_c.png', imageOrder: 'c', productColorId: 5 },
            { id: 16, imageUrl: 'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_d.png', imageOrder: 'd', productColorId: 5 }
          ],
          productDetail: productData.productDetail || {
            id: 4,
            frameWidth: 136,
            frameMaterial: 'plastic',
            frameShape: 'rectangle',
            frameType: 'full_rim',
            bridgeDesign: 'without_nose_pads',
            style: 'classic',
            springHinges: true,
            weight: 34,
            multifocal: true,
            bridgeWidth: 17,
            lensHeight: 38,
            lensWidth: 55,
            templeLength: 145
          }
        };
        
        setProduct(mockProductData);
        
        // Set default selections
        if (mockProductData.productColors && mockProductData.productColors.length > 0) {
          setSelectedColor(mockProductData.productColors[0].colorName);
          console.log('Selected color:', mockProductData.productColors[0].colorName);
        }
        console.log('Frame width:', mockProductData.productDetail.frameWidth);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getSelectedColorData = () => {
    return product?.productColors?.find((color: any) => color.colorName === selectedColor);
  };

  const getStockStatus = () => {
    const colorData = getSelectedColorData();
    if (colorData && colorData.stock > 0) {
      return { status: 'In stock', color: '#059669' };
    }
    return { status: 'Out of stock', color: '#dc2626' };
  };

  const getColorClass = (colorName: string) => {
    const color = colorName.toLowerCase();
    if (color.includes('havana') || color.includes('tortoise')) return 'havana';
    if (color.includes('black') || color.includes('noir')) return 'black';
    if (color.includes('green')) return 'green';
    if (color.includes('brown')) return 'brown';
    if (color.includes('blue')) return 'blue';
    if (color.includes('red')) return 'red';
    if (color.includes('clear') || color.includes('transparent')) return 'clear';
    return 'clear';
  };

  const getImagesByColor = () => {
    const colorData = getSelectedColorData();
    if (colorData && product?.productImages) {
      return product.productImages.filter((img: any) => img.productColorId === colorData.id);
    }
    return product?.productImages?.slice(0, 4) || [];
  };

  const getAdditionalColorsCount = () => {
    const totalColors = product?.productColors?.length || 0;
    return totalColors > 6 ? totalColors - 6 : 0;
  };

  const getPrice = () => {
    return product?.price || 0;
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getPrescriptionPrice = () => {
    return getPrice() + 600000; // Adding prescription fee in VND (~24.95 USD * 24000)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg text-red-600">{error || 'Product not found'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />
      
      <main className="flex-grow">
        <div className="product-detail-container">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="gallery-grid">
              {getImagesByColor().map((image: any, index: number) => (
                <div key={index} className="gallery-item">
                  <img 
                    src={image.imageUrl} 
                    alt={`${product.brand?.name} ${product.productName}`}
                    className="gallery-image"
                    width="400"
                    height="300"
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable="false"
                  />
                  {index === 0 && (
                    <div className="virtual-tryon-overlay">
                      <button className="virtual-tryon-btn">
                        👁️ Virtual try-on
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Category and Brand Breadcrumb */}
            <div className="product-category">
              Glasses / {product.brand?.name} Glasses
            </div>

            {/* Brand and Product Name */}
            <h1 className="product-brand">{product.brand?.name}</h1>
            <h2 className="product-name">
              {product.productName} {getSelectedColorData()?.productVariantName || ''}
            </h2>

            {/* Color Selection */}
            <div className="color-section">
              <label className="section-label">Colour: {selectedColor}</label>
              <div className="color-options">
                {product.productColors?.slice(0, 6).map((color: any) => (
                  <button
                    key={color.id}
                    className={`color-option ${selectedColor === color.colorName ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color.colorName)}
                    title={color.colorName}
                  >
                    <div className={`color-swatch ${getColorClass(color.colorName)}`}></div>
                  </button>
                ))}
                {getAdditionalColorsCount() > 0 && (
                  <div className="color-count">+{getAdditionalColorsCount()}</div>
                )}
              </div>
            </div>

            {/* Frame Width */}
            <div className="frame-width-section">
              <label className="section-label">Frame width</label>
              <div className="frame-width-display">
                <span className="frame-width-value">
                  {product.productDetail?.frameWidth || 136} mm
                </span>
              </div>
              <div className={`stock-status ${getStockStatus().status === 'Out of stock' ? 'text-red-600' : ''}`}>
                <span 
                  className={`stock-indicator ${getStockStatus().status === 'Out of stock' ? 'out-of-stock' : ''}`}
                ></span>
                {getStockStatus().status}
              </div>
            </div>

            {/* Prescription Info */}
            <div className="prescription-info">
              <p>Do you already own a pair of our glasses? <button className="text-link">Log in now</button> to see if this frame fits the recommended size.</p>
            </div>

            {/* Pricing */}
            <div className="pricing-section">
              <div className="price-row">
                <span className="price-label">Price without lenses</span>
                <span className="price-value">{formatVND(getPrice())}</span>
              </div>
              <div className="vat-note">VAT included</div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-primary">
                🔒 With prescription from {formatVND(getPrescriptionPrice())}
              </button>
              <button className="btn-secondary">
                Buy frame only
              </button>
              <div className="divider">or</div>
              <button className="btn-outline">
                Try at home
              </button>
              <p className="service-note">Plus service fee for home trial orders ℹ️</p>
            </div>

            {/* Additional Options */}
            <div className="additional-options">
              <button className="btn-link">💙 Buy risk-free online</button>
            </div>

            {/* Delivery Times */}
            <div className="delivery-info">
              <h3 className="delivery-title">Delivery times</h3>
              <div className="delivery-option">
                <span className="delivery-icon">💊</span>
                <span className="delivery-text">With prescription / Tint</span>
                <span className="delivery-time">7 - 15 days</span>
              </div>
              <div className="delivery-option">
                <span className="delivery-icon">👓</span>
                <span className="delivery-text">Try at home / Frame only</span>
                <span className="delivery-time">3 - 5 days</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <span className="trust-icon">🏆</span>
                <span className="trust-text">Over 15 years of optical expertise</span>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">💰</span>
                <span className="trust-text">30-Day Money Back Guarantee</span>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">📦</span>
                <span className="trust-text">All available products are currently in stock</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
