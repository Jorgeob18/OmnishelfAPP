import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../config/supabase'
import { useMediaStore } from '../store/useMediaStore'
import { MediaCard } from '../components/domain/MediaCard'
import { MediaStatus, SavedMediaItem } from '../types/media'
import { clsx } from 'clsx'

const TABS: { id: MediaStatus; label: string }[] = [
    { id: 'to_consume', label: 'Por consumir' },
    { id: 'consuming', label: 'En curso' },
    { id: 'consumed', label: 'Completados' },
]

export default function Shelves() {
    const { session } = useAuthStore()
    const { items, loading, error, loadItems, updateStatus, removeItem, initialized } = useMediaStore()
    const [activeTab, setActiveTab] = useState<MediaStatus>('to_consume')

    useEffect(() => {
        if (!initialized && session) {
            loadItems()
        }
    }, [initialized, loadItems, session])

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    const filteredItems = items.filter((item) => item.status === activeTab)

    return (
        <div className="p-4 sm:p-6 pb-24 max-w-2xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                        Mis Estantes
                    </h1>
                    <p className="text-neutral-400 text-sm">Organiza tu entretenimiento</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-neutral-800/50 p-1 rounded-xl">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                            activeTab === tab.id
                                ? 'bg-neutral-700 text-white shadow-sm'
                                : 'text-neutral-400 hover:text-neutral-200'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading && items.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-400 text-sm">{error}</div>
            ) : filteredItems.length > 0 ? (
                <div className="space-y-3">
                    {filteredItems.map((item) => (
                        <MediaCard
                            key={item.id}
                            item={item}
                            mode="shelf"
                            onChangeStatus={updateStatus}
                            onRemove={removeItem}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
                    <p className="text-neutral-400 mb-2">Este estante está vacío.</p>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-[250px]">
                        Ve al buscador usando el ícono de la lupa abajo para comenzar a sumar títulos.
                    </p>
                </div>
            )}
        </div>
    )
}
