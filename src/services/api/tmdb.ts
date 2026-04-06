import { MediaItem } from '../../types/media'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500'
const key = import.meta.env.VITE_TMDB_API_KEY

interface TmdbResult {
    id: number
    title?: string
    name?: string
    poster_path: string | null
    release_date?: string
    first_air_date?: string
    overview: string
    vote_average: number
    media_type?: string
}

export async function searchMovies(query: string): Promise<MediaItem[]> {
    if (!key || key === 'TU_TMDB_API_KEY_AQUI') return []
    const res = await fetch(
        `${TMDB_BASE}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&language=es-MX&page=1`
    )
    if (!res.ok) throw new Error('Error TMDB Movies')
    const data = await res.json()
    return (data.results as TmdbResult[]).slice(0, 10).map((item) => ({
        apiId: String(item.id),
        category: 'movie' as const,
        title: item.title ?? item.name ?? 'Sin título',
        posterPath: item.poster_path ? `${TMDB_IMAGE}${item.poster_path}` : null,
        year: item.release_date?.slice(0, 4) ?? null,
        description: item.overview || null,
        rating: item.vote_average ?? null,
    }))
}

export async function searchSeries(query: string): Promise<MediaItem[]> {
    if (!key || key === 'TU_TMDB_API_KEY_AQUI') return []
    const res = await fetch(
        `${TMDB_BASE}/search/tv?api_key=${key}&query=${encodeURIComponent(query)}&language=es-MX&page=1`
    )
    if (!res.ok) throw new Error('Error TMDB Series')
    const data = await res.json()
    return (data.results as TmdbResult[]).slice(0, 10).map((item) => ({
        apiId: String(item.id),
        category: 'series' as const,
        title: item.name ?? item.title ?? 'Sin título',
        posterPath: item.poster_path ? `${TMDB_IMAGE}${item.poster_path}` : null,
        year: item.first_air_date?.slice(0, 4) ?? null,
        description: item.overview || null,
        rating: item.vote_average ?? null,
    }))
}
