import { MediaItem } from '../../types/media'

const JIKAN_BASE = 'https://api.jikan.moe/v4'

interface JikanAnime {
    mal_id: number
    title: string
    title_english: string | null
    images: { jpg: { image_url: string } }
    aired: { prop: { from: { year: number | null } } }
    synopsis: string | null
    score: number | null
}

export async function searchAnime(query: string): Promise<MediaItem[]> {
    const res = await fetch(
        `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=10&sfw=true`
    )
    if (!res.ok) throw new Error('Error Jikan API')
    const data = await res.json()
    return (data.data as JikanAnime[]).map((item) => ({
        apiId: String(item.mal_id),
        category: 'anime' as const,
        title: item.title_english ?? item.title,
        posterPath: item.images?.jpg?.image_url ?? null,
        year: item.aired?.prop?.from?.year ? String(item.aired.prop.from.year) : null,
        description: item.synopsis ?? null,
        rating: item.score ?? null,
    }))
}
