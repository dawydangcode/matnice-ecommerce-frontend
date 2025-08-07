// Product Color Image Types for Frontend
export interface ProductImageModel {
  id: number;
  productId: number;
  productColorId?: number;
  imageUrl: string;
  imageOrder?: "a" | "b" | "c" | "d" | "e";
  isThumbnail: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
  deletedAt?: string;
  deletedBy?: number;
}

export interface UploadColorImageRequest {
  productId: number;
  colorId: number;
  productNumber: string;
  imageOrder: "a" | "b" | "c" | "d" | "e";
  file: File;
}

export interface ColorImageUploadData {
  id?: number;
  colorId: number;
  imageOrder: "a" | "b" | "c" | "d" | "e";
  imageUrl: string;
  isThumbnail: boolean;
  file?: File;
  productNumber: string;
}

export type ImageOrder = "a" | "b" | "c" | "d" | "e";

export const IMAGE_ORDERS: ImageOrder[] = ["a", "b", "c", "d", "e"];

export const THUMBNAIL_ORDERS: ImageOrder[] = ["a", "b"];

export interface ProductImagesGroupedByColor {
  [colorId: string]: ProductImageModel[];
}
