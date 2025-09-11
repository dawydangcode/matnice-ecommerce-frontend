# Config3DPreview Rotation Values Update

## Thay đổi thực hiện

### 1. Hardcoded Optimal Rotation Values (Thay vì user-configurable)

#### **Roll Rotation (Xoay nghiêng đầu):**

- **Giá trị cũ:** `rollAngle = Math.atan2(...) * config.rotationSensitivity`
- **Giá trị mới:** `rollAngle = Math.atan2(...) * 0.8` (HARDCODED)
- **Lý do:** 0.8 cho kết quả tự nhiên, ổn định nhất

#### **Yaw Rotation (Xoay trái/phải):**

- **Giá trị cũ:** `yawAngle = noseOffset * config.rotationSensitivity`
- **Giá trị mới:**
  ```typescript
  const yawAngleRaw = noseOffset * 1.0; // HARDCODED sensitivity
  const yawAngle = Math.max(-0.5, Math.min(0.5, yawAngleRaw)); // HARDCODED limit
  ```
- **Lý do:** 1.0 sensitivity + ±28.6° limit ngăn over-rotation

#### **Pitch Rotation (Gật đầu lên/xuống):**

- **Giá trị cũ:** `pitchAngle = noseOffsetY * config.rotationSensitivity`
- **Giá trị mới:**
  ```typescript
  const pitchAngleRaw = noseOffsetY * 1.0; // HARDCODED sensitivity
  const pitchAngle = Math.max(-0.3, Math.min(0.3, pitchAngleRaw)); // HARDCODED limit
  ```
- **Lý do:** 1.0 sensitivity + ±17.2° limit ngăn extreme tilts

### 2. Default Config Values Updated

```typescript
const defaultConfig = useMemo(
  () => ({
    offsetX: 0.5,
    offsetY: 0.5,
    positionOffsetX: 0.4,
    positionOffsetY: 0.097,
    positionOffsetZ: -0.4,
    initialScale: 0.16,
    // Rotation settings (not used in calculation, kept for compatibility)
    rotationSensitivity: 0.8, // Documented as hardcoded
    yawLimit: 0.5, // Documented as hardcoded
    pitchLimit: 0.3, // Documented as hardcoded
  }),
  [],
);
```

### 3. Debug Logging Added

```typescript
if (Math.random() < 0.02) {
  // 2% sampling rate
  console.log('Config3DPreview Rotation Values:', {
    rollRaw: ((rollAngleRaw * 180) / Math.PI).toFixed(1) + '°',
    rollFinal: ((rollAngle * 180) / Math.PI).toFixed(1) + '°',
    yawRaw: ((yawAngleRaw * 180) / Math.PI).toFixed(1) + '°',
    yawFinal: ((yawAngle * 180) / Math.PI).toFixed(1) + '°',
    pitchRaw: ((pitchAngleRaw * 180) / Math.PI).toFixed(1) + '°',
    pitchFinal: ((pitchAngle * 180) / Math.PI).toFixed(1) + '°',
    scale: finalScale.toFixed(3),
  });
}
```

## Kết quả mong đợi

1. **Stable Tracking:** Rotation limits ngăn glasses bị xoay quá mức
2. **Natural Movement:** Hardcoded sensitivity values cho chuyển động tự nhiên
3. **Better Performance:** Không phụ thuộc user config, luôn sử dụng giá trị tối ưu
4. **Debug Capability:** Console logs để monitor rotation values

## So sánh với ThreeJSOverlay

| Property          | ThreeJSOverlay | Config3DPreview (Updated) |
| ----------------- | -------------- | ------------------------- |
| Roll Sensitivity  | 0.8            | 0.8 ✅                    |
| Yaw Sensitivity   | 1.0            | 1.0 ✅                    |
| Pitch Sensitivity | 1.0            | 1.0 ✅                    |
| Yaw Limit         | None           | ±0.5 rad (±28.6°) ✅      |
| Pitch Limit       | None           | ±0.3 rad (±17.2°) ✅      |

**Config3DPreview bây giờ có rotation tracking ổn định hơn ThreeJSOverlay nhờ có limits!**
