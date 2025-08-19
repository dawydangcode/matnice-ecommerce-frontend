import { create } from 'zustand';
import {
  Lens,
  LensFilters,
  CreateLensDto,
  UpdateLensDto,
  LensQuality,
  LensQualityFilters,
  CreateLensQualityDto,
  UpdateLensQualityDto,
  LensThickness,
  LensThicknessFilters,
  CreateLensThicknessDto,
  UpdateLensThicknessDto,
  LensTint,
  LensTintFilters,
  CreateLensTintDto,
  UpdateLensTintDto,
  TintColor,
  CreateTintColorDto,
  UpdateTintColorDto,
  LensUpgrade,
  LensUpgradeFilters,
  CreateLensUpgradeDto,
  UpdateLensUpgradeDto,
  LensDetail,
  CreateLensDetailDto,
  UpdateLensDetailDto,
  LensUpgradeDetail,
  CreateLensUpgradeDetailDto,
  UpdateLensUpgradeDetailDto,
} from '../types/lens.types';
import { lensService } from '../services/lens.service';
import { toast } from 'react-hot-toast';

interface LensStore {
  // Basic Lens State
  lenses: Lens[];
  selectedLens: Lens | null;
  isLoading: boolean;
  error: string | null;
  filters: LensFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // Lens Quality State
  lensQualities: LensQuality[];
  selectedLensQuality: LensQuality | null;
  lensQualityFilters: LensQualityFilters;
  isLensQualityLoading: boolean;
  lensQualityError: string | null;

  // Lens Thickness State
  lensThicknesses: LensThickness[];
  selectedLensThickness: LensThickness | null;
  lensThicknessFilters: LensThicknessFilters;
  isLensThicknessLoading: boolean;
  lensThicknessError: string | null;

  // Lens Tint State
  lensTints: LensTint[];
  selectedLensTint: LensTint | null;
  lensTintFilters: LensTintFilters;
  isLensTintLoading: boolean;
  lensTintError: string | null;

  // Lens Upgrade State
  lensUpgrades: LensUpgrade[];
  selectedLensUpgrade: LensUpgrade | null;
  lensUpgradeFilters: LensUpgradeFilters;
  isLensUpgradeLoading: boolean;
  lensUpgradeError: string | null;

  // Lens Detail State
  lensDetails: LensDetail[];
  selectedLensDetail: LensDetail | null;
  isLensDetailLoading: boolean;
  lensDetailError: string | null;

  // Lens Upgrade Detail State
  lensUpgradeDetails: LensUpgradeDetail[];
  selectedLensUpgradeDetail: LensUpgradeDetail | null;
  isLensUpgradeDetailLoading: boolean;
  lensUpgradeDetailError: string | null;

  // =============== BASIC LENS ACTIONS ===============
  setLenses: (lenses: Lens[]) => void;
  setSelectedLens: (lens: Lens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: LensFilters) => void;
  setPagination: (pagination: Partial<LensStore['pagination']>) => void;
  clearError: () => void;

  // API Actions for Basic Lens
  fetchLenses: (filters?: LensFilters) => Promise<void>;
  fetchLensById: (id: number) => Promise<void>;
  createLens: (data: CreateLensDto) => Promise<Lens | null>;
  updateLens: (id: number, data: UpdateLensDto) => Promise<Lens | null>;
  deleteLens: (id: number) => Promise<boolean>;

  // =============== LENS QUALITY ACTIONS ===============
  setLensQualities: (qualities: LensQuality[]) => void;
  setSelectedLensQuality: (quality: LensQuality | null) => void;
  setLensQualityLoading: (loading: boolean) => void;
  setLensQualityError: (error: string | null) => void;
  setLensQualityFilters: (filters: LensQualityFilters) => void;
  clearLensQualityError: () => void;

  // API Actions for Lens Quality
  fetchLensQualities: (filters?: LensQualityFilters) => Promise<void>;
  fetchLensQualityById: (id: number) => Promise<void>;
  createLensQuality: (
    data: CreateLensQualityDto,
  ) => Promise<LensQuality | null>;
  updateLensQuality: (
    id: number,
    data: UpdateLensQualityDto,
  ) => Promise<LensQuality | null>;
  deleteLensQuality: (id: number) => Promise<boolean>;

  // =============== LENS THICKNESS ACTIONS ===============
  setLensThicknesses: (thicknesses: LensThickness[]) => void;
  setSelectedLensThickness: (thickness: LensThickness | null) => void;
  setLensThicknessLoading: (loading: boolean) => void;
  setLensThicknessError: (error: string | null) => void;
  setLensThicknessFilters: (filters: LensThicknessFilters) => void;
  clearLensThicknessError: () => void;

  // API Actions for Lens Thickness
  fetchLensThicknesses: (filters?: LensThicknessFilters) => Promise<void>;
  fetchLensThicknessById: (id: number) => Promise<void>;
  createLensThickness: (
    data: CreateLensThicknessDto,
  ) => Promise<LensThickness | null>;
  updateLensThickness: (
    id: number,
    data: UpdateLensThicknessDto,
  ) => Promise<LensThickness | null>;
  deleteLensThickness: (id: number) => Promise<boolean>;

  // =============== LENS TINT ACTIONS ===============
  setLensTints: (tints: LensTint[]) => void;
  setSelectedLensTint: (tint: LensTint | null) => void;
  setLensTintLoading: (loading: boolean) => void;
  setLensTintError: (error: string | null) => void;
  setLensTintFilters: (filters: LensTintFilters) => void;
  clearLensTintError: () => void;

  // API Actions for Lens Tint
  fetchLensTints: (filters?: LensTintFilters) => Promise<void>;
  fetchLensTintById: (id: number) => Promise<void>;
  createLensTint: (data: CreateLensTintDto) => Promise<LensTint | null>;
  updateLensTint: (
    id: number,
    data: UpdateLensTintDto,
  ) => Promise<LensTint | null>;
  deleteLensTint: (id: number) => Promise<boolean>;

  // Tint Color Actions
  fetchTintColorsByTintId: (tintId: number) => Promise<TintColor[]>;
  createTintColor: (data: CreateTintColorDto) => Promise<TintColor | null>;
  uploadTintColorImage: (file: File) => Promise<{ imageUrl: string } | null>;
  updateTintColor: (
    id: number,
    data: UpdateTintColorDto,
  ) => Promise<TintColor | null>;
  deleteTintColor: (id: number) => Promise<boolean>;

  // Lens Thickness Tint Compatibility Actions
  fetchCompatibleTintsForThickness: (thicknessId: number) => Promise<any[]>;
  fetchCompatibleThicknessesForTint: (tintId: number) => Promise<any[]>;
  createTintThicknessCompatibility: (
    tintId: number,
    thicknessIds: number[],
  ) => Promise<any[]>;
  updateTintThicknessCompatibility: (
    tintId: number,
    thicknessIds: number[],
  ) => Promise<any[]>;

  // =============== LENS UPGRADE ACTIONS ===============
  setLensUpgrades: (upgrades: LensUpgrade[]) => void;
  setSelectedLensUpgrade: (upgrade: LensUpgrade | null) => void;
  setLensUpgradeLoading: (loading: boolean) => void;
  setLensUpgradeError: (error: string | null) => void;
  setLensUpgradeFilters: (filters: LensUpgradeFilters) => void;
  clearLensUpgradeError: () => void;

  // API Actions for Lens Upgrade
  fetchLensUpgrades: (filters?: LensUpgradeFilters) => Promise<void>;
  fetchLensUpgradeById: (id: number) => Promise<void>;
  createLensUpgrade: (
    data: CreateLensUpgradeDto,
  ) => Promise<LensUpgrade | null>;
  updateLensUpgrade: (
    id: number,
    data: UpdateLensUpgradeDto,
  ) => Promise<LensUpgrade | null>;
  deleteLensUpgrade: (id: number) => Promise<boolean>;

  // =============== LENS DETAIL ACTIONS ===============
  setLensDetails: (details: LensDetail[]) => void;
  setSelectedLensDetail: (detail: LensDetail | null) => void;
  setLensDetailLoading: (loading: boolean) => void;
  setLensDetailError: (error: string | null) => void;
  clearLensDetailError: () => void;

  // API Actions for Lens Detail
  fetchLensDetails: (filters?: { lensId?: number }) => Promise<void>;
  fetchLensDetailById: (id: number) => Promise<void>;
  createLensDetail: (data: CreateLensDetailDto) => Promise<LensDetail | null>;
  updateLensDetail: (
    id: number,
    data: UpdateLensDetailDto,
  ) => Promise<LensDetail | null>;
  deleteLensDetail: (id: number) => Promise<boolean>;

  // =============== LENS UPGRADE DETAIL ACTIONS ===============
  setLensUpgradeDetails: (details: LensUpgradeDetail[]) => void;
  setSelectedLensUpgradeDetail: (detail: LensUpgradeDetail | null) => void;
  setLensUpgradeDetailLoading: (loading: boolean) => void;
  setLensUpgradeDetailError: (error: string | null) => void;
  clearLensUpgradeDetailError: () => void;

  // API Actions for Lens Upgrade Detail
  fetchLensUpgradeDetails: () => Promise<void>;
  fetchLensUpgradeDetailById: (id: number) => Promise<void>;
  createLensUpgradeDetail: (
    data: CreateLensUpgradeDetailDto,
  ) => Promise<LensUpgradeDetail | null>;
  updateLensUpgradeDetail: (
    id: number,
    data: UpdateLensUpgradeDetailDto,
  ) => Promise<LensUpgradeDetail | null>;
  deleteLensUpgradeDetail: (id: number) => Promise<boolean>;
}

export const useLensStore = create<LensStore>((set, get) => ({
  // =============== INITIAL STATE ===============
  // Basic Lens State
  lenses: [],
  selectedLens: null,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 10 },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  // Lens Quality State
  lensQualities: [],
  selectedLensQuality: null,
  lensQualityFilters: { page: 1, limit: 10 },
  isLensQualityLoading: false,
  lensQualityError: null,

  // Lens Thickness State
  lensThicknesses: [],
  selectedLensThickness: null,
  lensThicknessFilters: { page: 1, limit: 10 },
  isLensThicknessLoading: false,
  lensThicknessError: null,

  // Lens Tint State
  lensTints: [],
  selectedLensTint: null,
  lensTintFilters: { page: 1, limit: 10 },
  isLensTintLoading: false,
  lensTintError: null,

  // Lens Upgrade State
  lensUpgrades: [],
  selectedLensUpgrade: null,
  lensUpgradeFilters: { page: 1, limit: 10 },
  isLensUpgradeLoading: false,
  lensUpgradeError: null,

  // Lens Detail State
  lensDetails: [],
  selectedLensDetail: null,
  isLensDetailLoading: false,
  lensDetailError: null,

  // Lens Upgrade Detail State
  lensUpgradeDetails: [],
  selectedLensUpgradeDetail: null,
  isLensUpgradeDetailLoading: false,
  lensUpgradeDetailError: null,

  // =============== BASIC LENS SETTERS ===============
  setLenses: (lenses) => set({ lenses }),
  setSelectedLens: (lens) => set({ selectedLens: lens }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...pagination } })),
  clearError: () => set({ error: null }),

  // =============== BASIC LENS API ACTIONS ===============
  fetchLenses: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const mergedFilters = { ...get().filters, ...filters };
      set({ filters: mergedFilters });

      const response = await lensService.getLenses(mergedFilters);
      const { data, total } = response;

      set({
        lenses: data,
        pagination: {
          ...get().pagination,
          total,
          totalPages: Math.ceil(total / (mergedFilters.limit || 10)),
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lenses:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch lenses',
        isLoading: false,
      });
      toast.error('Không thể tải danh sách lens');
    }
  },

  fetchLensById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const lens = await lensService.getLensById(id);
      set({ selectedLens: lens, isLoading: false });
    } catch (error) {
      console.error('Error fetching lens:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch lens',
        isLoading: false,
      });
      toast.error('Không thể tải thông tin lens');
    }
  },

  createLens: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const lens = await lensService.createLens(data);

      // Refresh the lens list
      await get().fetchLenses();

      set({ isLoading: false });
      toast.success('Tạo lens thành công!');
      return lens;
    } catch (error) {
      console.error('Error creating lens:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create lens',
        isLoading: false,
      });
      toast.error('Không thể tạo lens');
      return null;
    }
  },

  updateLens: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const lens = await lensService.updateLens(id, data);

      // Update the lens in the list
      set((state) => ({
        lenses: state.lenses.map((l) => (l.id === id ? lens : l)),
        selectedLens: state.selectedLens?.id === id ? lens : state.selectedLens,
        isLoading: false,
      }));

      toast.success('Cập nhật lens thành công!');
      return lens;
    } catch (error) {
      console.error('Error updating lens:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update lens',
        isLoading: false,
      });
      toast.error('Không thể cập nhật lens');
      return null;
    }
  },

  deleteLens: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await lensService.deleteLens(id);

      // Remove lens from the list
      set((state) => ({
        lenses: state.lenses.filter((l) => l.id !== id),
        selectedLens: state.selectedLens?.id === id ? null : state.selectedLens,
        isLoading: false,
      }));

      toast.success('Xóa lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete lens',
        isLoading: false,
      });
      toast.error('Không thể xóa lens');
      return false;
    }
  },

  // =============== LENS QUALITY SETTERS ===============
  setLensQualities: (qualities) => set({ lensQualities: qualities }),
  setSelectedLensQuality: (quality) => set({ selectedLensQuality: quality }),
  setLensQualityLoading: (loading) => set({ isLensQualityLoading: loading }),
  setLensQualityError: (error) => set({ lensQualityError: error }),
  setLensQualityFilters: (filters) => set({ lensQualityFilters: filters }),
  clearLensQualityError: () => set({ lensQualityError: null }),

  // =============== LENS QUALITY API ACTIONS ===============
  fetchLensQualities: async (filters) => {
    try {
      set({ isLensQualityLoading: true, lensQualityError: null });
      const mergedFilters = { ...get().lensQualityFilters, ...filters };
      set({ lensQualityFilters: mergedFilters });

      const response = await lensService.getLensQualities(mergedFilters);
      const { data } = response;

      set({
        lensQualities: data,
        isLensQualityLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens qualities:', error);
      set({
        lensQualityError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens qualities',
        isLensQualityLoading: false,
      });
      toast.error('Không thể tải danh sách chất lượng lens');
    }
  },

  fetchLensQualityById: async (id) => {
    try {
      set({ isLensQualityLoading: true, lensQualityError: null });
      const quality = await lensService.getLensQualityById(id);
      set({ selectedLensQuality: quality, isLensQualityLoading: false });
    } catch (error) {
      console.error('Error fetching lens quality:', error);
      set({
        lensQualityError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens quality',
        isLensQualityLoading: false,
      });
      toast.error('Không thể tải thông tin chất lượng lens');
    }
  },

  createLensQuality: async (data) => {
    try {
      set({ isLensQualityLoading: true, lensQualityError: null });
      const quality = await lensService.createLensQuality(data);

      await get().fetchLensQualities();

      set({ isLensQualityLoading: false });
      toast.success('Tạo chất lượng lens thành công!');
      return quality;
    } catch (error) {
      console.error('Error creating lens quality:', error);
      set({
        lensQualityError:
          error instanceof Error
            ? error.message
            : 'Failed to create lens quality',
        isLensQualityLoading: false,
      });
      toast.error('Không thể tạo chất lượng lens');
      return null;
    }
  },

  updateLensQuality: async (id, data) => {
    try {
      set({ isLensQualityLoading: true, lensQualityError: null });
      const quality = await lensService.updateLensQuality(id, data);

      set((state) => ({
        lensQualities: state.lensQualities.map((q) =>
          q.id === id ? quality : q,
        ),
        selectedLensQuality:
          state.selectedLensQuality?.id === id
            ? quality
            : state.selectedLensQuality,
        isLensQualityLoading: false,
      }));

      toast.success('Cập nhật chất lượng lens thành công!');
      return quality;
    } catch (error) {
      console.error('Error updating lens quality:', error);
      set({
        lensQualityError:
          error instanceof Error
            ? error.message
            : 'Failed to update lens quality',
        isLensQualityLoading: false,
      });
      toast.error('Không thể cập nhật chất lượng lens');
      return null;
    }
  },

  deleteLensQuality: async (id) => {
    try {
      set({ isLensQualityLoading: true, lensQualityError: null });
      await lensService.deleteLensQuality(id);

      set((state) => ({
        lensQualities: state.lensQualities.filter((q) => q.id !== id),
        selectedLensQuality:
          state.selectedLensQuality?.id === id
            ? null
            : state.selectedLensQuality,
        isLensQualityLoading: false,
      }));

      toast.success('Xóa chất lượng lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens quality:', error);
      set({
        lensQualityError:
          error instanceof Error
            ? error.message
            : 'Failed to delete lens quality',
        isLensQualityLoading: false,
      });
      toast.error('Không thể xóa chất lượng lens');
      return false;
    }
  },

  // =============== LENS THICKNESS SETTERS ===============
  setLensThicknesses: (thicknesses) => set({ lensThicknesses: thicknesses }),
  setSelectedLensThickness: (thickness) =>
    set({ selectedLensThickness: thickness }),
  setLensThicknessLoading: (loading) =>
    set({ isLensThicknessLoading: loading }),
  setLensThicknessError: (error) => set({ lensThicknessError: error }),
  setLensThicknessFilters: (filters) => set({ lensThicknessFilters: filters }),
  clearLensThicknessError: () => set({ lensThicknessError: null }),

  // =============== LENS THICKNESS API ACTIONS ===============
  fetchLensThicknesses: async (filters) => {
    try {
      set({ isLensThicknessLoading: true, lensThicknessError: null });
      const mergedFilters = { ...get().lensThicknessFilters, ...filters };
      set({ lensThicknessFilters: mergedFilters });

      const response = await lensService.getLensThicknesses(mergedFilters);
      const { data } = response;

      set({
        lensThicknesses: data,
        isLensThicknessLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens thicknesses:', error);
      set({
        lensThicknessError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens thicknesses',
        isLensThicknessLoading: false,
      });
      toast.error('Không thể tải danh sách độ dày lens');
    }
  },

  fetchLensThicknessById: async (id) => {
    try {
      set({ isLensThicknessLoading: true, lensThicknessError: null });
      const thickness = await lensService.getLensThicknessById(id);
      set({ selectedLensThickness: thickness, isLensThicknessLoading: false });
    } catch (error) {
      console.error('Error fetching lens thickness:', error);
      set({
        lensThicknessError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens thickness',
        isLensThicknessLoading: false,
      });
      toast.error('Không thể tải thông tin độ dày lens');
    }
  },

  createLensThickness: async (data) => {
    try {
      set({ isLensThicknessLoading: true, lensThicknessError: null });
      const thickness = await lensService.createLensThickness(data);

      await get().fetchLensThicknesses();

      set({ isLensThicknessLoading: false });
      toast.success('Tạo độ dày lens thành công!');
      return thickness;
    } catch (error) {
      console.error('Error creating lens thickness:', error);
      set({
        lensThicknessError:
          error instanceof Error
            ? error.message
            : 'Failed to create lens thickness',
        isLensThicknessLoading: false,
      });
      toast.error('Không thể tạo độ dày lens');
      return null;
    }
  },

  updateLensThickness: async (id, data) => {
    try {
      set({ isLensThicknessLoading: true, lensThicknessError: null });
      const thickness = await lensService.updateLensThickness(id, data);

      set((state) => ({
        lensThicknesses: state.lensThicknesses.map((t) =>
          t.id === id ? thickness : t,
        ),
        selectedLensThickness:
          state.selectedLensThickness?.id === id
            ? thickness
            : state.selectedLensThickness,
        isLensThicknessLoading: false,
      }));

      toast.success('Cập nhật độ dày lens thành công!');
      return thickness;
    } catch (error) {
      console.error('Error updating lens thickness:', error);
      set({
        lensThicknessError:
          error instanceof Error
            ? error.message
            : 'Failed to update lens thickness',
        isLensThicknessLoading: false,
      });
      toast.error('Không thể cập nhật độ dày lens');
      return null;
    }
  },

  deleteLensThickness: async (id) => {
    try {
      set({ isLensThicknessLoading: true, lensThicknessError: null });
      await lensService.deleteLensThickness(id);

      set((state) => ({
        lensThicknesses: state.lensThicknesses.filter((t) => t.id !== id),
        selectedLensThickness:
          state.selectedLensThickness?.id === id
            ? null
            : state.selectedLensThickness,
        isLensThicknessLoading: false,
      }));

      toast.success('Xóa độ dày lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens thickness:', error);
      set({
        lensThicknessError:
          error instanceof Error
            ? error.message
            : 'Failed to delete lens thickness',
        isLensThicknessLoading: false,
      });
      toast.error('Không thể xóa độ dày lens');
      return false;
    }
  },

  // =============== LENS TINT SETTERS ===============
  setLensTints: (tints) => set({ lensTints: tints }),
  setSelectedLensTint: (tint) => set({ selectedLensTint: tint }),
  setLensTintLoading: (loading) => set({ isLensTintLoading: loading }),
  setLensTintError: (error) => set({ lensTintError: error }),
  setLensTintFilters: (filters) => set({ lensTintFilters: filters }),
  clearLensTintError: () => set({ lensTintError: null }),

  // =============== LENS TINT API ACTIONS ===============
  fetchLensTints: async (filters) => {
    try {
      set({ isLensTintLoading: true, lensTintError: null });
      const mergedFilters = { ...get().lensTintFilters, ...filters };
      set({ lensTintFilters: mergedFilters });

      const response = await lensService.getLensTints(mergedFilters);
      const { data } = response;

      set({
        lensTints: data,
        isLensTintLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens tints:', error);
      set({
        lensTintError:
          error instanceof Error ? error.message : 'Failed to fetch lens tints',
        isLensTintLoading: false,
      });
      toast.error('Không thể tải danh sách tông màu lens');
    }
  },

  fetchLensTintById: async (id) => {
    try {
      set({ isLensTintLoading: true, lensTintError: null });
      const tint = await lensService.getLensTintById(id);
      set({ selectedLensTint: tint, isLensTintLoading: false });
    } catch (error) {
      console.error('Error fetching lens tint:', error);
      set({
        lensTintError:
          error instanceof Error ? error.message : 'Failed to fetch lens tint',
        isLensTintLoading: false,
      });
      toast.error('Không thể tải thông tin tông màu lens');
    }
  },

  createLensTint: async (data) => {
    try {
      set({ isLensTintLoading: true, lensTintError: null });
      const tint = await lensService.createLensTint(data);

      await get().fetchLensTints();

      set({ isLensTintLoading: false });
      toast.success('Tạo tông màu lens thành công!');
      return tint;
    } catch (error) {
      console.error('Error creating lens tint:', error);
      set({
        lensTintError:
          error instanceof Error ? error.message : 'Failed to create lens tint',
        isLensTintLoading: false,
      });
      toast.error('Không thể tạo tông màu lens');
      return null;
    }
  },

  updateLensTint: async (id, data) => {
    try {
      set({ isLensTintLoading: true, lensTintError: null });
      const tint = await lensService.updateLensTint(id, data);

      set((state) => ({
        lensTints: state.lensTints.map((t) => (t.id === id ? tint : t)),
        selectedLensTint:
          state.selectedLensTint?.id === id ? tint : state.selectedLensTint,
        isLensTintLoading: false,
      }));

      toast.success('Cập nhật tông màu lens thành công!');
      return tint;
    } catch (error) {
      console.error('Error updating lens tint:', error);
      set({
        lensTintError:
          error instanceof Error ? error.message : 'Failed to update lens tint',
        isLensTintLoading: false,
      });
      toast.error('Không thể cập nhật tông màu lens');
      return null;
    }
  },

  deleteLensTint: async (id) => {
    try {
      set({ isLensTintLoading: true, lensTintError: null });
      await lensService.deleteLensTint(id);

      set((state) => ({
        lensTints: state.lensTints.filter((t) => t.id !== id),
        selectedLensTint:
          state.selectedLensTint?.id === id ? null : state.selectedLensTint,
        isLensTintLoading: false,
      }));

      toast.success('Xóa tông màu lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens tint:', error);
      set({
        lensTintError:
          error instanceof Error ? error.message : 'Failed to delete lens tint',
        isLensTintLoading: false,
      });
      toast.error('Không thể xóa tông màu lens');
      return false;
    }
  },

  // =============== TINT COLOR API ACTIONS ===============
  fetchTintColorsByTintId: async (tintId) => {
    try {
      const tintColors = await lensService.getTintColorsByTintId(tintId);
      return tintColors;
    } catch (error) {
      console.error('Error fetching tint colors:', error);
      toast.error('Không thể tải danh sách màu tint');
      return [];
    }
  },

  createTintColor: async (data) => {
    try {
      const tintColor = await lensService.createTintColor(data);
      toast.success('Tạo màu tint thành công!');
      return tintColor;
    } catch (error) {
      console.error('Error creating tint color:', error);
      toast.error('Không thể tạo màu tint');
      return null;
    }
  },

  uploadTintColorImage: async (file) => {
    try {
      const result = await lensService.uploadTintColorImage(file);
      toast.success('Upload hình ảnh thành công!');
      return result;
    } catch (error) {
      console.error('Error uploading tint color image:', error);
      toast.error('Không thể upload hình ảnh');
      return null;
    }
  },

  updateTintColor: async (id, data) => {
    try {
      const tintColor = await lensService.updateTintColor(id, data);
      toast.success('Cập nhật màu tint thành công!');
      return tintColor;
    } catch (error) {
      console.error('Error updating tint color:', error);
      toast.error('Không thể cập nhật màu tint');
      return null;
    }
  },

  deleteTintColor: async (id) => {
    try {
      await lensService.deleteTintColor(id);
      toast.success('Xóa màu tint thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting tint color:', error);
      toast.error('Không thể xóa màu tint');
      return false;
    }
  },

  // =============== LENS THICKNESS TINT COMPATIBILITY API ACTIONS ===============
  fetchCompatibleTintsForThickness: async (thicknessId) => {
    try {
      const compatibleTints =
        await lensService.getCompatibleTintsForThickness(thicknessId);
      return compatibleTints;
    } catch (error) {
      console.error('Error fetching compatible tints:', error);
      toast.error('Không thể tải danh sách tint tương thích');
      return [];
    }
  },

  fetchCompatibleThicknessesForTint: async (tintId) => {
    try {
      const compatibleThicknesses =
        await lensService.getCompatibleThicknessesForTint(tintId);
      return compatibleThicknesses;
    } catch (error) {
      console.error('Error fetching compatible thicknesses:', error);
      toast.error('Không thể tải danh sách độ dày tương thích');
      return [];
    }
  },

  createTintThicknessCompatibility: async (tintId, thicknessIds) => {
    try {
      const result = await lensService.createTintThicknessCompatibility(
        tintId,
        thicknessIds,
      );
      toast.success('Tạo tương thích độ dày tint thành công!');
      return result;
    } catch (error) {
      console.error('Error creating tint thickness compatibility:', error);
      toast.error('Không thể tạo tương thích độ dày tint');
      return [];
    }
  },

  updateTintThicknessCompatibility: async (tintId, thicknessIds) => {
    try {
      // Delete existing and create new ones
      const result = await lensService.createTintThicknessCompatibility(
        tintId,
        thicknessIds,
      );
      toast.success('Cập nhật tương thích độ dày tint thành công!');
      return result;
    } catch (error) {
      console.error('Error updating tint thickness compatibility:', error);
      toast.error('Không thể cập nhật tương thích độ dày tint');
      return [];
    }
  },

  // =============== LENS UPGRADE SETTERS ===============
  setLensUpgrades: (upgrades) => set({ lensUpgrades: upgrades }),
  setSelectedLensUpgrade: (upgrade) => set({ selectedLensUpgrade: upgrade }),
  setLensUpgradeLoading: (loading) => set({ isLensUpgradeLoading: loading }),
  setLensUpgradeError: (error) => set({ lensUpgradeError: error }),
  setLensUpgradeFilters: (filters) => set({ lensUpgradeFilters: filters }),
  clearLensUpgradeError: () => set({ lensUpgradeError: null }),

  // =============== LENS UPGRADE API ACTIONS ===============
  fetchLensUpgrades: async (filters) => {
    try {
      set({ isLensUpgradeLoading: true, lensUpgradeError: null });
      const mergedFilters = { ...get().lensUpgradeFilters, ...filters };
      set({ lensUpgradeFilters: mergedFilters });

      const response = await lensService.getLensUpgrades(mergedFilters);
      const { data } = response;

      set({
        lensUpgrades: data,
        isLensUpgradeLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens upgrades:', error);
      set({
        lensUpgradeError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens upgrades',
        isLensUpgradeLoading: false,
      });
      toast.error('Không thể tải danh sách nâng cấp lens');
    }
  },

  fetchLensUpgradeById: async (id) => {
    try {
      set({ isLensUpgradeLoading: true, lensUpgradeError: null });
      const upgrade = await lensService.getLensUpgradeById(id);
      set({ selectedLensUpgrade: upgrade, isLensUpgradeLoading: false });
    } catch (error) {
      console.error('Error fetching lens upgrade:', error);
      set({
        lensUpgradeError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens upgrade',
        isLensUpgradeLoading: false,
      });
      toast.error('Không thể tải thông tin nâng cấp lens');
    }
  },

  createLensUpgrade: async (data) => {
    try {
      set({ isLensUpgradeLoading: true, lensUpgradeError: null });
      const upgrade = await lensService.createLensUpgrade(data);

      await get().fetchLensUpgrades();

      set({ isLensUpgradeLoading: false });
      toast.success('Tạo nâng cấp lens thành công!');
      return upgrade;
    } catch (error) {
      console.error('Error creating lens upgrade:', error);
      set({
        lensUpgradeError:
          error instanceof Error
            ? error.message
            : 'Failed to create lens upgrade',
        isLensUpgradeLoading: false,
      });
      toast.error('Không thể tạo nâng cấp lens');
      return null;
    }
  },

  updateLensUpgrade: async (id, data) => {
    try {
      set({ isLensUpgradeLoading: true, lensUpgradeError: null });
      const upgrade = await lensService.updateLensUpgrade(id, data);

      set((state) => ({
        lensUpgrades: state.lensUpgrades.map((u) =>
          u.id === id ? upgrade : u,
        ),
        selectedLensUpgrade:
          state.selectedLensUpgrade?.id === id
            ? upgrade
            : state.selectedLensUpgrade,
        isLensUpgradeLoading: false,
      }));

      toast.success('Cập nhật nâng cấp lens thành công!');
      return upgrade;
    } catch (error) {
      console.error('Error updating lens upgrade:', error);
      set({
        lensUpgradeError:
          error instanceof Error
            ? error.message
            : 'Failed to update lens upgrade',
        isLensUpgradeLoading: false,
      });
      toast.error('Không thể cập nhật nâng cấp lens');
      return null;
    }
  },

  deleteLensUpgrade: async (id) => {
    try {
      set({ isLensUpgradeLoading: true, lensUpgradeError: null });
      await lensService.deleteLensUpgrade(id);

      set((state) => ({
        lensUpgrades: state.lensUpgrades.filter((u) => u.id !== id),
        selectedLensUpgrade:
          state.selectedLensUpgrade?.id === id
            ? null
            : state.selectedLensUpgrade,
        isLensUpgradeLoading: false,
      }));

      toast.success('Xóa nâng cấp lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens upgrade:', error);
      set({
        lensUpgradeError:
          error instanceof Error
            ? error.message
            : 'Failed to delete lens upgrade',
        isLensUpgradeLoading: false,
      });
      toast.error('Không thể xóa nâng cấp lens');
      return false;
    }
  },

  // =============== LENS DETAIL SETTERS ===============
  setLensDetails: (details) => set({ lensDetails: details }),
  setSelectedLensDetail: (detail) => set({ selectedLensDetail: detail }),
  setLensDetailLoading: (loading) => set({ isLensDetailLoading: loading }),
  setLensDetailError: (error) => set({ lensDetailError: error }),
  clearLensDetailError: () => set({ lensDetailError: null }),

  // =============== LENS DETAIL API ACTIONS ===============
  fetchLensDetails: async (filters) => {
    try {
      set({ isLensDetailLoading: true, lensDetailError: null });

      const response = await lensService.getLensDetails(filters);
      const { data } = response;

      set({
        lensDetails: data,
        isLensDetailLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens details:', error);
      set({
        lensDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens details',
        isLensDetailLoading: false,
      });
      toast.error('Không thể tải danh sách chi tiết lens');
    }
  },

  fetchLensDetailById: async (id) => {
    try {
      set({ isLensDetailLoading: true, lensDetailError: null });
      const detail = await lensService.getLensDetailById(id);
      set({ selectedLensDetail: detail, isLensDetailLoading: false });
    } catch (error) {
      console.error('Error fetching lens detail:', error);
      set({
        lensDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens detail',
        isLensDetailLoading: false,
      });
      toast.error('Không thể tải thông tin chi tiết lens');
    }
  },

  createLensDetail: async (data) => {
    try {
      set({ isLensDetailLoading: true, lensDetailError: null });
      const detail = await lensService.createLensDetail(data);

      await get().fetchLensDetails();

      set({ isLensDetailLoading: false });
      toast.success('Tạo chi tiết lens thành công!');
      return detail;
    } catch (error) {
      console.error('Error creating lens detail:', error);
      set({
        lensDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to create lens detail',
        isLensDetailLoading: false,
      });
      toast.error('Không thể tạo chi tiết lens');
      return null;
    }
  },

  updateLensDetail: async (id, data) => {
    try {
      set({ isLensDetailLoading: true, lensDetailError: null });
      const detail = await lensService.updateLensDetail(id, data);

      set((state) => ({
        lensDetails: state.lensDetails.map((d) => (d.id === id ? detail : d)),
        selectedLensDetail:
          state.selectedLensDetail?.id === id
            ? detail
            : state.selectedLensDetail,
        isLensDetailLoading: false,
      }));

      toast.success('Cập nhật chi tiết lens thành công!');
      return detail;
    } catch (error) {
      console.error('Error updating lens detail:', error);
      set({
        lensDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to update lens detail',
        isLensDetailLoading: false,
      });
      toast.error('Không thể cập nhật chi tiết lens');
      return null;
    }
  },

  deleteLensDetail: async (id) => {
    try {
      set({ isLensDetailLoading: true, lensDetailError: null });
      await lensService.deleteLensDetail(id);

      set((state) => ({
        lensDetails: state.lensDetails.filter((d) => d.id !== id),
        selectedLensDetail:
          state.selectedLensDetail?.id === id ? null : state.selectedLensDetail,
        isLensDetailLoading: false,
      }));

      toast.success('Xóa chi tiết lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens detail:', error);
      set({
        lensDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to delete lens detail',
        isLensDetailLoading: false,
      });
      toast.error('Không thể xóa chi tiết lens');
      return false;
    }
  },

  // =============== LENS UPGRADE DETAIL SETTERS ===============
  setLensUpgradeDetails: (details) => set({ lensUpgradeDetails: details }),
  setSelectedLensUpgradeDetail: (detail) =>
    set({ selectedLensUpgradeDetail: detail }),
  setLensUpgradeDetailLoading: (loading) =>
    set({ isLensUpgradeDetailLoading: loading }),
  setLensUpgradeDetailError: (error) => set({ lensUpgradeDetailError: error }),
  clearLensUpgradeDetailError: () => set({ lensUpgradeDetailError: null }),

  // =============== LENS UPGRADE DETAIL API ACTIONS ===============
  fetchLensUpgradeDetails: async () => {
    try {
      set({ isLensUpgradeDetailLoading: true, lensUpgradeDetailError: null });

      const response = await lensService.getLensUpgradeDetails();
      const { data } = response;

      set({
        lensUpgradeDetails: data,
        isLensUpgradeDetailLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens upgrade details:', error);
      set({
        lensUpgradeDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens upgrade details',
        isLensUpgradeDetailLoading: false,
      });
      toast.error('Không thể tải danh sách chi tiết nâng cấp lens');
    }
  },

  fetchLensUpgradeDetailById: async (id) => {
    try {
      set({ isLensUpgradeDetailLoading: true, lensUpgradeDetailError: null });
      const detail = await lensService.getLensUpgradeDetailById(id);
      set({
        selectedLensUpgradeDetail: detail,
        isLensUpgradeDetailLoading: false,
      });
    } catch (error) {
      console.error('Error fetching lens upgrade detail:', error);
      set({
        lensUpgradeDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch lens upgrade detail',
        isLensUpgradeDetailLoading: false,
      });
      toast.error('Không thể tải thông tin chi tiết nâng cấp lens');
    }
  },

  createLensUpgradeDetail: async (data) => {
    try {
      set({ isLensUpgradeDetailLoading: true, lensUpgradeDetailError: null });
      const detail = await lensService.createLensUpgradeDetail(data);

      await get().fetchLensUpgradeDetails();

      set({ isLensUpgradeDetailLoading: false });
      toast.success('Tạo chi tiết nâng cấp lens thành công!');
      return detail;
    } catch (error) {
      console.error('Error creating lens upgrade detail:', error);
      set({
        lensUpgradeDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to create lens upgrade detail',
        isLensUpgradeDetailLoading: false,
      });
      toast.error('Không thể tạo chi tiết nâng cấp lens');
      return null;
    }
  },

  updateLensUpgradeDetail: async (id, data) => {
    try {
      set({ isLensUpgradeDetailLoading: true, lensUpgradeDetailError: null });
      const detail = await lensService.updateLensUpgradeDetail(id, data);

      set((state) => ({
        lensUpgradeDetails: state.lensUpgradeDetails.map((d) =>
          d.id === id ? detail : d,
        ),
        selectedLensUpgradeDetail:
          state.selectedLensUpgradeDetail?.id === id
            ? detail
            : state.selectedLensUpgradeDetail,
        isLensUpgradeDetailLoading: false,
      }));

      toast.success('Cập nhật chi tiết nâng cấp lens thành công!');
      return detail;
    } catch (error) {
      console.error('Error updating lens upgrade detail:', error);
      set({
        lensUpgradeDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to update lens upgrade detail',
        isLensUpgradeDetailLoading: false,
      });
      toast.error('Không thể cập nhật chi tiết nâng cấp lens');
      return null;
    }
  },

  deleteLensUpgradeDetail: async (id) => {
    try {
      set({ isLensUpgradeDetailLoading: true, lensUpgradeDetailError: null });
      await lensService.deleteLensUpgradeDetail(id);

      set((state) => ({
        lensUpgradeDetails: state.lensUpgradeDetails.filter((d) => d.id !== id),
        selectedLensUpgradeDetail:
          state.selectedLensUpgradeDetail?.id === id
            ? null
            : state.selectedLensUpgradeDetail,
        isLensUpgradeDetailLoading: false,
      }));

      toast.success('Xóa chi tiết nâng cấp lens thành công!');
      return true;
    } catch (error) {
      console.error('Error deleting lens upgrade detail:', error);
      set({
        lensUpgradeDetailError:
          error instanceof Error
            ? error.message
            : 'Failed to delete lens upgrade detail',
        isLensUpgradeDetailLoading: false,
      });
      toast.error('Không thể xóa chi tiết nâng cấp lens');
      return false;
    }
  },
}));
