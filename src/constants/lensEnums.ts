// Mirror backend enums for lens design and materials

export const LensDesignType = {
  NONE: 'NONE',
  ASP: 'ASP',
  SP: 'SP',
  AS: 'AS',
} as const;

export const LensMaterialsType = {
  CR39: 'CR39',
  POLYCARBONATE: 'POLYCARBONATE',
  HIGH_INDEX: 'HIGH_INDEX',
  PHOTOCHROMIC: 'PHOTOCHROMIC',
  TRIVEX: 'TRIVEX',
  GLASS: 'GLASS',
} as const;

export const LensRefractionType = {
  SPHERICAL: 'SPHERICAL',
  CYLINDRICAL: 'CYLINDRICAL',
  AXIS: 'AXIS',
  ADDITIONAL: 'ADDITIONAL',
} as const;

// Helper functions to get display options
export const getDesignOptions = () => [
  { value: LensDesignType.NONE, label: 'Không' },
  { value: LensDesignType.ASP, label: 'ASP (Aspherical)' },
  { value: LensDesignType.SP, label: 'SP (Spherical)' },
  { value: LensDesignType.AS, label: 'AS (Anti-Scratch)' },
];

export const getMaterialOptions = () => [
  { value: LensMaterialsType.CR39, label: 'CR-39 (Plastic chuẩn)' },
  {
    value: LensMaterialsType.POLYCARBONATE,
    label: 'Polycarbonate (Chống va đập)',
  },
  {
    value: LensMaterialsType.HIGH_INDEX,
    label: 'High Index (Chỉ số khúc xạ cao)',
  },
  { value: LensMaterialsType.PHOTOCHROMIC, label: 'Photochromic (Đổi màu)' },
  { value: LensMaterialsType.TRIVEX, label: 'Trivex (Siêu nhẹ)' },
  { value: LensMaterialsType.GLASS, label: 'Glass (Kính thường)' },
];

export const getRefractionOptions = () => [
  { value: LensRefractionType.SPHERICAL, label: 'SPHERICAL (Cận/Viễn thị)' },
  { value: LensRefractionType.CYLINDRICAL, label: 'CYLINDRICAL (Loạn thị)' },
  { value: LensRefractionType.AXIS, label: 'AXIS (Trục)' },
  { value: LensRefractionType.ADDITIONAL, label: 'ADDITIONAL (ADD)' },
];

// Type definitions
export type LensDesignTypeValues =
  (typeof LensDesignType)[keyof typeof LensDesignType];
export type LensMaterialsTypeValues =
  (typeof LensMaterialsType)[keyof typeof LensMaterialsType];
export type LensRefractionTypeValues =
  (typeof LensRefractionType)[keyof typeof LensRefractionType];
