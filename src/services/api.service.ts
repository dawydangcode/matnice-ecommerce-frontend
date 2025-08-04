import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    // Debug logging
    console.log("Environment API URL:", process.env.REACT_APP_API_URL);
    console.log("Using baseURL:", this.baseURL);

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // For cookies/sessions
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        console.log(
          "API Request:",
          config.url,
          "Token:",
          token ? "Present" : "Missing"
        );
        if (token) {
          console.log("Token value:", token.substring(0, 50) + "...");
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");

          // Redirect to login
          if (window.location.pathname !== "/login") {
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
          }
        } else if (error.response?.status === 403) {
          toast.error("Access denied. You do not have permission.");
        } else if (error.response?.status >= 500) {
          toast.error("Server error. Please try again later.");
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }

  // Helper method to handle file uploads
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiService = new ApiService();
