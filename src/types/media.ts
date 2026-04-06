export type MediaCategory = 'movie' | 'series' | 'book' | 'anime'
export type MediaStatus = 'to_consume' | 'consuming' | 'consumed'

// Estándar OmniShelf — todas las APIs son mapeadas a este tipo
export interface MediaItem {
    apiId: string
    category: MediaCategory
    title: string
    posterPath: string | null
    year: string | null
    description: string | null
    rating: number | null
}

// Item guardado en Supabase (extiende el estándar con campos de usuario)
export interface SavedMediaItem extends MediaItem {
    id: string
    userId: string
    status: MediaStatus
    isFavorite: boolean
    addedAt: string
    updatedAt: string
}
