/**
 * Currency utility functions for Vietnamese Dong (VND)
 */

/**
 * Format a number as Vietnamese Dong currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as Vietnamese Dong with symbol
 * @param amount - The amount to format
 * @returns Formatted currency string with ₫ symbol
 */
export const formatVNDWithSymbol = (amount: number): string => {
  return `${amount.toLocaleString("vi-VN")}₫`;
};

/**
 * Convert GBP to VND (approximate rate: 1 GBP = 30,000 VND)
 * @param gbpAmount - Amount in GBP
 * @returns Amount in VND
 */
export const convertGBPToVND = (gbpAmount: number): number => {
  return Math.round(gbpAmount * 30000);
};

/**
 * Convert USD to VND (approximate rate: 1 USD = 24,000 VND)
 * @param usdAmount - Amount in USD
 * @returns Amount in VND
 */
export const convertUSDToVND = (usdAmount: number): number => {
  return Math.round(usdAmount * 24000);
};
