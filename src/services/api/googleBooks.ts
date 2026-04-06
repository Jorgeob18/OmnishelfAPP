import { MediaItem } from '../../types/media'

const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1'
const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

interface GoogleBooksVolume {
    id: string
    volumeInfo: {
        title: string
        authors?: string[]
        description?: string
        imageLinks?: { thumbnail?: string; smallThumbnail?: string }
        publishedDate?: string
        averageRating?: number
    }
}

export async function searchBooks(query: string): Promise<MediaItem[]> {
    if (!key || key === 'TU_GOOGLE_BOOKS_API_KEY_AQUI') return []
    const res = await fetch(
        `${GOOGLE_BOOKS_BASE}/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=es&key=${key}`
    )
    if (!res.ok) throw new Error('Error Google Books API')
    const data = await res.json()
    if (!data.items) return []
    return (data.items as GoogleBooksVolume[]).map((item) => ({
        apiId: item.id,
        category: 'book' as const,
        title: item.volumeInfo.title,
        posterPath:
            item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ??
            item.volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://') ??
            null,
        year: item.volumeInfo.publishedDate?.slice(0, 4) ?? null,
        description: item.volumeInfo.description ?? null,
        rating: item.volumeInfo.averageRating ?? null,
    }))
}
