// Auth related types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  role?: {
    id: number;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  userId: number;
  accessToken: {
    token: string;
    expireDate: string;
  };
  refreshToken?: {
    token: string;
    expireDate: string;
  };
}

export interface BackendLoginResponse {
  userId: number;
  accessToken: {
    token: string;
    expireDate: string;
  };
  refreshToken?: {
    token: string;
    expireDate: string;
  };
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

// Role types based on backend
export enum RoleType {
  ADMIN = "admin",
  USER = "user",
}
