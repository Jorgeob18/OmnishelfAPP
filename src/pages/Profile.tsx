import { useThemeStore, ThemeMode } from '../store/useThemeStore'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../config/supabase'
import { LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { clsx } from 'clsx'

export default function Profile() {
    const { theme, setTheme } = useThemeStore()
    const { session } = useAuthStore()

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    const THEMES: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
        { id: 'light', label: 'Claro', icon: <Sun size={20} />, desc: 'Alta Luminosidad' },
        { id: 'neutral', label: 'Neutro', icon: <Monitor size={20} />, desc: 'Gris Oscuro (Por defecto)' },
        { id: 'dark', label: 'Oscuro', icon: <Moon size={20} />, desc: 'Negro Profundo (Amoled)' },
    ]

    return (
        <div className="pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                Perfil de Usuario
            </h1>
            <p className="text-text-muted text-sm mb-8">Personaliza tu experiencia de lectura y visualización</p>

            <div className="glass-panel p-6 rounded-3xl mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold border border-indigo-500/30">
                        {session?.user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-main line-clamp-1">{session?.user.email}</h2>
                        <p className="text-xs text-text-muted">Miembro OmniShelf</p>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-bold text-text-main mb-4 px-2">Apariencia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                {THEMES.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300",
                            theme === t.id
                                ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-inset ring-indigo-500/20 text-indigo-400"
                                : "bg-base-card/50 border-white/5 hover:bg-base-card hover:border-white/10 text-text-muted"
                        )}
                    >
                        <div className={clsx("p-3 rounded-full", theme === t.id ? "bg-indigo-500/20" : "bg-white/5")}>
                            {t.icon}
                        </div>
                        <div className="text-center">
                            <h3 className={clsx("font-display font-bold text-sm", theme === t.id ? "text-text-main" : "")}>{t.label}</h3>
                            <p className="text-[10px] mt-1 opacity-70">{t.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="px-2">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 py-3.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl border border-red-500/20 transition-colors"
                >
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
