import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/auth.types";
import { authService } from "../services/auth.service";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  updateUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ username, password });

          if (response.accessToken) {
            // After successful login, fetch user profile with role information
            try {
              const userProfile = await authService.getCurrentUser();

              // Store the complete user object
              localStorage.setItem("user", JSON.stringify(userProfile));

              set({
                user: userProfile,
                isLoggedIn: true,
                isLoading: false,
                error: null,
              });
            } catch (profileError) {
              console.error("Failed to fetch user profile:", profileError);

              // Fallback: create basic user object
              const basicUser = {
                id: response.userId,
                username: username,
                email: "",
                roleId: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              localStorage.setItem("user", JSON.stringify(basicUser));

              set({
                user: basicUser,
                isLoggedIn: true,
                isLoading: false,
                error: null,
              });
            }
          } else {
            throw new Error("Login failed - no access token");
          }
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
            isLoggedIn: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          await authService.register(userData);

          // Registration successful if no error thrown
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          set({
            user,
            isLoggedIn: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isLoggedIn: false,
            isLoading: false,
          });
        }
      },

      updateUser: (user: User) => {
        set({ user });
        localStorage.setItem("user", JSON.stringify(user));
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
