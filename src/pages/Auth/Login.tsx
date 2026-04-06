import { useState } from 'react'
import { supabase } from '../../config/supabase'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username },
                    },
                })
                if (error) throw error

                // Supabase requiere confirmación de email por defecto. 
                // Si no hay sesión devuelta es porque se envió un correo de validación.
                if (data.user && data.session === null) {
                    setSuccess('¡Registro exitoso! Por favor, revisa tu bandeja de correo para confirmar la cuenta (no olvides mirar en Spam).')
                    setIsSignUp(false)
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al autenticar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {isSignUp ? 'Crea tu cuenta' : 'Inicia Sesión'}
            </h2>
            <p className="text-neutral-400 text-center text-sm mb-6">
                {isSignUp ? 'Únete a OmniShelf' : 'Accede a tu estante virtual'}
            </p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-3 rounded-lg mb-4 text-center">
                    {success}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre de Usuario</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
                                placeholder="LectorFeroz99"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Correo Electrónico</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-neutral-500" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
                            placeholder="••••••••"
                        />
                    </div>
                    {!isSignUp && (
                        <div className="flex justify-end mt-1">
                            <Link
                                to="/auth/forgot-password"
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                    {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                        <>
                            {isSignUp ? 'Registrarse' : 'Entrar'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp)
                        setError(null)
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    {isSignUp
                        ? '¿Ya tienes una cuenta? Inicia sesión'
                        : '¿No tienes cuenta? Regístrate gratis'}
                </button>
            </div>
        </div>
    )
}
