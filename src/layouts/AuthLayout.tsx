import { Outlet } from 'react-router-dom'
import { Library } from 'lucide-react'

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Library className="h-8 w-8 text-indigo-400" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                    OmniShelf
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-400 max-w-sm mx-auto">
                    Centraliza tus listas de consumo cultural en una sola plataforma unificada.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-neutral-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-800">
                    <Outlet />
                </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
            </div>
        </div>
    )
}
