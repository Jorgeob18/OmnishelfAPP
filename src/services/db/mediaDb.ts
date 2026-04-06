import { supabase } from '../../config/supabase'
import { MediaItem, SavedMediaItem, MediaStatus } from '../../types/media'

export async function fetchUserMedia(userId: string): Promise<SavedMediaItem[]> {
    const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false })

    if (error) throw error

    // Mapear de base de datos snake_case a camelCase estándar
    return data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        apiId: item.api_id,
        category: item.category,
        title: item.title,
        posterPath: item.poster_path,
        status: item.status,
        isFavorite: item.is_favorite,
        addedAt: item.added_at,
        updatedAt: item.updated_at,
        // Note: year, description and rating are not stored in DB, we'll keep them null
        year: null,
        description: null,
        rating: null,
    }))
}

export async function addMediaItem(userId: string, item: MediaItem): Promise<SavedMediaItem> {
    const { data, error } = await supabase
        .from('media_items')
        .insert({
            user_id: userId,
            api_id: item.apiId,
            category: item.category,
            title: item.title,
            poster_path: item.posterPath,
            status: 'to_consume',
            is_favorite: false,
        })
        .select()
        .single()

    if (error) throw error

    return {
        id: data.id,
        userId: data.user_id,
        apiId: data.api_id,
        category: data.category,
        title: data.title,
        posterPath: data.poster_path,
        status: data.status,
        isFavorite: data.is_favorite,
        addedAt: data.added_at,
        updatedAt: data.updated_at,
        year: null,
        description: null,
        rating: null,
    }
}

export async function updateMediaStatus(id: string, status: MediaStatus): Promise<void> {
    const { error } = await supabase
        .from('media_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
}

export async function removeMediaItem(id: string): Promise<void> {
    const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id)

    if (error) throw error
}
