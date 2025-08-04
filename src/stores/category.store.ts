import { create } from "zustand";
import {
  Category,
  CategoryFilters,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category.types";
import { categoryService } from "../services/category.service";
import { toast } from "react-hot-toast";

interface CategoryStore {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  filters: CategoryFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // Actions
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (category: Category | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: CategoryFilters) => void;
  setPagination: (pagination: Partial<CategoryStore["pagination"]>) => void;
  clearError: () => void;

  // API Actions
  fetchCategories: (filters?: CategoryFilters) => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  createCategory: (data: CreateCategoryDto) => Promise<Category | null>;
  updateCategory: (
    id: number,
    data: UpdateCategoryDto
  ) => Promise<Category | null>;
  deleteCategory: (id: number) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 10 },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  // Actions
  setCategories: (categories) => set({ categories }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  clearError: () => set({ error: null }),

  // API Actions
  fetchCategories: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      const mergedFilters = { ...get().filters, ...filters };

      const response = await categoryService.getCategories({
        page: mergedFilters.page || 1,
        limit: mergedFilters.limit || 10,
        q: mergedFilters.q,
      });

      // Assuming response is an array or has a data property
      const categories = Array.isArray(response)
        ? (response as Category[])
        : (((response as any).data || []) as Category[]);

      // Calculate total pages (assume total is available in response)
      const total = (response as any).total || categories.length;
      const limit = mergedFilters.limit || 10;
      const totalPages = Math.ceil(total / limit);

      set({
        categories,
        filters: mergedFilters,
        pagination: {
          total,
          page: mergedFilters.page || 1,
          limit,
          totalPages,
        },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch categories";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategoryById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const category = await categoryService.getCategoryById(id);
      set({ selectedCategory: category });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch category";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const category = await categoryService.createCategory(data);

      // Add to current categories list
      set((state) => ({
        categories: [category, ...state.categories],
      }));

      toast.success("Category created successfully");
      return category;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create category";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCategory = await categoryService.updateCategory(id, data);

      // Update in current categories list
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        selectedCategory:
          state.selectedCategory?.id === id
            ? updatedCategory
            : state.selectedCategory,
      }));

      toast.success("Category updated successfully");
      return updatedCategory;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update category";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await categoryService.deleteCategory(id);

      // Remove from current categories list
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        selectedCategory:
          state.selectedCategory?.id === id ? null : state.selectedCategory,
      }));

      toast.success("Category deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete category";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
