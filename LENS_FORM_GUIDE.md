# Hướng Dẫn Sử Dụng Form Tạo Lens Mới

## Tổng quan

Form tạo lens mới là một form phức tạp với 4 tabs chính, cho phép tạo lens với đầy đủ thông tin bao gồm ảnh, biến thể, lớp phủ và dãy độ.

## Cách truy cập

1. Đăng nhập với tài khoản admin
2. Vào Admin Dashboard
3. Chọn "Lens" trong menu bên trái
4. Click "Tạo lens đầy đủ" (nút màu xanh lá)

## Cấu trúc Form

### Tab 1: Thông tin cơ bản

**Trường bắt buộc:**

- **Name**: Tên lens
- **Brand**: Chọn từ danh sách brands
- **Category**: Chọn danh mục lens
- **Ít nhất 1 ảnh**: Upload ảnh cho lens

**Trường tùy chọn:**

- **Origin**: Xuất xứ
- **Lens Type**: Loại lens (Đơn tròng, đa tròng, etc.)
- **Description**: Mô tả

**Quản lý ảnh:**

- Click "Thêm ảnh" để thêm ảnh mới
- **Image Order**: Thứ tự ảnh (a, b, c, d, e)
- Ảnh có order "a" sẽ tự động được đặt làm thumbnail
- Chỉ được có 1 ảnh với order "a"

### Tab 2: Biến thể (Variants)

- Click "Thêm biến thể" để tạo biến thể mới
- Mỗi biến thể bao gồm:
  - **Độ dày**: Chọn từ lens thickness có sẵn
  - **Thiết kế**: FSV, AR, hoặc AS
  - **Chất liệu**: Nhập text
  - **Giá**: Số thập phân
  - **Tồn kho**: Số nguyên

### Tab 3: Lớp phủ (Coatings)

- Click "Thêm lớp phủ" để tạo lớp phủ mới
- Mỗi lớp phủ bao gồm:
  - **Tên**: Tên lớp phủ (bắt buộc)
  - **Giá bổ sung**: Giá phụ thu
  - **Mô tả**: Chi tiết về lớp phủ

### Tab 4: Dãy độ (Refraction Ranges)

- Dựa trên các biến thể đã tạo ở Tab 2
- Mỗi biến thể có thể có nhiều dãy độ
- Click "Thêm dãy độ" cho từng biến thể
- Mỗi dãy độ bao gồm:
  - **Loại điều chỉnh**: SPH, CYL, ADD
  - **Giá trị tối thiểu**: Số thập phân
  - **Giá trị tối đa**: Số thập phân
  - **Bước nhảy**: Khoảng cách giữa các giá trị

## Validation Rules

### Thông tin cơ bản:

- Tên lens không được để trống
- Phải chọn brand
- Phải chọn category
- Phải có ít nhất 1 ảnh
- Chỉ được có 1 ảnh primary (order "a")

### Biến thể:

- Phải có ít nhất 1 biến thể
- Tất cả trường trong biến thể đều bắt buộc
- Giá phải > 0
- Tồn kho phải >= 0

### Dãy độ:

- Giá trị tối thiểu <= giá trị tối đa
- Bước nhảy phải > 0

## Quy trình lưu dữ liệu

1. **Validation**: Kiểm tra tất cả tabs
2. **Upload ảnh**: Upload file và lấy URL
3. **Tạo lens cơ bản**: Tạo record lens chính
4. **Tạo ảnh**: Liên kết ảnh với lens
5. **Tạo biến thể**: Tạo các variants (TODO)
6. **Tạo lớp phủ**: Tạo coatings (TODO)
7. **Tạo dãy độ**: Tạo refraction ranges (TODO)

## Tính năng hiện tại

✅ **Đã hoàn thành:**

- UI form với 4 tabs
- Validation cơ bản
- Upload và quản lý ảnh
- Tạo lens với ảnh

🚧 **Đang phát triển:**

- API endpoints cho variants, coatings, refraction ranges
- Transaction để đảm bảo tính nhất quán dữ liệu
- Tích hợp với backend lens_variant, lens_coating modules

## Lưu ý kỹ thuật

- Form sử dụng React state để quản lý dữ liệu
- Validation real-time
- File upload với preview
- Responsive design
- Accessibility compliant

## Troubleshooting

### "Không thể tạo lens"

- Kiểm tra kết nối backend
- Đảm bảo user có quyền admin
- Kiểm tra console để xem lỗi chi tiết

### "Lỗi upload ảnh"

- Kiểm tra định dạng file (jpg, png, etc.)
- Kiểm tra kích thước file
- Đảm bảo backend lens_image endpoint hoạt động

### "Không thấy nút tạo lens đầy đủ"

- Đảm bảo đang ở trang quản lý lens
- Refresh lại trang
- Kiểm tra role user
