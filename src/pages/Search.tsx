import { useState } from 'react'
import { Search, Film, Tv, Sword, BookOpen, AlertCircle } from 'lucide-react'
import { MediaCategory, MediaItem } from '../types/media'
import { useDebounce } from '../hooks/useDebounce'
import { useSearch } from '../hooks/useSearch'
import { MediaCard } from '../components/domain/MediaCard'
import { SkeletonCard } from '../components/common/SkeletonCard'
import { clsx } from 'clsx'

const CATEGORIES: { id: MediaCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'movie', label: 'Películas', icon: <Film size={16} />, color: 'data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-300 data-[active=true]:border-blue-500/40' },
    { id: 'series', label: 'Series', icon: <Tv size={16} />, color: 'data-[active=true]:bg-purple-500/20 data-[active=true]:text-purple-300 data-[active=true]:border-purple-500/40' },
    { id: 'anime', label: 'Anime', icon: <Sword size={16} />, color: 'data-[active=true]:bg-pink-500/20 data-[active=true]:text-pink-300 data-[active=true]:border-pink-500/40' },
    { id: 'book', label: 'Libros', icon: <BookOpen size={16} />, color: 'data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-300 data-[active=true]:border-emerald-500/40' },
]

const PLACEHOLDERS: Record<MediaCategory, string> = {
    movie: 'Buscar película... ej. Inception',
    series: 'Buscar serie... ej. Breaking Bad',
    anime: 'Buscar anime... ej. Attack on Titan',
    book: 'Buscar libro... ej. El Principito',
}

const API_MISSING_MSG: Partial<Record<MediaCategory, string>> = {
    movie: 'Configura VITE_TMDB_API_KEY en .env.local',
    series: 'Configura VITE_TMDB_API_KEY en .env.local',
    book: 'Configura VITE_GOOGLE_BOOKS_API_KEY en .env.local',
}

export default function SearchPage() {
    const [category, setCategory] = useState<MediaCategory>('movie')
    const [query, setQuery] = useState('')
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
    const debouncedQuery = useDebounce(query, 450)

    // Check API key availability
    const tmdbKey = import.meta.env.VITE_TMDB_API_KEY
    const gbKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
    const isMissingKey =
        ((category === 'movie' || category === 'series') && (!tmdbKey || tmdbKey === 'TU_TMDB_API_KEY_AQUI')) ||
        (category === 'book' && (!gbKey || gbKey === 'TU_GOOGLE_BOOKS_API_KEY_AQUI'))

    const { results, loading, error } = useSearch(debouncedQuery, category)

    const handleAdd = (item: MediaItem) => {
        // TODO: conectar con Supabase en el sprint de Estantes
        setAddedIds((prev) => new Set(prev).add(`${item.category}-${item.apiId}`))
    }

    const handleCategoryChange = (cat: MediaCategory) => {
        setCategory(cat)
        setQuery('')
    }

    return (
        <div className="p-4 sm:p-6 pb-24 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                Buscar
            </h1>
            <p className="text-neutral-400 text-sm mb-5">Encuentra y añade a tus estantes</p>

            {/* Category tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        data-active={category === cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={clsx(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-all duration-200',
                            'border-neutral-700 text-neutral-400 hover:text-neutral-200',
                            cat.color
                        )}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Search input */}
            <div className="relative mb-5">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={18} className="text-neutral-500" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={PLACEHOLDERS[category]}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-neutral-500"
                />
            </div>

            {/* API key warning */}
            {isMissingKey && query.length > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm mb-4">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{API_MISSING_MSG[category]}</span>
                </div>
            )}

            {/* Skeletons */}
            {loading && (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="text-center py-10 text-red-400 text-sm">{error}</div>
            )}

            {/* Empty state */}
            {!loading && !error && debouncedQuery.length > 1 && results.length === 0 && !isMissingKey && (
                <div className="text-center py-10 text-neutral-500 text-sm">
                    No se encontraron resultados para <span className="text-white">"{debouncedQuery}"</span>
                </div>
            )}

            {/* Idle state */}
            {!loading && !debouncedQuery && (
                <div className="text-center py-16 text-neutral-600">
                    <Search size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Escribe para buscar {CATEGORIES.find(c => c.id === category)?.label.toLowerCase()}</p>
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div className="space-y-2.5">
                    {results.map((item) => (
                        <MediaCard
                            key={`${item.category}-${item.apiId}`}
                            item={item}
                            isAdded={addedIds.has(`${item.category}-${item.apiId}`)}
                            onAdd={handleAdd}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
