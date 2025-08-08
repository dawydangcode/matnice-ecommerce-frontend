import toast from 'react-hot-toast';
import { ProductFormData, ProductColor } from './types';
import {
  Product,
  CreateProductDetailRequest,
} from '../../../types/product.types';
import { useProductStore } from '../../../stores/product.store';
import { productCategoryService } from '../../../services/product-category.service';
import { productColorService } from '../../../services/product-color.service';
import { productDetailService } from '../../../services/product-detail.service';

export const useFormSubmission = () => {
  const { createProduct, updateProduct, uploadImages, isLoading } =
    useProductStore();

  const submitForm = async (
    data: ProductFormData,
    product: Product | null | undefined,
    thumbnailImages: File[],
    productColors: ProductColor[],
    productDetail: Partial<CreateProductDetailRequest>,
    setSubmitting: (value: boolean) => void,
    onSuccess: () => void,
  ) => {
    console.log('=== ENHANCED FORM SUBMIT STARTED ===');
    console.log('Form data:', data);
    console.log('Thumbnail images:', thumbnailImages);
    console.log('Product colors:', productColors);
    console.log('Product detail:', productDetail);

    // Validate categories
    const categoryIds = data.categoryIds.map((id) => parseInt(id));
    if (categoryIds.length === 0) {
      console.error('Validation failed: No categories selected');
      toast.error('Vui lòng chọn ít nhất một danh mục');
      return;
    }

    // Validate colors (at least one with name, auto-generate productNumber if missing)
    // Validate colors - both colorName and productNumber are required
    const validColors = productColors.filter(
      (color) =>
        color.colorName.trim() !== '' && color.productNumber.trim() !== '',
    );

    console.log('Valid colors:', validColors);
    if (validColors.length === 0) {
      console.error('Validation failed: No valid colors');
      toast.error('Vui lòng thêm ít nhất một màu sắc với tên và mã sản phẩm');
      return;
    }

    // Validate thumbnail (at least one color must be marked as thumbnail)
    const hasThumbnail = validColors.some((color) => color.isThumbnail);
    if (!hasThumbnail) {
      console.error('Validation failed: No thumbnail selected');
      toast.error('Vui lòng chọn ít nhất một màu làm ảnh đại diện');
      return;
    }

    // Validate product details
    if (
      !productDetail.frameMaterial ||
      !productDetail.frameShape ||
      !productDetail.frameType
    ) {
      console.error('Validation failed: Missing product details');
      toast.error('Vui lòng điền đầy đủ thông tin chi tiết sản phẩm');
      return;
    }

    try {
      setSubmitting(true);
      console.log('=== UPLOAD PHASE STARTED ===');

      let imageUrls: string[] = [];

      // Upload thumbnail images if any
      if (thumbnailImages.length > 0) {
        console.log('Uploading thumbnail images:', thumbnailImages);
        try {
          const uploadedUrls = await uploadImages(thumbnailImages);
          console.log('Uploaded thumbnail URLs:', uploadedUrls);
          imageUrls = [...imageUrls, ...uploadedUrls];
        } catch (uploadError) {
          console.error('Thumbnail upload failed:', uploadError);
          toast.error('Lỗi khi upload hình ảnh thumbnail');
          return;
        }
      }

      // Create product data
      const totalStock = validColors.reduce(
        (sum, color) => sum + color.stock,
        0,
      );
      const productData = {
        productName: data.productName,
        price: data.price,
        stock: totalStock,
        productType: data.productType,
        gender: data.gender,
        categoryId: categoryIds[0], // Use first category as primary
        brandId: parseInt(data.brandId),
        description: data.description || undefined,
        isSustainable: data.isSustainable || false,
        imageUrls,
      };

      console.log('=== PRODUCT CREATION PHASE ===');
      console.log('Product data to be created:', productData);

      let productId: number;

      if (product) {
        console.log('Updating existing product:', product.productId);
        await updateProduct(product.productId, productData);
        productId = product.productId;
        console.log('Product updated successfully');
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        console.log('Creating new product...');
        try {
          const createdProduct = await createProduct(productData);
          console.log('Created product response:', createdProduct);
          productId = createdProduct?.productId || 0;
          console.log('New product ID:', productId);

          if (!productId) {
            throw new Error('Product ID not returned from createProduct');
          }

          toast.success('Tạo sản phẩm thành công!');
        } catch (createError) {
          console.error('Product creation failed:', createError);
          throw createError;
        }
      }

      // Update product categories if we have multiple categories
      if (categoryIds.length > 1 && productId) {
        console.log('=== UPDATING CATEGORIES PHASE ===');
        console.log(
          'Updating categories for product:',
          productId,
          'Categories:',
          categoryIds,
        );
        try {
          await productCategoryService.updateProductCategories(
            productId,
            categoryIds,
          );
          console.log('Categories updated successfully');
          toast.success('Cập nhật danh mục sản phẩm thành công!');
        } catch (error) {
          console.error('Error updating product categories:', error);
          toast.error('Có lỗi khi cập nhật danh mục sản phẩm');
        }
      }

      // Create product colors and details
      if (productId && !product) {
        // Only for new products
        console.log('=== CREATING COLORS AND DETAILS PHASE ===');
        console.log('Creating colors and details for product:', productId);

        for (let index = 0; index < validColors.length; index++) {
          const colorData = validColors[index];
          console.log(
            `Creating color ${index + 1}/${validColors.length}:`,
            colorData.colorName,
          );
          try {
            const color = await productColorService.createProductColor(
              productId,
              {
                productId: productId,
                product_variant_name:
                  colorData.productVariantName || colorData.colorName.trim(),
                product_number: `${productId}-${colorData.colorName.trim().toUpperCase()}`,
                color_name: colorData.colorName.trim(),
                stock: colorData.stock,
                is_thumbnail: colorData.isThumbnail,
              },
            );
            console.log('Color created:', color);

            // Create product detail for this color
            const detailData = {
              productId: productId,
              bridgeWidth: productDetail.bridgeWidth || 0,
              frameWidth: productDetail.frameWidth || 0,
              lensHeight: productDetail.lensHeight || 0,
              lensWidth: productDetail.lensWidth || 0,
              templeLength: productDetail.templeLength || 0,
              productNumber: 0,
              frameMaterial: productDetail.frameMaterial || '',
              frameShape: productDetail.frameShape || '',
              frameType: productDetail.frameType || '',
              bridgeDesign: '',
              style: '',
              springHinges: productDetail.springHinge || false,
              weight: 0,
              multifocal: false,
            };

            console.log(
              'Creating detail for product:',
              productId,
              'Detail data:',
              detailData,
            );

            const detail =
              await productDetailService.createProductDetail(detailData);
            console.log('Detail created:', detail);
          } catch (error) {
            console.error(
              `Error creating color ${colorData.colorName}:`,
              error,
            );
            toast.error(`Có lỗi khi tạo màu ${colorData.colorName}`);
          }
        }
        console.log('Colors and details creation completed');
        toast.success('Tạo màu sắc và chi tiết sản phẩm thành công!');
      }

      console.log('=== CALLING onSuccess() ===');

      // Add a small delay to see all toasts before navigation
      setTimeout(() => {
        console.log('Executing onSuccess callback...');
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
          console.log('onSuccess callback executed');
        } else {
          console.error('onSuccess is not a function:', onSuccess);
        }
      }, 1000);

      console.log('=== ENHANCED FORM SUBMIT COMPLETED SUCCESSFULLY ===');
    } catch (error) {
      console.error('=== ENHANCED FORM SUBMIT FAILED ===');
      console.error('Error details:', error);
      toast.error(
        product ? 'Cập nhật sản phẩm thất bại!' : 'Tạo sản phẩm thất bại!',
      );
    } finally {
      setSubmitting(false);
      console.log('=== ENHANCED FORM SUBMIT FINISHED ===');
    }
  };

  return {
    submitForm,
    isLoading,
  };
};
