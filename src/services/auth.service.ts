import { apiService } from "./api.service";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "../types/auth.types";

class AuthService {
  private readonly baseUrl = "/api/v1/auth";

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log("Calling login API with:", credentials);
      const response = await apiService.post<AuthResponse>(
        `${this.baseUrl}/login`,
        credentials
      );

      console.log("Login response:", response);

      if (response.accessToken) {
        // Store tokens
        localStorage.setItem("accessToken", response.accessToken.token);
        localStorage.setItem("userId", response.userId.toString());

        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken.token);
        }
      }

      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register(userData: RegisterRequest): Promise<any> {
    try {
      const response = await apiService.post<any>(
        `${this.baseUrl}/register`,
        userData
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearAuthData();
    }
  }

  async requestPasswordReset(
    email: ResetPasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/forgot-password/send-mail`, email);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Password reset request failed"
      );
    }
  }

  async resetPassword(resetData: {
    token: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/reset-password`, resetData);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  }

  async changePassword(
    passwordData: ChangePasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/change-password`, passwordData);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Password change failed"
      );
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await apiService.get(`${this.baseUrl}/profile`);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get user profile"
      );
    }
  }

  // Helper methods
  isLoggedIn(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  clearAuthData(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

export const authService = new AuthService();
