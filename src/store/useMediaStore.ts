import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'
import { SavedMediaItem, MediaItem, MediaStatus } from '../types/media'
import { fetchUserMedia, addMediaItem, updateMediaStatus, removeMediaItem, updateMediaFavorite } from '../services/db/mediaDb'
import { useAuthStore } from './useAuthStore'

// Custom IndexedDB storage para Zustand persist
const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name)
    },
}

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

export const useMediaStore = create<MediaState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,
            error: null,
            initialized: false,

            loadItems: async () => {
                const session = useAuthStore.getState().session
                if (!session?.user) return

                set({ loading: true, error: null })
                try {
                    const onlineItems = await fetchUserMedia(session.user.id)
                    set({ items: onlineItems, initialized: true, loading: false })
                } catch (error: any) {
                    console.log("No se pudo conectar a Supabase. Cargando datos desde caché (IndexedDB)...")
                    // No sobreescribimos los items locales si falla, permitiendo funcionalidad offline
                    set({ loading: false, initialized: true })
                }
            },

            addItem: async (item: MediaItem) => {
                const session = useAuthStore.getState().session
                if (!session?.user) return null

                const currentItems = get().items
                const existingRow = currentItems.find(
                    (existing) => existing.apiId === item.apiId && existing.category === item.category
                )
                if (existingRow) return existingRow

                // ID local temporal para Offline Mode puro
                const tempId = crypto.randomUUID()
                const optimisticItem: SavedMediaItem = {
                    ...item,
                    id: tempId,
                    userId: session.user.id,
                    status: 'to_consume',
                    isFavorite: false,
                    addedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }

                set({ items: [optimisticItem, ...get().items] })

                try {
                    const savedItem = await addMediaItem(session.user.id, item)
                    // Si hay internet, intercambiamos el ID local por el real que dió Supabase
                    set({ items: get().items.map(i => i.id === tempId ? savedItem : i) })
                    return savedItem
                } catch (error: any) {
                    console.log("Modo Offline: El título ha sido guardado localmente.")
                    return optimisticItem
                }
            },

            updateStatus: async (id: string, status: MediaStatus) => {
                set((state) => ({
                    items: state.items.map((i) => i.id === id ? { ...i, status } : i)
                }))
                try {
                    await updateMediaStatus(id, status)
                } catch (error: any) {
                    console.log("Modo Offline: Estatus actualizado localmente.")
                }
            },

            removeItem: async (id: string) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id)
                }))
                try {
                    await removeMediaItem(id)
                } catch (error: any) {
                    console.log("Modo Offline: Elemento eliminado localmente.")
                }
            },

            toggleFavorite: async (id: string) => {
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

                try {
                    await updateMediaFavorite(id, targetIsFavorite)
                } catch (error: any) {
                    console.log("Modo Offline: Favorito actualizado localmente.")
                }
            }
        }),
        {
            name: 'omnishelf-media-storage',
            storage: createJSONStorage(() => idbStorage),
            // Solo persistimos la lista de items.
            partialize: (state) => ({ items: state.items }),
        }
    )
)
