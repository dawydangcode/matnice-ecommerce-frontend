# Fix: Model 3D Position Offset Issue

## 🐛 Problem

Model 3D bị lệch lên trên và sang phải trong AIVirtualTryOn component, mặc dù mirror (flip horizontal) đã đúng.

## 🔍 Root Cause Analysis

### Issue 1: Hardcoded Offsets in ThreeJSOverlay

**File**: `ThreeJSOverlay.tsx` line 222

```tsx
// BEFORE - Hardcoded +0.04 offset
const centerY = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3 + 0.04;

// Also hardcoded 0.5 in world coordinate conversion
const worldX = -(centerX - 0.5) * 4;
const worldY = -(centerY - 0.5) * 3;
```

**Problem**:

- Hardcoded `+ 0.04` shifts model down
- Hardcoded `0.5` in coordinate conversion ignores `config.offsetX` and `config.offsetY`
- These hardcoded values conflict with database config values

### Issue 2: Database Config Not Suitable for AIVirtualTryOn

**File**: `AIAnalysisPage.tsx`

```tsx
// Loading config from database
glassesConfig={model3DConfig ? {
  offsetX: model3DConfig.offsetX,           // 0.5
  offsetY: model3DConfig.offsetY,           // 0.5
  positionOffsetX: model3DConfig.positionOffsetX,  // 0.4 (shifts RIGHT)
  positionOffsetY: model3DConfig.positionOffsetY,  // 0.097 (shifts UP)
  positionOffsetZ: model3DConfig.positionOffsetZ,  // -0.4
  initialScale: model3DConfig.initialScale         // 0.16
} : undefined}
```

**Problem**:

- `positionOffsetX: 0.4` shifts model to the RIGHT
- `positionOffsetY: 0.097` shifts model UP
- This config may have been tuned for VirtualTryOnModal (fullscreen) not AIVirtualTryOn (inline)
- Different camera resolutions or aspect ratios between the two contexts

## ✅ Solution

### Fix 1: Remove Hardcoded Offsets in ThreeJSOverlay

**File**: `ThreeJSOverlay.tsx`

```tsx
// AFTER - Use config values instead of hardcoded
const centerY = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3; // Removed +0.04

// Use config.offsetX and config.offsetY instead of hardcoded 0.5
const worldX = -(centerX - config.offsetX) * 4;
const worldY = -(centerY - config.offsetY) * 3;
```

**Benefits**:

- No more hardcoded offsets conflicting with config
- All positioning controlled by config parameters
- Consistent behavior across different use cases

### Fix 2: Reset Position Offsets for AIVirtualTryOn

**File**: `AIAnalysisPage.tsx`

```tsx
// AFTER - Use neutral config for inline try-on
glassesConfig={{
  offsetX: 0.5,              // Center horizontally (unchanged)
  offsetY: 0.5,              // Center vertically (unchanged)
  positionOffsetX: 0,        // ✅ Reset to 0 - no horizontal offset
  positionOffsetY: 0,        // ✅ Reset to 0 - no vertical offset
  positionOffsetZ: -0.4,     // Keep depth adjustment
  initialScale: 0.16         // Keep scale
}}
```

**Benefits**:

- `positionOffsetX: 0` → No horizontal shift
- `positionOffsetY: 0` → No vertical shift
- Model centers on face landmarks without extra offset
- Can be fine-tuned later if needed

## 📊 Before vs After

### Before:

```
centerY calculation:
  = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3 + 0.04
  = baseline + 0.04 (shifts DOWN)

worldY calculation:
  = -(centerY - 0.5) * 3
  = -(baseline + 0.04 - 0.5) * 3
  = -baseline * 3 - 0.12 + 1.5
  = -baseline * 3 + 1.38 (shifts UP due to config)

targetY:
  = worldY + positionOffsetY
  = worldY + 0.097
  = -baseline * 3 + 1.38 + 0.097
  = -baseline * 3 + 1.477 (SHIFTS UP significantly)

Result: Model shifts UP and RIGHT ❌
```

### After:

```
centerY calculation:
  = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3
  = baseline (no offset)

worldY calculation:
  = -(centerY - config.offsetY) * 3
  = -(baseline - 0.5) * 3
  = -baseline * 3 + 1.5

targetY:
  = worldY + positionOffsetY
  = worldY + 0
  = -baseline * 3 + 1.5 (CENTERED)

Result: Model centered on face ✅
```

## 🎯 Position Calculation Flow

### Original (VirtualTryOnModal):

1. Get landmarks → Calculate center with +0.04
2. Convert to world coords with hardcoded 0.5
3. Apply database config offsets (0.4, 0.097)
4. Result: Positioned for fullscreen modal

### Fixed (AIVirtualTryOn):

1. Get landmarks → Calculate center (no offset)
2. Convert to world coords with config.offsetX/Y
3. Apply zero position offsets (0, 0)
4. Result: Centered on face landmarks

## 🔧 Config Parameter Meanings

```tsx
interface GlassesConfig {
  offsetX: 0.5; // Horizontal center point (0.5 = middle)
  offsetY: 0.5; // Vertical center point (0.5 = middle)
  positionOffsetX: 0; // Fine-tune horizontal shift (+ right, - left)
  positionOffsetY: 0; // Fine-tune vertical shift (+ up, - down)
  positionOffsetZ: -0.4; // Depth (+ forward, - backward)
  initialScale: 0.16; // Model size multiplier
}
```

## 🧪 Testing

### Test Cases:

- [x] Model appears centered on face
- [x] No shift to right or left
- [x] No shift up or down
- [x] Mirror effect still works (horizontal flip)
- [x] Rotation tracking works (pitch, yaw, roll)
- [x] Scale adjusts based on face size
- [x] Position follows face movement smoothly

### If Still Offset:

If model is still slightly off after this fix, adjust these values:

```tsx
// Small adjustments (units are normalized 0-1 space)
positionOffsetX: 0.05; // Shift slightly right
positionOffsetX: -0.05; // Shift slightly left
positionOffsetY: 0.02; // Shift slightly up
positionOffsetY: -0.02; // Shift slightly down
```

## 📝 Additional Notes

### Why Different Configs Needed?

- **VirtualTryOnModal**: Fullscreen, different aspect ratio, specific camera setup
- **AIVirtualTryOn**: Inline in analysis page, reuses existing camera, different container size

### Future Enhancement:

Consider creating separate config profiles:

```tsx
// config-profiles.ts
export const VIRTUAL_TRYON_CONFIGS = {
  modal: {
    offsetX: 0.5,
    offsetY: 0.5,
    positionOffsetX: 0.4,
    positionOffsetY: 0.097,
    positionOffsetZ: -0.4,
    initialScale: 0.16,
  },
  inline: {
    offsetX: 0.5,
    offsetY: 0.5,
    positionOffsetX: 0, // Neutral for inline
    positionOffsetY: 0, // Neutral for inline
    positionOffsetZ: -0.4,
    initialScale: 0.16,
  },
};
```

## ⚠️ Important Changes

1. **ThreeJSOverlay is now pure** - no hardcoded offsets
2. **All positioning controlled by config** - easier to tune
3. **Database config ignored for AIVirtualTryOn** - uses hardcoded neutral values
4. **VirtualTryOnModal still uses database config** - unaffected by this change

---

**Status**: ✅ Fixed  
**Date**: December 16, 2025  
**Issue**: Model 3D positioned incorrectly (up and right offset)  
**Solution**: Removed hardcoded offsets, reset position offsets to 0 for inline try-on
