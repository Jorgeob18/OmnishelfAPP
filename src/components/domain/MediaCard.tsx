import { BookOpen, Clapperboard, Star, Tv, Plus, Check, Trash, Heart } from 'lucide-react'
import { MediaItem, MediaCategory, SavedMediaItem, MediaStatus } from '../../types/media'
import { clsx } from 'clsx'

const CATEGORY_ICONS: Record<MediaCategory, React.ReactNode> = {
    movie: <Clapperboard size={10} />,
    series: <Tv size={10} />,
    anime: <Star size={10} />,
    book: <BookOpen size={10} />,
}

const CATEGORY_COLORS: Record<MediaCategory, string> = {
    movie: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    series: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    anime: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    book: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

const CATEGORY_LABELS: Record<MediaCategory, string> = {
    movie: 'Película',
    series: 'Serie',
    anime: 'Anime',
    book: 'Libro',
}

interface MediaCardProps {
    item: MediaItem | SavedMediaItem
    mode?: 'search' | 'shelf'
    isAdded?: boolean
    onAdd?: (item: MediaItem) => void

    onChangeStatus?: (id: string, status: MediaStatus) => void
    onRemove?: (id: string) => void
    onToggleFavorite?: (id: string) => void
}

export function MediaCard({ item, mode = 'search', isAdded = false, onAdd, onChangeStatus, onRemove, onToggleFavorite }: MediaCardProps) {
    return (
        <div className="flex gap-3 p-3 sm:p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 hover:bg-neutral-800/80 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            {/* Poster */}
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 relative z-10 shadow-lg border border-white/5">
                {item.posterPath ? (
                    <>
                        <img
                            src={item.posterPath}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs text-center px-1 font-medium bg-neutral-800/50">
                        Sin Póster
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5 relative z-10">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight font-display tracking-tight group-hover:text-indigo-200 transition-colors">{item.title}</h3>

                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={clsx('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border', CATEGORY_COLORS[item.category])}>
                                {CATEGORY_ICONS[item.category]}
                                {CATEGORY_LABELS[item.category]}
                            </span>
                            {item.year && <span className="text-[11px] text-neutral-400">{item.year}</span>}
                            {item.rating != null && item.rating > 0 && (
                                <span className="text-[11px] text-amber-400 flex items-center gap-0.5">
                                    <Star size={9} fill="currentColor" />
                                    {item.rating.toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {mode === 'search' && onAdd && (
                        <button
                            onClick={() => onAdd(item as MediaItem)}
                            disabled={isAdded}
                            className={clsx(
                                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                                isAdded
                                    ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white active:scale-90 border border-indigo-500/30'
                            )}
                        >
                            {isAdded ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                    )}

                    {mode === 'shelf' && 'id' in item && onChangeStatus && onRemove && (
                        <div className="flex flex-col gap-1 items-end ml-2 mt-[-4px]">
                            <select
                                value={item.status}
                                onChange={(e) => onChangeStatus(item.id, e.target.value as MediaStatus)}
                                className="bg-neutral-800 border border-neutral-600 outline-none focus:border-indigo-500 text-neutral-300 text-[10px] rounded px-1.5 py-1 appearance-none cursor-pointer"
                            >
                                <option value="to_consume">Por Consumir</option>
                                <option value="consuming">En Curso</option>
                                <option value="consumed">Completado</option>
                            </select>

                            <div className="flex gap-1 justify-end items-center mt-1">
                                <button
                                    onClick={() => onToggleFavorite && onToggleFavorite(item.id)}
                                    className={clsx(
                                        "p-1.5 rounded-full transition-colors",
                                        (item as SavedMediaItem).isFavorite
                                            ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50"
                                    )}
                                    title={(item as SavedMediaItem).isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                                >
                                    <Heart size={14} strokeWidth={2.5} fill={(item as SavedMediaItem).isFavorite ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="p-1.5 rounded-full text-red-400 hover:text-red-300 bg-red-400/5 hover:bg-red-400/10 transition-colors opacity-70 hover:opacity-100"
                                    title="Eliminar"
                                >
                                    <Trash size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description preview */}
                {item.description && (
                    <p className="text-[11px] text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                    </p>
                )}
            </div>
        </div>
    )
}
