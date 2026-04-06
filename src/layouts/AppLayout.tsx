import { Outlet, Link, useLocation } from 'react-router-dom'
import { Library, Search, User as UserIcon } from 'lucide-react'
import { clsx } from 'clsx'

export default function AppLayout() {
    const location = useLocation()

    const navItems = [
        { name: 'Estantes', path: '/', icon: Library },
        { name: 'Buscar', path: '/search', icon: Search },
        { name: 'Perfil', path: '/profile', icon: UserIcon },
    ]

    return (
        <div className="min-h-screen bg-base-app text-text-main flex flex-col font-sans">
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <nav className="fixed bottom-3 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm bg-base-card/60 backdrop-blur-2xl border border-base-border/10 rounded-2xl sm:rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 relative",
                                    isActive ? "text-text-main" : "text-text-muted hover:text-text-main/80 hover:bg-base-border/5"
                                )}
                            >
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <div className="absolute top-0 w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-md shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
                                )}

                                <item.icon size={22} className={clsx("transition-transform duration-300 z-10", isActive && "-translate-y-0.5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]")} />
                                <span className={clsx("text-[10px] sm:text-[11px] font-medium transition-all duration-300 z-10", isActive ? "opacity-100" : "opacity-0 translate-y-1")}>
                                    {item.name}
                                </span>

                                {/* Background ambient glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-xl blur-md"></div>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}

