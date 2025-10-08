import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // Debug logging
    console.log('Environment API URL:', process.env.REACT_APP_API_URL);
    console.log('Using baseURL:', this.baseURL);

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // For cookies/sessions
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        console.log(
          'API Request:',
          config.url,
          'Token:',
          token ? 'Present' : 'Missing',
        );
        if (token) {
          console.log('Token value:', token.substring(0, 50) + '...');
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        const url = error.config?.url || '';
        // Only trigger session expired for non-AI endpoints
        const isAIEndpoint = url.includes('/api/v1/ai/');
        if (error.response?.status === 401 && !isAIEndpoint) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
        } else if (error.response?.status === 403) {
          toast.error('Access denied. You do not have permission.');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
        return Promise.reject(error);
      },
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    console.log('ApiService.post:', { url, data, config });
    console.log('Full URL:', this.baseURL + url);

    try {
      const response = await this.api.post(url, data, config);
      console.log('ApiService.post success:', {
        url,
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error: any) {
      console.error('ApiService.post failed:', {
        url,
        error,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    try {
      console.log('ApiService.postFormData:', url);
      const response = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('ApiService.postFormData success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ApiService.postFormData failed:', {
        url,
        error,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch(url, data);
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
    onProgress?: (progress: number) => void,
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiService = new ApiService();
