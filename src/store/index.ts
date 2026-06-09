import { create } from "zustand"
import { User, EventCategoryDTO, UsageStats } from "@/types"
import * as SecureStore from "expo-secure-store"

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (isLoading: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, isLoading: false }),
}))

interface CategoryStore {
  categories: EventCategoryDTO[]
  isLoading: boolean
  setCategories: (categories: EventCategoryDTO[]) => void
  addCategory: (category: EventCategoryDTO) => void
  removeCategory: (categoryIdOrName: string) => void
  updateCategory: (categoryId: string, category: EventCategoryDTO) => void
  setIsLoading: (isLoading: boolean) => void
  clear: () => void
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoading: true,
  setCategories: (categories) => set({ categories, isLoading: false }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  removeCategory: (categoryIdOrName) =>
    set((state) => ({
      categories: state.categories.filter(
        (c) => c.id !== categoryIdOrName && c.name !== categoryIdOrName
      ),
    })),
  updateCategory: (categoryId, category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === categoryId ? category : c)),
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ categories: [], isLoading: false }),
}))

interface UsageStore {
  usage: UsageStats | null
  isLoading: boolean
  setUsage: (usage: UsageStats | null) => void
  setIsLoading: (isLoading: boolean) => void
  clear: () => void
}

export const useUsageStore = create<UsageStore>((set) => ({
  usage: null,
  isLoading: true,
  setUsage: (usage) => set({ usage, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ usage: null, isLoading: false }),
}))

interface UIStore {
  selectedCategoryId: string | null
  isCreateModalOpen: boolean
  setSelectedCategoryId: (id: string | null) => void
  setIsCreateModalOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  selectedCategoryId: null,
  isCreateModalOpen: false,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setIsCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
}))

// Utility to save token to secure store
export const saveAuthToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("clerk_token", token)
  } catch (error) {
    console.error("Failed to save auth token:", error)
  }
}

// Utility to retrieve token from secure store
export const getAuthToken = async () => {
  try {
    return await SecureStore.getItemAsync("clerk_token")
  } catch (error) {
    console.error("Failed to get auth token:", error)
    return null
  }
}

// Utility to clear all stores and auth
export const clearAllStores = async () => {
  useAuthStore.getState().clear()
  useCategoryStore.getState().clear()
  useUsageStore.getState().clear()
  try {
    await SecureStore.deleteItemAsync("clerk_token")
  } catch (error) {
    console.error("Failed to clear auth token:", error)
  }
}
