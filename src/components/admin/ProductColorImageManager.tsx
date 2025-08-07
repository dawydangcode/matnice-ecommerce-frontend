import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye 
} from 'lucide-react';
import { productColorImageService } from '../../services/product-color-image.service';
import {
  ColorImageUploadData,
  ImageOrder,
  IMAGE_ORDERS,
  THUMBNAIL_ORDERS,
} from '../../types/product-image.types';
import './ProductColorImageManager.css';

interface ProductColorImageManagerProps {
  productId: number;
  colorId: number;
  colorName: string;
  productNumber: string;
  onImagesChange?: (colorId: number, images: ColorImageUploadData[]) => void;
  initialImages?: ColorImageUploadData[];
  disabled?: boolean;
}

const showNotification = (type: 'success' | 'error', message: string) => {
  // Simple notification - in a real app you'd use a proper toast library
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

export const ProductColorImageManager: React.FC<ProductColorImageManagerProps> = ({
  productId,
  colorId,
  colorName,
  productNumber,
  onImagesChange,
  initialImages = [],
  disabled = false,
}) => {
  const [images, setImages] = useState<ColorImageUploadData[]>(initialImages);
  const [uploading, setUploading] = useState<Set<ImageOrder>>(new Set());

  const updateImages = useCallback((newImages: ColorImageUploadData[]) => {
    setImages(newImages);
    onImagesChange?.(colorId, newImages);
  }, [colorId, onImagesChange]);

  const handleImageUpload = useCallback(async (
    file: File,
    imageOrder: ImageOrder
  ) => {
    if (disabled) return;

    setUploading(prev => new Set(prev).add(imageOrder));

    try {
      // Upload to server
      const uploadedImage = await productColorImageService.uploadProductColorImage({
        productId,
        colorId,
        productNumber,
        imageOrder,
        file,
      });

      // Update local state
      const newImages = images.filter(img => img.imageOrder !== imageOrder);
      const newImageData: ColorImageUploadData = {
        id: uploadedImage.id,
        colorId,
        imageOrder,
        imageUrl: uploadedImage.imageUrl,
        isThumbnail: uploadedImage.isThumbnail,
        productNumber,
      };
      
      newImages.push(newImageData);
      newImages.sort((a, b) => a.imageOrder.localeCompare(b.imageOrder));
      
      updateImages(newImages);
      showNotification('success', `Uploaded ${productNumber}_${imageOrder} successfully!`);
    } catch (error: any) {
      showNotification('error', `Failed to upload ${productNumber}_${imageOrder}: ${error.message}`);
    } finally {
      setUploading(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageOrder);
        return newSet;
      });
    }
  }, [productId, colorId, productNumber, images, updateImages, disabled]);

  const handleImageRemove = useCallback(async (imageOrder: ImageOrder) => {
    if (disabled) return;

    try {
      await productColorImageService.deleteProductColorImage(
        productId,
        colorId,
        imageOrder
      );

      const newImages = images.filter(img => img.imageOrder !== imageOrder);
      updateImages(newImages);
      showNotification('success', `Removed ${productNumber}_${imageOrder} successfully!`);
    } catch (error: any) {
      showNotification('error', `Failed to remove image: ${error.message}`);
    }
  }, [productId, colorId, productNumber, images, updateImages, disabled]);

  const getImageByOrder = useCallback((order: ImageOrder) => {
    return images.find(img => img.imageOrder === order);
  }, [images]);

  const handleFileSelect = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    imageOrder: ImageOrder
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      showNotification('error', 'Only image files are allowed!');
      return;
    }

    // Validate file size (max 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      showNotification('error', 'Image must be smaller than 10MB!');
      return;
    }

    // Start upload
    handleImageUpload(file, imageOrder);
    
    // Reset input
    event.target.value = '';
  }, [handleImageUpload]);

  const renderImageSlot = useCallback((order: ImageOrder) => {
    const image = getImageByOrder(order);
    const isThumbnail = THUMBNAIL_ORDERS.includes(order);
    const isUploading = uploading.has(order);
    const expectedFileName = productColorImageService.generateExpectedFileName(
      productNumber,
      order
    );

    return (
      <div key={order} className="image-slot-wrapper">
        <div className={`image-slot ${isThumbnail ? 'thumbnail-slot' : 'regular-slot'}`}>
          <div className="image-slot-container">
            {image ? (
              <div className="image-preview-container">
                <img
                  src={image.imageUrl}
                  alt={expectedFileName}
                  className="image-preview"
                />
                <div className="image-overlay">
                  <button
                    className="overlay-button view-button"
                    onClick={() => window.open(image.imageUrl, '_blank')}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="overlay-button delete-button"
                    onClick={() => handleImageRemove(order)}
                    disabled={disabled || isUploading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, order)}
                  disabled={disabled || isUploading}
                  className="file-input"
                  id={`file-input-${order}`}
                />
                <label 
                  htmlFor={`file-input-${order}`}
                  className={`upload-button ${disabled || isUploading ? 'disabled' : ''}`}
                >
                  {isUploading ? (
                    <div className="uploading-indicator">
                      <div className="spinner"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="upload-content">
                      <Plus size={24} />
                      <span>Upload</span>
                    </div>
                  )}
                </label>
              </div>
            )}
            
            <div className="image-info">
              <div className="image-filename">{expectedFileName}</div>
              {isThumbnail && (
                <div className="thumbnail-badge">Thumbnail</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    getImageByOrder,
    uploading,
    productNumber,
    handleImageRemove,
    handleFileSelect,
    disabled,
  ]);

  return (
    <div className="product-color-image-manager">
      <div className="manager-header">
        <h5 className="manager-title">Images for {colorName}</h5>
        <span className="image-count">({images.length}/5 images)</span>
      </div>
      
      <div className="image-grid">
        {IMAGE_ORDERS.map(renderImageSlot)}
      </div>
      
      {images.length > 0 && (
        <div className="s3-structure-info">
          <div className="s3-title">S3 Structure:</div>
          <div className="s3-path">product_image/{productNumber}/</div>
          <ul className="file-list">
            {images.map(img => (
              <li key={img.imageOrder} className="file-item">
                <code className="file-name">
                  {productColorImageService.generateExpectedFileName(
                    productNumber, 
                    img.imageOrder,
                    img.imageUrl.split('.').pop()
                  )}
                </code>
                {img.isThumbnail && (
                  <span className="file-thumbnail-badge">(Thumbnail)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductColorImageManager;
