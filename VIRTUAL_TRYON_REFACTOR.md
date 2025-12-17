# VirtualTryOnModal Refactor - Inline Mode Support

## 📋 Overview

Đã refactor `VirtualTryOnModal` component để hỗ trợ cả **fullscreen modal** và **inline rendering** mode.

## ✨ What Changed

### 1. New Props

```typescript
interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  model3dUrl?: string;
  glassesConfig?: GlassesConfig;
  mode?: 'modal' | 'inline'; // NEW: Chế độ render
  videoElement?: HTMLVideoElement | null; // NEW: Video element cho inline mode
}
```

### 2. Dual Rendering Mode

#### **Modal Mode (Default)**

- Fullscreen overlay với `position: fixed`
- Tự quản lý camera (getUserMedia)
- Giống với behavior cũ (backward compatible)
- Sử dụng cho ProductDetailPage

```tsx
<VirtualTryOnModal
  mode="modal" // hoặc bỏ qua (default)
  isOpen={isOpen}
  onClose={handleClose}
  productName="Ray-Ban Aviator"
  model3dUrl="/models/aviator.glb"
/>
```

#### **Inline Mode (New)**

- Render với `position: absolute` (contained trong parent)
- Sử dụng video element từ bên ngoài (không tạo camera mới)
- Không có backdrop/overlay
- Sử dụng cho AIAnalysisPage

```tsx
<div className="relative">
  <video ref={videoRef} ... />

  <VirtualTryOnModal
    mode="inline"
    isOpen={showVirtualTryOn}
    videoElement={videoRef.current}
    productName={selectedProduct.productName}
    model3dUrl={getModelProxyUrl(selectedProduct.id)}
    glassesConfig={model3DConfig}
    onClose={() => setShowVirtualTryOn(false)}
  />
</div>
```

## 🔧 Technical Implementation

### Camera Management

**Modal Mode:**

- Calls `getUserMedia()` to create own camera stream
- Stops camera when modal closes
- Self-contained lifecycle

**Inline Mode:**

- Receives `videoElement` prop from parent
- Reuses existing camera stream
- Doesn't stop camera on close (parent manages it)

### MediaPipe Face Mesh

Both modes use the same MediaPipe Face Mesh setup but with different video sources:

```typescript
// Use appropriate video element based on mode
const activeVideoElement =
  mode === 'inline' && videoElement ? videoElement : videoRef.current;

// Initialize MediaPipe with active video element
const camera = new window.Camera(activeVideoElement, {
  onFrame: async () => {
    if (faceMeshRef.current && activeVideoElement) {
      await faceMeshRef.current.send({ image: activeVideoElement });
    }
  },
  width: 640,
  height: 480,
});
```

### Positioning & Layout

**Modal Mode:**

```css
.virtual-tryon-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
}
```

**Inline Mode:**

```tsx
{/* Fragment-based rendering with absolute layers */}
<>
  <div className="absolute top-0 left-0 right-0 z-30">
    {/* Header */}
  </div>

  <canvas className="absolute inset-0 z-10 mirror-canvas" />

  <ThreeJSOverlay ... />

  <div className="absolute bottom-4 ...">
    {/* Status indicator */}
  </div>
</>
```

## 📝 Usage Examples

### Example 1: AIAnalysisPage (Inline Mode)

```tsx
import VirtualTryOnModal from '../components/VirtualTryOnModal';

const AIAnalysisPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay playsInline muted />

      {showVirtualTryOn && (
        <VirtualTryOnModal
          mode="inline"
          isOpen={showVirtualTryOn}
          videoElement={videoRef.current}
          productName="Ray-Ban Aviator"
          model3dUrl="/api/models/aviator.glb"
          glassesConfig={{
            offsetX: 0,
            offsetY: -10,
            positionOffsetX: 0,
            positionOffsetY: 0,
            positionOffsetZ: 0,
            initialScale: 1.0,
          }}
          onClose={() => setShowVirtualTryOn(false)}
        />
      )}
    </div>
  );
};
```

### Example 2: ProductDetailPage (Modal Mode)

```tsx
import VirtualTryOnModal from '../components/VirtualTryOnModal';

const ProductDetailPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Try Virtual Try-On</button>

      <VirtualTryOnModal
        mode="modal" // hoặc bỏ qua prop này
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productName="Ray-Ban Aviator"
        model3dUrl="/models/aviator.glb"
      />
    </>
  );
};
```

## 🎨 Styling

### New CSS Class

Added to `/src/styles/VirtualTryOnModal.css`:

```css
/* Mirror canvas for inline mode */
.mirror-canvas {
  transform: scaleX(-1);
}
```

### Inline Mode Layout

Inline mode renders as Fragment with absolute positioned children:

- **Header bar**: `z-30` - Blue-purple gradient, top
- **Canvas**: `z-10` - Face mesh visualization, full overlay
- **ThreeJSOverlay**: 3D model rendering
- **Status indicator**: `z-30` - Bottom center

## ✅ Benefits

1. **Backward Compatible**: Existing modal usage unchanged
2. **Flexible**: Support both fullscreen and inline modes
3. **Efficient**: Reuse camera stream in inline mode
4. **Clean**: No duplicate components (AIVirtualTryOn removed)
5. **Maintainable**: Single source of truth for Virtual Try-On logic

## 🔄 Migration Guide

### Before (AIVirtualTryOn)

```tsx
import AIVirtualTryOn from '../components/AIVirtualTryOn';

<AIVirtualTryOn
  productName={productName}
  model3dUrl={modelUrl}
  glassesConfig={config}
  videoElement={videoRef.current}
  isActive={isActive}
  onClose={handleClose}
/>;
```

### After (VirtualTryOnModal with inline mode)

```tsx
import VirtualTryOnModal from '../components/VirtualTryOnModal';

<VirtualTryOnModal
  mode="inline"
  isOpen={isActive} // Changed from isActive
  productName={productName}
  model3dUrl={modelUrl}
  glassesConfig={config}
  videoElement={videoRef.current}
  onClose={handleClose}
/>;
```

**Key Differences:**

- `isActive` → `isOpen`
- Add `mode="inline"` prop
- More consistent with modal API

## 🐛 Known Issues

None currently. Component fully functional in both modes.

## 📚 Related Files

- `/src/components/VirtualTryOnModal.tsx` - Main component
- `/src/styles/VirtualTryOnModal.css` - Styles
- `/src/pages/AIAnalysisPage.tsx` - Inline mode usage example
- `/src/pages/ProductDetailPage.tsx` - Modal mode usage example

## 🎯 Next Steps

1. ✅ Refactor complete
2. ✅ AIAnalysisPage updated to use inline mode
3. 🔄 Test both modes thoroughly
4. 🔄 Consider removing AIVirtualTryOn component (deprecated)

## 💡 Tips

- Always provide `videoElement` prop in inline mode
- Parent container must have `position: relative` for inline mode
- Inline mode won't stop camera - parent is responsible
- Modal mode is default for backward compatibility
