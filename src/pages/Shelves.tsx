import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../config/supabase'

export default function Shelves() {
    const { user } = useAuthStore()

    return (
        <div className="p-4 sm:p-6 pb-20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">Mis Estantes</h1>

            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 shadow-xl mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Bienvenido a OmniShelf</h2>
                <p className="text-neutral-400">Sesión iniciada como: <span className="text-indigo-400">{user?.email}</span></p>
            </div>

            <button
                onClick={() => supabase.auth.signOut()}
                className="px-6 py-2.5 bg-red-600/10 text-red-500 border border-red-600/30 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
                Cerrar Sesión
            </button>
        </div>
    )
}
