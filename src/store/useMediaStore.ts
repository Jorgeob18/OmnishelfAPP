import { create } from 'zustand'
import { SavedMediaItem, MediaItem, MediaStatus } from '../types/media'
import { fetchUserMedia, addMediaItem, updateMediaStatus, removeMediaItem, updateMediaFavorite } from '../services/db/mediaDb'
import { useAuthStore } from './useAuthStore'

interface MediaState {
    items: SavedMediaItem[]
    loading: boolean
    error: string | null
    initialized: boolean

    loadItems: () => Promise<void>
    addItem: (item: MediaItem) => Promise<SavedMediaItem | null>

    updateStatus: (id: string, status: MediaStatus) => Promise<void>
    removeItem: (id: string) => Promise<void>
    toggleFavorite: (id: string) => Promise<void>
}

export const useMediaStore = create<MediaState>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    initialized: false,

    loadItems: async () => {
        const session = useAuthStore.getState().session
        if (!session?.user) return

        set({ loading: true, error: null })
        try {
            const items = await fetchUserMedia(session.user.id)
            set({ items, initialized: true, loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    addItem: async (item: MediaItem) => {
        const session = useAuthStore.getState().session
        if (!session?.user) return null

        // Optimistic check to avoid duplicate inserts on UI side
        const currentItems = get().items
        const existingRow = currentItems.find(
            (existing) => existing.apiId === item.apiId && existing.category === item.category
        )
        if (existingRow) return existingRow

        try {
            const savedItem = await addMediaItem(session.user.id, item)
            set({ items: [savedItem, ...get().items] })
            return savedItem
        } catch (error: any) {
            set({ error: error.message })
            return null
        }
    },

    updateStatus: async (id: string, status: MediaStatus) => {
        try {
            // Optimistic upate
            set((state) => ({
                items: state.items.map((i) => i.id === id ? { ...i, status } : i)
            }))
            await updateMediaStatus(id, status)
        } catch (error: any) {
            set({ error: error.message })
            // Revert optimistic update gracefully if needed here...
        }
    },

    removeItem: async (id: string) => {
        try {
            // Optimistic remove
            set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            }))
            await removeMediaItem(id)
        } catch (error: any) {
            set({ error: error.message })
        }
    },

    toggleFavorite: async (id: string) => {
        try {
            // Optimistic update
            let targetIsFavorite = false
            set((state) => ({
                items: state.items.map((i) => {
                    if (i.id === id) {
                        targetIsFavorite = !i.isFavorite
                        return { ...i, isFavorite: targetIsFavorite }
                    }
                    return i
                })
            }))
            await updateMediaFavorite(id, targetIsFavorite)
        } catch (error: any) {
            set({ error: error.message })
        }
    }
}))
