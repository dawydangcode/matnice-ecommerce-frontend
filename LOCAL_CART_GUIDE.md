# 🛒 Local Cart Management System

## 📋 Tổng quan

Hệ thống quản lý giỏ hàng không cần đăng nhập, cho phép người dùng thêm sản phẩm vào giỏ hàng và lưu trữ tạm thời trong localStorage. Khi người dùng đăng nhập, dữ liệu sẽ được đồng bộ với backend.

## 🎯 Tính năng chính

### ✅ **Guest Users (Chưa đăng nhập)**

- ✅ Thêm sản phẩm vào giỏ hàng (lưu localStorage)
- ✅ Xem giỏ hàng với đầy đủ thông tin
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ hàng
- ✅ Hiển thị tổng tiền và số lượng
- ✅ Thông báo khuyến khích đăng nhập

### ✅ **Logged In Users (Đã đăng nhập)**

- ✅ Sử dụng backend API như cũ
- ✅ Tự động đồng bộ localStorage với database khi login
- ✅ Đồng bộ giỏ hàng trên nhiều thiết bị

## 🔧 Cách sử dụng

### 1. **Thêm sản phẩm vào giỏ hàng:**

```typescript
import { localCartService } from '../services/localCart.service';

// Smart add to cart - tự động chọn localStorage hoặc backend
const result = await localCartService.smartAddToCart({
  productId: 123,
  quantity: 1,
  framePrice: 500000,
  totalPrice: 500000,
  discount: 0,
  selectedColorId: 5,
  type: 'frame', // hoặc 'sunglasses'
});

console.log(result.success); // true/false
console.log(result.message); // Thông báo cho user
console.log(result.isLocal); // true nếu lưu localStorage
```

### 2. **Lấy thông tin giỏ hàng:**

```typescript
// Lấy cart từ localStorage
const localCart = localCartService.getLocalCart();
console.log(localCart.items); // Danh sách sản phẩm
console.log(localCart.totalItems); // Tổng số lượng
console.log(localCart.totalPrice); // Tổng tiền

// Lấy số lượng để hiển thị badge
const count = localCartService.getCartCount();
```

### 3. **Sử dụng hook để theo dõi cart count:**

```typescript
import { useCartCount } from '../hooks/useCartCount';

const MyComponent = () => {
  const cartCount = useCartCount();

  return (
    <div>
      Cart ({cartCount})
    </div>
  );
};
```

### 4. **Đồng bộ với backend khi login:**

```typescript
// Tự động được gọi trong auth store khi login thành công
await localCartService.syncCartWithBackend();
```

## 📁 Cấu trúc files

```
src/
├── services/
│   ├── localCart.service.ts     # Service quản lý localStorage cart
│   └── cart.service.ts          # Service API backend (giữ nguyên)
├── hooks/
│   └── useCartCount.ts          # Hook theo dõi cart count
├── components/
│   └── CartDropdown.tsx         # Component hiển thị cart (đã cập nhật)
├── pages/
│   └── ProductDetailPage.tsx    # Trang chi tiết sản phẩm (đã cập nhật)
└── stores/
    └── auth.store.ts            # Auth store với cart sync (đã cập nhật)
```

## 🎨 UI/UX Changes

### **Cart Dropdown:**

- Hiển thị `(Chưa đăng nhập)` cho guest users
- Thông báo khuyến khích đăng nhập: "💡 Đăng nhập để đồng bộ giỏ hàng trên các thiết bị"
- Cập nhật cart count từ localStorage hoặc backend tùy user

### **Product Detail Page:**

- Thông báo thành công khác nhau:
  - Guest: "Frame added to cart! Sign in to sync across devices."
  - Logged in: "Frame added to cart successfully!"
- Fallback strategy nếu backend fails

### **Cart Badge:**

- Hiển thị số từ localStorage cho guest users
- Hiển thị số từ backend cho logged in users
- Tự động cập nhật khi có thay đổi

## 🔄 Workflow

### **Guest User Flow:**

1. User thêm sản phẩm → Lưu localStorage
2. Badge cập nhật số lượng
3. Dropdown hiển thị sản phẩm từ localStorage
4. Có thể cập nhật quantity, xóa items

### **Login Flow:**

1. User đăng nhập → Auth store trigger sync
2. LocalCartService.syncCartWithBackend() được gọi
3. Dữ liệu localStorage được push lên backend
4. LocalStorage được xóa sau khi sync thành công
5. UI chuyển sang hiển thị dữ liệu từ backend

### **Cross-tab Sync:**

- Sử dụng `storage` event để sync localStorage giữa các tab
- Cart count tự động cập nhật khi có thay đổi từ tab khác

## ⚙️ Configuration

### **LocalStorage Keys:**

- `matnice_cart`: Lưu trữ cart data
- `matnice_cart_count`: Lưu trữ cart count (để sync nhanh)

### **Events:**

- `cartUpdated`: Dispatch khi cart có thay đổi
- `storage`: Native event để sync cross-tab

## 🐛 Error Handling

### **Backend Fallback:**

- Nếu backend API fails → Tự động fallback sang localStorage
- Hiển thị thông báo phù hợp cho user

### **Local Storage Issues:**

- Try-catch wrap tất cả localStorage operations
- Console error cho debugging
- Graceful fallback nếu localStorage không available

## 🚀 Deployment Notes

### **Backwards Compatibility:**

- ✅ Không ảnh hưởng tới logged in users hiện tại
- ✅ Backend API không thay đổi
- ✅ Existing cart stores vẫn hoạt động bình thường

### **Testing:**

1. Test guest user add to cart → Check localStorage
2. Test login → Check cart sync
3. Test cross-tab sync
4. Test fallback scenarios
5. Test mobile responsive

## 📊 Benefits

### **Business:**

- ⬆️ Tăng conversion rate (guest users có thể add to cart)
- ⬆️ Giảm friction trong shopping experience
- ⬆️ Khuyến khích users đăng nhập để sync

### **Technical:**

- 🔄 Robust fallback strategy
- 🎯 Progressive enhancement
- 📱 Cross-device compatibility
- 🛡️ Error resilient

### **User Experience:**

- 🚀 Instant cart updates (không cần API call)
- 💾 Persistent cart across browser sessions
- 🔗 Seamless transition khi login
- 📱 Works trên tất cả devices

---

> ✅ **Status**: Ready for production  
> 🔧 **Maintenance**: Monitor localStorage usage và sync success rate
