# Trang Quản Lý Lens - Hướng Dẫn Sử Dụng

## Tổng Quan

Trang quản lý lens là một hệ thống toàn diện được thiết kế để quản lý tất cả các thành phần liên quan đến lens trong hệ thống ecommerce kính mắt. Hệ thống bao gồm 7 module chính:

## Các Module Chính

### 1. Tổng Quan (Overview)

- **Mô tả**: Dashboard chính hiển thị thống kê tổng quan
- **Tính năng**:
  - Thống kê số lượng từng loại lens
  - Biểu đồ phân tích phân bố tính năng
  - Biểu đồ giá cả và độ dày lens
  - Hoạt động gần đây

### 2. Lens Cơ Bản (Basic Lens)

- **Mô tả**: Quản lý các loại lens cơ bản
- **Tính năng**:
  - Tạo, sửa, xóa lens cơ bản
  - Tìm kiếm và phân trang
  - Quản lý thông tin: tên, mô tả, loại lens

### 3. Chất Lượng Lens (Lens Quality)

- **Mô tả**: Quản lý các tùy chọn chất lượng và tính năng lens
- **Tính năng**:
  - UV Protection (Chống tia UV)
  - Anti-Reflective (Chống phản chiếu)
  - Hard Coating (Lớp phủ cứng)
  - Night/Day Optimization (Tối ưu ngày đêm)
  - Antistatic Coating (Chống tĩnh điện)
  - Free Form Technology (Công nghệ tự do)
  - Transitions Option (Tùy chọn đổi màu)

### 4. Độ Dày Lens (Lens Thickness)

- **Mô tả**: Quản lý độ dày và chỉ số khúc xạ lens
- **Tính năng**:
  - Quản lý chỉ số khúc xạ (1.50, 1.56, 1.61, 1.67, 1.74)
  - Định giá theo độ dày
  - Mô tả và tính năng từng loại

### 5. Màu Sắc Lens (Lens Tint)

- **Mô tả**: Quản lý màu sắc và tint lens
- **Tính năng**:
  - Quản lý các loại tint
  - Upload hình ảnh màu sắc
  - Mã màu (color code)
  - Tương thích với độ dày lens

### 6. Nâng Cấp Lens (Lens Upgrade)

- **Mô tả**: Quản lý các tùy chọn nâng cấp lens
- **Tính năng**:
  - Extra easy-care lotus effect
  - UV 420 protection
  - Anti-reflective coating
  - Self-tinting lenses
  - Blue light filter
  - Scratch resistance

### 7. Chi Tiết Lens (Lens Detail)

- **Mô tả**: Quản lý thông tin chi tiết lens bao gồm đơn thuốc
- **Tính năng**:
  - Thông tin đơn thuốc (SPH, CYL, AXIS, PD)
  - Ngày kê đơn
  - Vật liệu và lớp phủ
  - Liên kết với lens cơ bản

### 8. Phân Loại Lens (Lens Category)

- **Mô tả**: Quản lý phân loại lens theo danh mục
- **Tính năng**:
  - Liên kết lens với category
  - Thống kê phân loại
  - Quản lý mối quan hệ nhiều-nhiều

## Cấu Trúc File

```
src/pages/admin/
├── LensManagementDashboardNew.tsx    # Dashboard chính
├── LensManagementPage.tsx            # Quản lý lens cơ bản
├── LensQualityListPage.tsx           # Quản lý chất lượng lens
├── LensThicknessPage.tsx             # Quản lý độ dày lens
├── LensTintPage.tsx                  # Quản lý màu sắc lens
├── LensUpgradePage.tsx               # Quản lý nâng cấp lens
├── LensDetailPage.tsx                # Quản lý chi tiết lens
└── LensCategoryManagementPage.tsx    # Quản lý phân loại lens

src/components/admin/
├── LensStatistics.tsx                # Component thống kê
├── LensCharts.tsx                    # Component biểu đồ
└── LensFormModal.tsx                 # Modal form lens

src/types/
└── lens.types.ts                     # TypeScript interfaces

src/services/
├── lens.service.ts                   # API service
└── lens-detail.service.ts           # Lens detail API service

src/stores/
└── lens.store.ts                     # Zustand store
```

## Cách Sử Dụng

### Truy Cập Trang

1. Đăng nhập với quyền admin
2. Vào menu "Quản lý Lens" trong sidebar admin
3. Trang dashboard sẽ hiển thị tab "Tổng quan" mặc định

### Điều Hướng

- Click vào các tab trên navigation bar để chuyển giữa các module
- Sử dụng nút "Về tổng quan" để quay lại dashboard chính
- Mỗi module có chức năng tìm kiếm và phân trang riêng

### Thao Tác Cơ Bản

- **Thêm mới**: Click nút "Thêm mới" trong từng module
- **Chỉnh sửa**: Click icon bút chì trên từng dòng
- **Xóa**: Click icon thùng rác và xác nhận
- **Tìm kiếm**: Sử dụng ô tìm kiếm ở đầu mỗi trang

## API Endpoints

### Backend Routes

```
/api/v1/lens/*                        # Lens cơ bản
/api/v1/lens-quality/*                # Chất lượng lens
/api/v1/lens-thickness/*              # Độ dày lens
/api/v1/lens-tint/*                   # Màu sắc lens
/api/v1/lens-upgrade/*                # Nâng cấp lens
/api/v1/lens-detail/*                 # Chi tiết lens
/api/v1/lens-category/*               # Phân loại lens
```

## Tính Năng Nổi Bật

### 1. Dashboard Thống Kê

- Hiển thị số liệu thời gian thực
- Biểu đồ trực quan dễ hiểu
- Thông tin xu hướng và phân tích

### 2. Tìm Kiếm Thông Minh

- Tìm kiếm theo tên, mô tả
- Filter theo nhiều tiêu chí
- Phân trang hiệu quả

### 3. Quản Lý Hình Ảnh

- Upload và quản lý ảnh màu sắc lens
- Preview ảnh trong bảng danh sách
- Tối ưu hóa kích thước file

### 4. Responsive Design

- Tương thích với nhiều kích thước màn hình
- Mobile-friendly interface
- Smooth animations và transitions

## Troubleshooting

### Lỗi Thường Gặp

1. **Không load được data**
   - Kiểm tra kết nối API
   - Xem console log để debug
   - Verify authentication token

2. **Upload ảnh thất bại**
   - Kiểm tra định dạng file (jpg, png, webp)
   - Kiểm tra kích thước file (< 5MB)
   - Đảm bảo quyền upload

3. **Form validation errors**
   - Điền đầy đủ thông tin required
   - Kiểm tra format số và text
   - Xem chi tiết lỗi trong toast message

### Performance Tips

1. **Sử dụng pagination** thay vì load tất cả data
2. **Debounce search** để tránh too many requests
3. **Cache data** với Zustand store
4. **Lazy load** các component nặng

## Cập Nhật Và Mở Rộng

### Thêm Module Mới

1. Tạo component page mới trong `src/pages/admin/`
2. Thêm route vào `tabs` array trong dashboard
3. Cập nhật `TabType` union type
4. Tạo service API tương ứng

### Thêm Tính Năng

1. Cập nhật types trong `lens.types.ts`
2. Thêm API calls vào service
3. Cập nhật store state và actions
4. Modify UI components

## Liên Hệ Hỗ Trợ

Nếu cần hỗ trợ kỹ thuật hoặc có câu hỏi về hệ thống, vui lòng liên hệ team development.
