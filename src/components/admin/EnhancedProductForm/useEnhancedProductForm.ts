import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormData, productSchema, ProductColor } from './types';
import {
  Product,
  ProductType,
  ProductGenderType,
  CreateProductDetailRequest,
  FrameMaterialType,
  FrameType,
  FrameBridgeDesignType,
  FrameStyleType,
  FrameShapeType,
} from '../../../types/product.types';

export const useEnhancedProductForm = (product?: Product | null) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'detail' | 'colors'>(
    'basic',
  );
  const [productColors, setProductColors] = useState<ProductColor[]>([
    {
      productVariantName: '',
      productNumber: '',
      colorName: '',
      stock: 0,
      isThumbnail: false,
      images: {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null,
      },
    },
  ]);

  const [productDetail, setProductDetail] =
    useState<CreateProductDetailRequest>({
      frameWidth: 0,
      lensWidth: 0,
      lensHeight: 0,
      bridgeWidth: 0,
      templeLength: 0,
      frameMaterial: FrameMaterialType.PLASTIC,
      frameType: FrameType.FULL_RIM,
      bridgeDesign: FrameBridgeDesignType.WITHOUT_NOSE_PADS,
      frameShape: FrameShapeType.ROUND,
      style: FrameStyleType.CLASSIC,
      springHinge: false,
    });

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: product?.productName || '',
      description: product?.description || '',
      brandId: product?.brandId?.toString() || '',
      categoryIds: product?.categoryId ? [product.categoryId.toString()] : [],
      productType: product?.productType || ProductType.GLASSES,
      gender: product?.gender || ProductGenderType.UNISEX,
      price: product?.price || 0,
      isSustainable: product?.isSustainable || false,
    },
  });

  // Product Detail handlers
  const updateProductDetail = (
    field: keyof CreateProductDetailRequest,
    value: any,
  ) => {
    setProductDetail((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Category handlers
  useEffect(() => {
    if (product?.productDetail) {
      setProductDetail((prev) => ({
        ...prev,
        ...product.productDetail,
      }));
    }
  }, [product]);

  return {
    activeTab,
    setActiveTab,
    productColors,
    productDetail,
    submitting,
    setSubmitting,
    form,
    updateProductDetail,
    handleCategoryChange: (categoryIds: string[]) => {
      form.setValue('categoryIds', categoryIds);
    },
    handleProductColorsChange: setProductColors,
    handleStockChange: (colorId: string, stock: number) => {
      setProductColors((prev) =>
        prev.map((color) =>
          color.productVariantName === colorId ? { ...color, stock } : color,
        ),
      );
    },
  };
};
