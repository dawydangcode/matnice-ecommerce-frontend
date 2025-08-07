import React, { useState, useEffect, useCallback } from 'react';
import { Package, Image, Upload, Eye, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { productService } from '../../services/product.service';
import { productColorService, ProductColor } from '../../services/product-color.service';
import { ProductColorImageManager } from './ProductColorImageManager';
import { ProductColorForm } from './ProductColorForm';
import { Product } from '../../types/product.types';
import { CreateProductColorRequest } from '../../types/product-color.types';
import { ColorImageUploadData } from '../../types/product-image.types';
import './ImageManagementShowcase.css';

interface ProductStats {
  totalImages: number;
  thumbnailCount: number;
  colors: { [colorName: string]: number };
}

const showNotification = (type: 'success' | 'error', message: string) => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    background: ${type === 'success' ? '#52c41a' : '#ff4d4f'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

export const ImageManagementShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [selectedProductColor, setSelectedProductColor] = useState<ProductColor | null>(null);
  const [colorImages, setColorImages] = useState<{ [colorId: number]: ColorImageUploadData[] }>({});
  const [productStats, setProductStats] = useState<ProductStats>({
    totalImages: 0,
    thumbnailCount: 0,
    colors: {},
  });
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showColorForm, setShowColorForm] = useState(false);
  const [colorFormLoading, setColorFormLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products for ImageManagementShowcase...');
      const productResponse = await productService.getProducts({ limit: 100 });
      const productList = productResponse.products || [];
      setProducts(productList);
      console.log('Loaded products for ImageManagementShowcase:', productList);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadProductColors = async (productId: number) => {
    try {
      console.log('Loading product colors for product:', productId);
      const colors = await productColorService.getProductColors(productId);
      setProductColors(colors);
      console.log('Loaded product colors:', colors);
    } catch (error) {
      console.error('Failed to load product colors:', error);
      setProductColors([]);
    }
  };

  const handleCreateProductColor = async (data: CreateProductColorRequest) => {
    setColorFormLoading(true);
    try {
      console.log('Creating product color:', data);
      const newColor = await productColorService.createProductColor(data.productId, data);
      console.log('Created product color:', newColor);
      
      await loadProductColors(data.productId);
      setShowColorForm(false);
      showNotification('success', 'Tạo biến thể sản phẩm thành công!');
    } catch (error) {
      console.error('Failed to create product color:', error);
      showNotification('error', 'Tạo biến thể sản phẩm thất bại!');
    } finally {
      setColorFormLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductColor(null);
    setColorImages({});
    setProductStats({ totalImages: 0, thumbnailCount: 0, colors: {} });
    loadProductColors(product.productId);
  };

  const handleProductColorSelect = (productColor: ProductColor) => {
    setSelectedProductColor(productColor);
    loadProductColorImages(productColor.id);
  };

  const loadProductColorImages = async (productColorId: number) => {
    setLoading(true);
    try {
      console.log('Loading images for product color:', productColorId);
      const images: ColorImageUploadData[] = [];
      setColorImages({ [productColorId]: images });
    } catch (error) {
      console.error('Failed to load product color images:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = useCallback((imagesData: { [colorId: number]: ColorImageUploadData[] }) => {
    let totalImages = 0;
    let thumbnailCount = 0;
    const colors: { [colorName: string]: number } = {};

    Object.values(imagesData).forEach(images => {
      totalImages += images.length;
      images.forEach(image => {
        if (image.isThumbnail) {
          thumbnailCount++;
        }
        
        if (selectedProduct) {
          const mockColor = { id: image.colorId, name: `Color ${image.colorId}` };
          if (mockColor) {
            colors[mockColor.name] = (colors[mockColor.name] || 0) + 1;
          }
        }
      });
    });

    setProductStats({ totalImages, thumbnailCount, colors });
  }, [selectedProduct]);

  const handleImagesChange = (colorId: number, images: ColorImageUploadData[]) => {
    const newColorImages = {
      ...colorImages,
      [colorId]: images,
    };
    setColorImages(newColorImages);
    calculateStats(newColorImages);
  };

  const renderModeToggle = () => (
    <div className="mode-toggle-container">
      <div className="mode-info">
        <h2>Product Image Management System</h2>
        <p>Hệ thống quản lý hình ảnh sản phẩm với biến thể màu sắc</p>
      </div>
      
      <div className="alert-info">
        <div className="alert-content">
          <div><strong>Production Mode:</strong> Workflow: Chọn sản phẩm → Tạo biến thể → Upload hình ảnh</div>
          <div><strong>Demo Mode:</strong> Giao diện demo với dữ liệu mẫu</div>
        </div>
      </div>

      <div className="toggle-switch">
        <span>Demo Mode</span>
        <button 
          className={`toggle-button ${showDemo ? 'off' : 'on'}`}
          onClick={() => setShowDemo(!showDemo)}
        >
          {showDemo ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
          <span className="toggle-text">
            {showDemo ? 'Demo' : 'Production'}
          </span>
        </button>
        <span>Production Mode</span>
      </div>
    </div>
  );

  return (
    <div className="image-management-showcase">
      {renderModeToggle()}
      
      {showDemo ? (
        <div className="demo-container">
          <div className="demo-header">
            <h3>Demo Mode - Sample Product</h3>
            <p>This is a demo version with sample data for testing</p>
          </div>
          
          <ProductColorImageManager
            productId={1}
            colorId={1}
            colorName="Black"
            productNumber="DEMO001"
            onImagesChange={() => {}}
            disabled={false}
          />
        </div>
      ) : (
        <div className="showcase-content">
          <div className="left-panel">
            <div className="product-selector">
              <div className="selector-header">
                <Package size={20} />
                <h3>1. Chọn Sản Phẩm</h3>
              </div>
              
              <div className="product-grid">
                {products.map(product => (
                  <div
                    key={product.productId}
                    className={`product-card ${selectedProduct?.productId === product.productId ? 'selected' : ''}`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="product-info">
                      <div className="product-number">#{product.productId}</div>
                      <div className="product-name">{product.productName}</div>
                      <div className="product-colors">
                        {productColors.length} biến thể
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <div className="product-colors-section">
                <div className="section-header">
                  <Eye size={20} />
                  <h3>2. Quản Lý Biến Thể</h3>
                  <button 
                    className="add-button"
                    onClick={() => setShowColorForm(true)}
                  >
                    <Plus size={16} />
                    Thêm Biến Thể
                  </button>
                </div>

                <div className="product-colors-list">
                  {productColors.map(color => (
                    <div
                      key={color.id}
                      className={`color-card ${selectedProductColor?.id === color.id ? 'selected' : ''}`}
                      onClick={() => handleProductColorSelect(color)}
                    >
                      <div className="color-info">
                        <div className="color-name">{color.color_name}</div>
                        <div className="variant-name">{color.product_variant_name}</div>
                        <div className="product-number">{color.product_number}</div>
                        <div className="stock">Stock: {color.stock}</div>
                        {color.is_thumbnail && <div className="thumbnail-badge">Thumbnail</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="main-panel">
            {selectedProductColor ? (
              <div className="image-manager-section">
                <div className="section-header">
                  <Upload size={20} />
                  <h3>3. Upload Hình Ảnh - {selectedProductColor.color_name}</h3>
                </div>
                
                <ProductColorImageManager
                  productId={selectedProduct!.productId}
                  colorId={selectedProductColor.id}
                  colorName={selectedProductColor.color_name}
                  productNumber={selectedProductColor.product_number}
                  initialImages={colorImages[selectedProductColor.id] || []}
                  onImagesChange={handleImagesChange}
                />
              </div>
            ) : selectedProduct ? (
              <div className="no-color-selection">
                <Image size={48} />
                <p>Vui lòng chọn một biến thể để quản lý hình ảnh</p>
                <p className="help-text">Hoặc tạo biến thể mới bằng nút "Thêm Biến Thể"</p>
              </div>
            ) : (
              <div className="no-selection">
                <Package size={48} />
                <p>Vui lòng chọn một sản phẩm để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showColorForm && selectedProduct && (
        <ProductColorForm
          productId={selectedProduct.productId}
          onSubmit={handleCreateProductColor}
          onCancel={() => setShowColorForm(false)}
          loading={colorFormLoading}
        />
      )}
    </div>
  );
};

export default ImageManagementShowcase;
