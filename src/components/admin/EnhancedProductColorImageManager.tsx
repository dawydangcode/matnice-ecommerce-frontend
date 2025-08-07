import React, { useState, useCallback } from 'react';
import { 
  Button, 
  Upload, 
  Card, 
  Row, 
  Col, 
  message, 
  Image, 
  Typography, 
  Space,
  Badge,
  Tag,
  Tooltip,
  Progress
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { productColorImageService } from '../../services/product-color-image.service';
import {
  ColorImageUploadData,
  ImageOrder,
  IMAGE_ORDERS,
  THUMBNAIL_ORDERS,
} from '../../types/product-image.types';
import './EnhancedProductColorImageManager.css';

const { Text, Title } = Typography;

interface EnhancedProductColorImageManagerProps {
  productId: number;
  colorId: number;
  colorName: string;
  productNumber: string;
  onImagesChange?: (colorId: number, images: ColorImageUploadData[]) => void;
  initialImages?: ColorImageUploadData[];
  disabled?: boolean;
}

export const EnhancedProductColorImageManager: React.FC<EnhancedProductColorImageManagerProps> = ({
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
  const [uploadProgress, setUploadProgress] = useState<Map<ImageOrder, number>>(new Map());

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
    setUploadProgress(prev => new Map(prev).set(imageOrder, 0));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev.get(imageOrder) || 0;
          if (current < 90) {
            return new Map(prev).set(imageOrder, current + 10);
          }
          return prev;
        });
      }, 200);

      // Upload to server
      const uploadedImage = await productColorImageService.uploadProductColorImage({
        productId,
        colorId,
        productNumber,
        imageOrder,
        file,
      });

      clearInterval(progressInterval);
      setUploadProgress(prev => new Map(prev).set(imageOrder, 100));

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
      message.success(
        <span>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          Uploaded {productNumber}_{imageOrder} successfully!
          {newImageData.isThumbnail && (
            <Tag color="gold" style={{ marginLeft: 8 }}>
              <StarOutlined /> Thumbnail
            </Tag>
          )}
        </span>
      );

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(imageOrder);
          return newMap;
        });
      }, 1000);

    } catch (error: any) {
      setUploadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(imageOrder);
        return newMap;
      });
      message.error(`Failed to upload ${productNumber}_${imageOrder}: ${error.message}`);
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

      const removedImage = images.find(img => img.imageOrder === imageOrder);
      const newImages = images.filter(img => img.imageOrder !== imageOrder);
      updateImages(newImages);
      
      message.success(
        <span>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          Removed {productNumber}_{imageOrder} successfully!
          {removedImage?.isThumbnail && (
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (was thumbnail)
            </Text>
          )}
        </span>
      );
    } catch (error: any) {
      message.error(`Failed to remove image: ${error.message}`);
    }
  }, [productId, colorId, productNumber, images, updateImages, disabled]);

  const getImageByOrder = useCallback((order: ImageOrder) => {
    return images.find(img => img.imageOrder === order);
  }, [images]);

  const beforeUpload = useCallback((file: File, imageOrder: ImageOrder) => {
    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Only image files are allowed!');
      return false;
    }

    // Validate file size (max 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!');
      return false;
    }

    // Start upload
    handleImageUpload(file, imageOrder);
    return false; // Prevent default upload
  }, [handleImageUpload]);

  const renderImageSlot = useCallback((order: ImageOrder) => {
    const image = getImageByOrder(order);
    const isThumbnail = THUMBNAIL_ORDERS.includes(order);
    const isUploading = uploading.has(order);
    const progress = uploadProgress.get(order) || 0;
    const expectedFileName = productColorImageService.generateExpectedFileName(
      productNumber,
      order
    );

    const getSlotStatus = () => {
      if (image) return 'uploaded';
      if (isUploading) return 'uploading';
      return 'empty';
    };

    const status = getSlotStatus();

    return (
      <Col span={4} key={order}>
        <Badge.Ribbon 
          text={
            status === 'uploaded' ? 'Uploaded' : 
            status === 'uploading' ? 'Uploading...' : 
            'Empty'
          }
          color={
            status === 'uploaded' ? 'green' : 
            status === 'uploading' ? 'blue' : 
            'default'
          }
        >
          <Card
            size="small"
            className={`image-slot ${
              isThumbnail ? 'thumbnail-slot' : 'regular-slot'
            } ${status}-slot`}
            bodyStyle={{ padding: 8 }}
          >
            <div className="image-slot-container">
              {image ? (
                <div className="image-preview-container">
                  <div className="image-status-overlay">
                    <CheckCircleOutlined className="status-icon uploaded-icon" />
                    {image.isThumbnail && (
                      <StarOutlined className="thumbnail-icon" />
                    )}
                  </div>
                  <Image
                    src={image.imageUrl}
                    alt={expectedFileName}
                    className="image-preview"
                    preview={{
                      mask: <EyeOutlined style={{ fontSize: 16 }} />,
                    }}
                  />
                  <Space className="action-buttons">
                    <Tooltip title="Delete image">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleImageRemove(order)}
                        disabled={disabled || isUploading}
                      />
                    </Tooltip>
                  </Space>
                </div>
              ) : (
                <div className="upload-area">
                  {isUploading ? (
                    <div className="upload-progress">
                      <ClockCircleOutlined className="uploading-icon" />
                      <Progress 
                        percent={progress} 
                        size="small" 
                        status="active"
                        showInfo={false}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Uploading...
                      </Text>
                    </div>
                  ) : (
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file: File) => beforeUpload(file, order)}
                      disabled={disabled || isUploading}
                    >
                      <Button
                        type="dashed"
                        icon={<UploadOutlined />}
                        disabled={disabled}
                        className="upload-button"
                      >
                        <div className="upload-content">
                          <PlusOutlined className="upload-plus" />
                          <span>Upload</span>
                        </div>
                      </Button>
                    </Upload>
                  )}
                </div>
              )}
              
              <div className="image-info">
                <Text strong className="image-filename">
                  {expectedFileName}
                </Text>
                <div className="image-tags">
                  {isThumbnail && (
                    <Tag color="gold" icon={<StarOutlined />}>
                      Thumbnail
                    </Tag>
                  )}
                  {status === 'uploaded' && (
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Ready
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Badge.Ribbon>
      </Col>
    );
  }, [
    getImageByOrder,
    uploading,
    uploadProgress,
    productNumber,
    handleImageRemove,
    beforeUpload,
    disabled,
  ]);

  const getUploadStats = () => {
    const totalSlots = IMAGE_ORDERS.length;
    const uploadedCount = images.length;
    const thumbnailCount = images.filter(img => img.isThumbnail).length;
    const remainingSlots = totalSlots - uploadedCount;
    
    return {
      totalSlots,
      uploadedCount,
      thumbnailCount,
      remainingSlots,
      isComplete: uploadedCount === totalSlots
    };
  };

  const stats = getUploadStats();

  return (
    <Card 
      title={
        <Space>
          <Title level={5} className="title-container">
            Images for {colorName}
          </Title>
          <Tag color={stats.isComplete ? 'green' : 'blue'}>
            {stats.uploadedCount}/{stats.totalSlots} images
          </Tag>
          {stats.thumbnailCount > 0 && (
            <Tag color="gold" icon={<StarOutlined />}>
              {stats.thumbnailCount} thumbnails
            </Tag>
          )}
        </Space>
      }
      size="small"
      className="enhanced-product-color-image-manager"
      extra={
        <Space>
          {stats.isComplete && (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Complete
            </Tag>
          )}
          {stats.remainingSlots > 0 && (
            <Text type="secondary">
              {stats.remainingSlots} slots remaining
            </Text>
          )}
        </Space>
      }
    >
      <Row gutter={[12, 12]}>
        {IMAGE_ORDERS.map(renderImageSlot)}
      </Row>
      
      {images.length > 0 && (
        <div className="s3-structure-info">
          <Text strong>S3 Storage Structure:</Text>
          <div className="s3-path">
            <Text code>product_image/{productNumber}/</Text>
          </div>
          <div className="file-list">
            {images.map(img => (
              <div key={img.imageOrder} className="file-item">
                <CheckCircleOutlined className="file-status-icon" />
                <Text code className="file-name">
                  {productColorImageService.generateExpectedFileName(
                    productNumber, 
                    img.imageOrder,
                    img.imageUrl.split('.').pop()
                  )}
                </Text>
                {img.isThumbnail && (
                  <Tag color="gold" icon={<StarOutlined />}>
                    Thumbnail
                  </Tag>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedProductColorImageManager;
