// Demo file to test Product Color and Product Detail creation workflow

import { productColorService } from '../services/product-color.service';
import { productDetailService } from '../services/product-detail.service';

export const createCompleteProductWorkflow = async (
  productId: number,
  colors: { colorName: string }[],
  details: {
    bridgeWidth: number;
    frameWidth: number;
    lensHeight: number;
    lensWidth: number;
    templeLength: number;
    frameMaterial: string;
    frameShape: string;
    frameType: string;
    bridgeDesign?: string;
    style?: string;
    springHinges: boolean;
    weight: number;
    multifocal: boolean;
  },
) => {
  const results = [];
  let detailCreated = false; // Track if detail has been created

  for (const colorData of colors) {
    try {
      // Step 1: Create color
      const color = await productColorService.createProductColor(productId, {
        productId: productId,
        productVariantName: colorData.colorName,
        productNumber: `${productId}-${colorData.colorName.toUpperCase()}`,
        colorName: colorData.colorName,
        stock: 0,
        isThumbnail: false, // Can be updated later
      }); // Step 2: Create detail for this product (only once, not per color)
      let detail = null;
      if (!detailCreated) {
        // Only create detail once for the product
        detail = await productDetailService.createProductDetail({
          productId: productId,
          bridgeWidth: details.bridgeWidth,
          frameWidth: details.frameWidth,
          lensHeight: details.lensHeight,
          lensWidth: details.lensWidth,
          templeLength: details.templeLength,
          productNumber: Math.floor(Math.random() * 10000), // Auto-generate
          frameMaterial: details.frameMaterial,
          frameShape: details.frameShape,
          frameType: details.frameType,
          bridgeDesign: details.bridgeDesign || '',
          style: details.style || '',
          springHinges: details.springHinges,
          weight: details.weight,
          multifocal: details.multifocal,
        });
        detailCreated = true;
      }

      results.push({
        color,
        detail,
        success: true,
      });
    } catch (error) {
      results.push({
        colorName: colorData.colorName,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      });
    }
  }

  return results;
};

// Example usage:
/*
const results = await createCompleteProductWorkflow(
  123, // productId
  [
    { colorName: 'Đen' },
    { colorName: 'Nâu' },
    { colorName: 'Xanh' }
  ],
  {
    bridgeWidth: 18,
    frameWidth: 140,
    lensHeight: 40,
    lensWidth: 52,
    templeLength: 145,
    frameMaterial: 'metal',
    frameShape: 'round',
    frameType: 'full-rim',
    bridgeDesign: 'Keyhole bridge',
    style: 'Classic',
    springHinges: true,
    weight: 25.5,
    multifocal: false
  }
);

console.log('Creation results:', results);
*/
