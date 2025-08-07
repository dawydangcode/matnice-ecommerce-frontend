import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { productService } from '../../services/product.service';
import { Product } from '../../types/product.types';

export const ProductLoader: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to load products...');
      
      // Try the getProductsWithColors method first
      const productList = await productService.getProductsWithColors();
      console.log('Successfully loaded products with colors:', productList);
      setProducts(productList);
      
    } catch (err: any) {
      console.error('Failed to load products with colors, trying regular getProducts:', err);
      
      try {
        // Fallback to regular getProducts
        const response = await productService.getProducts({ limit: 50 });
        console.log('Successfully loaded products:', response);
        const productList = response.products || [];
        setProducts(productList);
      } catch (fallbackErr: any) {
        console.error('Both methods failed:', fallbackErr);
        setError(`Failed to load products: ${fallbackErr.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2>Product Loader Test</h2>
        <button 
          onClick={loadProducts}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: loading ? '#f5f5f5' : 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <RefreshCw size={16} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          padding: '12px', 
          background: '#fff2f0', 
          border: '1px solid #ffccc7',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <strong>Status:</strong> {loading ? 'Loading...' : `Loaded ${products.length} products`}
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px' }}>
        <h3>Products ({products.length})</h3>
        
        {products.length === 0 && !loading && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No products found</p>
        )}
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {products.map((product) => (
            <div 
              key={product.productId} 
              style={{ 
                border: '1px solid #f0f0f0', 
                padding: '12px', 
                borderRadius: '4px',
                background: '#fafafa'
              }}
            >
              <div><strong>ID:</strong> {product.productId}</div>
              <div><strong>Name:</strong> {product.productName}</div>
              <div><strong>Type:</strong> {product.productType}</div>
              <div><strong>Price:</strong> ${product.price}</div>
              <div><strong>Stock:</strong> {product.stock}</div>
              {product.productDetail?.productNumber && (
                <div><strong>Product Number:</strong> {product.productDetail.productNumber}</div>
              )}
              {product.brand && (
                <div><strong>Brand:</strong> {product.brand.name}</div>
              )}
              {product.category && (
                <div><strong>Category:</strong> {product.category.name}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductLoader;
