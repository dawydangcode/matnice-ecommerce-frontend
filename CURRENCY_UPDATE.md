# Currency Update Summary

## Thay đổi tiền tệ từ GBP (£) sang VNĐ (₫)

### Files đã cập nhật:

1. **src/utils/currency.ts** (Mới tạo)

   - Tạo helper functions để format VNĐ
   - `formatVND()`: Format chuẩn theo Intl.NumberFormat
   - `formatVNDWithSymbol()`: Format với ký hiệu ₫
   - `convertGBPToVND()` và `convertUSDToVND()`: Chuyển đổi tiền tệ

2. **src/pages/admin/LensTintPage.tsx**

   - Đổi từ £ sang VNĐ
   - Cập nhật tintTypes prices (ví dụ: 49.95 → 1,498,500)
   - Thay đổi input step từ 0.01 sang 1000
   - Sử dụng formatVNDWithSymbol()

3. **src/pages/admin/LensThicknessPage.tsx**

   - Đổi label "Price (£)" → "Giá (VNĐ)"
   - Cập nhật input step và placeholder
   - Sử dụng formatVNDWithSymbol()

4. **src/pages/admin/LensUpgradePage.tsx**

   - Đổi label "Price (£)" → "Giá (VNĐ)"
   - Cập nhật input step từ 0.01 sang 1000
   - Sử dụng formatVNDWithSymbol()

5. **src/pages/admin/LensQualityListPage.tsx**

   - Đã có sẵn formatPrice function với VNĐ
   - Cập nhật để sử dụng formatVND() helper

6. **src/components/admin/LensQualityForm.tsx**

   - Đổi label "Giá _" → "Giá (VNĐ) _"
   - Cập nhật placeholder và step

7. **src/pages/HomePage.tsx**
   - Cập nhật tất cả giá sản phẩm từ £ sang VNĐ
   - Ví dụ: £359.95 → 10.798.500₫

### Tỷ giá chuyển đổi sử dụng:

- 1 GBP = 30,000 VNĐ (xấp xỉ)
- 1 USD = 24,000 VNĐ (xấp xỉ)

### Benefits của các thay đổi:

- Consistent currency formatting across the app
- Easier maintenance with centralized helper functions
- Better UX for Vietnamese users
- Proper input validation for VNĐ amounts
