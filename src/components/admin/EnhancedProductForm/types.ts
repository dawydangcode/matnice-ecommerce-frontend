import { z } from 'zod';
import {
  Product,
  ProductType,
  ProductGenderType,
} from '../../../types/product.types';

// Schema validation
export const productSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  brandId: z.string().min(1, 'Thương hiệu là bắt buộc'),
  categoryIds: z.array(z.string()).min(1, 'Phải chọn ít nhất một danh mục'),
  productType: z.nativeEnum(ProductType),
  gender: z.nativeEnum(ProductGenderType),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  stock: z.number().min(0, 'Số lượng phải lớn hơn 0'),
  isSustainable: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface EnhancedProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface Tab {
  id: string;
  label: string;
  icon: any;
}
