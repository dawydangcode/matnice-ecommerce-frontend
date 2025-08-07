import React, { useState, useEffect, useCallback } from 'react';
import { Package, Image, Upload, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { productService } from '../../services/product.service';
import { productColorImageService } from '../../services/product-color-image.service';
import { ProductColorImageManager } from './ProductColorImageManager';
import { Product } from '../../types/product.types';
import { ColorImageUploadData } from '../../types/product-image.types';
import './ImageManagementShowcase.css';

interface ProductStats {
  totalImages: number;
  thumbnailCount: number;
  colors: { [colorName: string]: number };
}

export const ImageManagementShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [colorImages, setColorImages] = useState<{ [colorId: number]: ColorImageUploadData[] }>({});
  const [productStats, setProductStats] = useState<ProductStats>({
    totalImages: 0,
    thumbnailCount: 0,
    colors: {},
  });
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products for ImageManagementShowcase...');
      
      // Use the working API endpoint
      const productResponse = await productService.getProducts({ limit: 100 });
      const productList = productResponse.products || [];
      setProducts(productList);
      console.log('Loaded products for ImageManagementShowcase:', productList); // Debug log
    } catch (error) {
      console.error('Failed to load products:', error);
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
        
        // Find color name for this image
        if (selectedProduct) {
          // For now, use a mock color structure since Product doesn't have colors directly
          const mockColor = { id: image.colorId, name: `Color ${image.colorId}` };
          if (mockColor) {
            colors[mockColor.name] = (colors[mockColor.name] || 0) + 1;
          }
        }
      });
    });

    setProductStats({ totalImages, thumbnailCount, colors });
  }, [selectedProduct]);

  const loadProductImages = useCallback(async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const imagesData = await productColorImageService.getProductImagesGroupedByColor(
        selectedProduct.productId
      );
      
      // Convert the API response to the expected format
      const convertedImages: { [colorId: number]: ColorImageUploadData[] } = {};
      Object.entries(imagesData).forEach(([colorId, images]) => {
        convertedImages[parseInt(colorId)] = images.map((img: any) => ({
          id: img.id,
          colorId: parseInt(colorId),
          imageOrder: img.imageOrder,
          imageUrl: img.imageUrl,
          isThumbnail: img.isThumbnail,
          productNumber: selectedProduct.productDetail?.productNumber || selectedProduct.productName
        }));
      });
      
      setColorImages(convertedImages);
      calculateStats(convertedImages);
    } catch (error) {
      console.error('Failed to load product images:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProduct, calculateStats]);

  useEffect(() => {
    if (selectedProduct) {
      loadProductImages();
    }
  }, [selectedProduct, loadProductImages]);

  const handleImagesChange = (colorId: number, images: ColorImageUploadData[]) => {
    const newColorImages = {
      ...colorImages,
      [colorId]: images,
    };
    setColorImages(newColorImages);
    calculateStats(newColorImages);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setColorImages({});
    setProductStats({ totalImages: 0, thumbnailCount: 0, colors: {} });
  };

  const renderModeToggle = () => (
    <div className="mode-toggle-container">
      <div className="mode-info">
        <h2>Product Image Management System</h2>
        <p>Hệ thống quản lý hình ảnh sản phẩm với AWS S3 integration</p>
      </div>
      
      <div className="alert-info">
        <div className="alert-content">
          <div><strong>Production Mode:</strong> Giao diện chính thức với đầy đủ tính năng quản lý sản phẩm</div>
          <div><strong>Demo Mode:</strong> Giao diện demo với dữ liệu mẫu để test chức năng upload</div>
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

  const renderProductSelector = () => (
    <div className="product-selector">
      <div className="selector-header">
        <Package size={20} />
        <h3>Select Product</h3>
      </div>
      
      <div className="product-grid">
        {products.map(product => (
          <div
            key={product.productId}
            className={`product-card ${selectedProduct?.productId === product.productId ? 'selected' : ''}`}
            onClick={() => handleProductSelect(product)}
          >
            <div className="product-info">
              <div className="product-number">#{product.productDetail?.productNumber || 'N/A'}</div>
              <div className="product-name">{product.productName}</div>
              <div className="product-colors">
                0 colors available
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatsPanel = () => (
    <div className="stats-panel">
      <div className="stats-header">
        <Eye size={20} />
        <h4>Image Statistics</h4>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{productStats.totalImages}</div>
          <div className="stat-label">Total Images</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-number">{productStats.thumbnailCount}</div>
          <div className="stat-label">Thumbnails</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-number">{Object.keys(productStats.colors).length}</div>
          <div className="stat-label">Colors with Images</div>
        </div>
      </div>
      
      {Object.keys(productStats.colors).length > 0 && (
        <div className="color-breakdown">
          <h5>Images by Color:</h5>
          <ul className="color-list">
            {Object.entries(productStats.colors).map(([colorName, count]) => (
              <li key={colorName} className="color-item">
                <span className="color-name">{colorName}</span>
                <span className="color-count">{count} images</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderImageManagers = () => {
    if (!selectedProduct) {
      return (
        <div className="no-selection">
          <Image size={48} />
          <p>Select a product to manage its color images</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product images...</p>
        </div>
      );
    }

    // For demo purposes, create some mock colors
    const mockColors = [
      { id: 1, name: 'Black' },
      { id: 2, name: 'White' },
      { id: 3, name: 'Brown' }
    ];

    return (
      <div className="image-managers">
        <div className="managers-header">
          <Upload size={20} />
          <h4>Manage Color Images for {selectedProduct.productName}</h4>
        </div>
        
        {mockColors.map(color => (
          <ProductColorImageManager
            key={color.id}
            productId={selectedProduct.productId}
            colorId={color.id}
            colorName={color.name}
            productNumber={selectedProduct.productDetail?.productNumber || selectedProduct.productName}
            initialImages={colorImages[color.id] || []}
            onImagesChange={handleImagesChange}
          />
        ))}
      </div>
    );
  };

  const renderDemoMode = () => (
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
      
      <ProductColorImageManager
        productId={1}
        colorId={2}
        colorName="White"
        productNumber="DEMO001"
        onImagesChange={() => {}}
        disabled={false}
      />
    </div>
  );

  return (
    <div className="image-management-showcase">
      {renderModeToggle()}
      
      {showDemo ? (
        renderDemoMode()
      ) : (
        <div className="showcase-content">
          <div className="left-panel">
            {renderProductSelector()}
            {selectedProduct && renderStatsPanel()}
          </div>
          
          <div className="main-panel">
            {renderImageManagers()}
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageManagementShowcase;
