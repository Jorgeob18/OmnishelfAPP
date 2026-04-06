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
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <nav className="fixed bottom-0 w-full bg-neutral-900/80 backdrop-blur-md border-t border-neutral-800 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50">
                <div className="flex justify-around max-w-md mx-auto relative">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "p-4 flex flex-col items-center transition-all duration-300 w-full relative",
                                    isActive ? "text-indigo-400" : "text-neutral-500 hover:text-neutral-300"
                                )}
                            >
                                {/* Indicador superior activo */}
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-indigo-500 rounded-b-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>
                                )}

                                <item.icon size={24} className={clsx("transition-transform duration-300", isActive && "-translate-y-1")} />
                                <span className={clsx("text-[10px] sm:text-xs mt-1.5 font-medium transition-all duration-300", isActive ? "opacity-100" : "opacity-0 translate-y-2")}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
