import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import SuccessModal from '../components/SuccessModal';
import productService, { ProductDetail } from '../services/productService';
import { product3DModelService, Product3DModel, Model3DConfig } from '../services/product3dModel.service';
import cartService from '../services/cart.service';
import '../styles/ProductDetailPage.css';
import { Glasses, Handbag, ShoppingCart, X, Video } from 'lucide-react';



const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 3D Model states
  const [product3DModel, setProduct3DModel] = useState<Product3DModel | null>(null);
  const [model3DConfig, setModel3DConfig] = useState<Model3DConfig | null>(null);
  const [model3DLoading, setModel3DLoading] = useState(false);
  const [model3DError, setModel3DError] = useState<string | null>(null);

  // Helper function to create backend proxy URL for 3D model
  const getModelProxyUrl = (productId: number): string => {
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    return `${backendUrl}/api/v1/product-3d-model/serve/${productId}`;
  };

  // Load 3D model and config data from database
  const load3DModelData = async (productId: number) => {
    try {
      setModel3DLoading(true);
      setModel3DError(null);
      
      console.log('Loading 3D model for product ID:', productId);
      
      // Get active 3D model for this product
      const activeModels = await product3DModelService.getActiveByProductId(productId);
      console.log('Active 3D models:', activeModels);
      
      if (activeModels && activeModels.length > 0) {
        const model = activeModels[0]; // Use first active model
        setProduct3DModel(model);
        console.log('3D Model loaded:', model);
        
        // Load config for this model
        const config = await product3DModelService.getConfigByModelId(model.id);
        if (config) {
          setModel3DConfig(config);
          console.log('3D Model config loaded:', config);
        } else {
          console.log('No config found for model ID:', model.id);
          // Set default config if none exists
          setModel3DConfig(null);
        }
      } else {
        console.log('No active 3D models found for product ID:', productId);
        setProduct3DModel(null);
        setModel3DConfig(null);
      }
    } catch (error) {
      console.error('Error loading 3D model data:', error);
      setModel3DError('Failed to load 3D model');
      setProduct3DModel(null);
      setModel3DConfig(null);
    } finally {
      setModel3DLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts or product ID changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
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

        // Load 3D model data
        await load3DModelData(parseInt(id));
        
        // Fallback data nếu API không trả về đủ dữ liệu
        const mockProductData = {
          ...productData,
          // Keep original productType from API, don't override with default
          product_type: productData.product_type || productData.productType || 'glasses',
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
          setSelectedColorId(mockProductData.productColors[0].id);
          console.log('Selected color:', mockProductData.productColors[0].colorName);
          console.log('Selected color ID:', mockProductData.productColors[0].id);
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

  const getColorPreviewImage = (colorId: number) => {
    // Tìm hình ảnh với imageOrder = 'a' cho màu này
    return product?.productImages?.find((img: any) => 
      img.productColorId === colorId && img.imageOrder === 'a'
    );
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

  const isGlasses = () => {
    // Check both productType (camelCase from API) and product_type (snake_case)
    const result = product?.productType === 'glasses' || product?.product_type === 'glasses';
    console.log('isGlasses check:', {
      productType: product?.productType,
      product_type: product?.product_type,
      result: result
    });
    return result;
  };

  const handleAddFrameToCart = async () => {
    if (!product || !selectedColorId) {
      alert('Please select a color first');
      return;
    }

    try {
      // Get or create cart
      const cartData = await cartService.getOrCreateCart();
      
      const framePrice = getPrice();
      const frameData = {
        cartId: cartData.cartId,
        productId: product.id,
        quantity: 1,
        framePrice: framePrice,
        totalPrice: framePrice, // For frame only, total price = frame price
        discount: 0,
        selectedColorId: selectedColorId,
      };

      console.log('Adding frame to cart:', frameData);
      
      const response = await cartService.addFrameOnlyToCart(frameData);
      console.log('Frame added successfully:', response);
      
      // Show success modal
      setSuccessMessage(`${isGlasses() ? 'Frame' : 'Sunglasses'} added to cart successfully!`);
      setIsSuccessModalOpen(true);
      
    } catch (error) {
      console.error('Error adding frame to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    // Reload page to update cart count
    window.location.reload();
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
                      <button 
                        className={`virtual-tryon-btn ${!product3DModel ? 'disabled' : ''}`}
                        onClick={() => product3DModel && setIsVirtualTryOnOpen(true)}
                        disabled={!product3DModel || model3DLoading}
                        title={
                          model3DLoading ? 'Loading 3D model...' :
                          !product3DModel ? 'No 3D model available' :
                          model3DError ? 'Error loading 3D model' :
                          'Try on virtually with AR'
                        }
                      >
                        {model3DLoading ? '⏳ Loading...' : 
                         !product3DModel ? (
                           <>
                             <X size={16} className="inline mr-1" />
                             No 3D Model
                           </>
                         ) :
                         model3DError ? '⚠️ Error' :
                         (
                           <>
                             <Video size={20} className="inline mr-1" />
                             Virtual try-on
                           </>
                         )}
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
              {isGlasses() ? 'Glasses' : 'Sunglasses'} / {product.brand?.name} {isGlasses() ? 'Glasses' : 'Sunglasses'}
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
                {product.productColors?.slice(0, 6).map((color: any) => {
                  const previewImage = getColorPreviewImage(color.id);
                  return (
                    <button
                      key={color.id}
                      className={`color-option ${selectedColor === color.colorName ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedColor(color.colorName);
                        setSelectedColorId(color.id);
                        console.log('Selected color:', color.colorName, 'ID:', color.id);
                      }}
                      title={color.colorName}
                    >
                      {previewImage ? (
                        <div className="color-image-preview">
                          <img 
                            src={previewImage.imageUrl} 
                            alt={color.colorName}
                            className="color-preview-img"
                          />
                        </div>
                      ) : (
                        <div className={`color-swatch ${getColorClass(color.colorName)}`}></div>
                      )}
                    </button>
                  );
                })}
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
              {isGlasses() ? (
                <>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate(`/lens-selection?productId=${id}&selectedColorId=${selectedColorId}`)}
                  >
                    <Handbag className="icon-inline" size={24} />
                    With prescription from {formatVND(getPrescriptionPrice())}
                  </button>
                  <button className="btn-secondary" onClick={handleAddFrameToCart}>
                    Buy frame only
                  </button>
                  <div className="divider">or</div>
                  <button className="btn-outline">
                    Try at home
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={handleAddFrameToCart}>
                    <ShoppingCart className="icon-inline" size={24} />
                    Add to basket
                  </button>
                  <div className="divider">or</div>
                  <button className="btn-outline">
                    Try at home
                  </button>
                </>
              )}
            </div>

            {/* Delivery Times */}
            <div className="delivery-info">
              <h3 className="delivery-title">Delivery times</h3>
              {isGlasses() ? (
                <>
                  <div className="delivery-option">
                    <Glasses className="inline-icon" />                
                    <span className="delivery-text">With prescription / Tint</span>
                    <span className="delivery-time">7 - 15 days</span>
                  </div>
                  <div className="delivery-option">
                    <span className="delivery-icon">👓</span>
                    <span className="delivery-text">Try at home / Frame only</span>
                    <span className="delivery-time">3 - 5 days</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="delivery-option">
                    <span className="delivery-icon">🕶️</span>
                    <span className="delivery-text">Sunglasses delivery</span>
                    <span className="delivery-time">3 - 5 days</span>
                  </div>
                  <div className="delivery-option">
                    <span className="delivery-icon">👓</span>
                    <span className="delivery-text">Try at home</span>
                    <span className="delivery-time">3 - 5 days</span>
                  </div>
                </>
              )}
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

      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={isVirtualTryOnOpen}
        onClose={() => setIsVirtualTryOnOpen(false)}
        productName={`${product?.brand?.name} ${product?.productName}`}
        model3dUrl={product3DModel ? getModelProxyUrl(parseInt(id || '0')) : undefined}
        glassesConfig={model3DConfig ? {
          offsetX: model3DConfig.offsetX,
          offsetY: model3DConfig.offsetY,
          positionOffsetX: model3DConfig.positionOffsetX,
          positionOffsetY: model3DConfig.positionOffsetY,
          positionOffsetZ: model3DConfig.positionOffsetZ,
          initialScale: model3DConfig.initialScale
        } : undefined}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Added to Cart!"
        message={successMessage}
        onConfirm={handleSuccessModalClose}
      />
    </div>
  );
};

export default ProductDetailPage;
