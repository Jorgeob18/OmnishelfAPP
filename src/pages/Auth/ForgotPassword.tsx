import { useState } from 'react'
import { supabase } from '../../config/supabase'
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        setStatus('idle')

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })
            if (error) throw error
            setStatus('success')
        } catch (err: any) {
            setStatus('error')
            setErrorMessage(err.message || 'Error al enviar el enlace de recuperación.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-text-main mb-2 text-center">
                Recuperar Contraseña
            </h2>
            <p className="text-text-muted text-center text-sm mb-6">
                Te enviaremos un enlace para restaurarla
            </p>

            {status === 'success' ? (
                <div className="text-center space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-4 rounded-lg">
                        ¡Enviado! Revisa tu correo (e incluye la carpeta Spam) para restablecer tu contraseña.
                    </div>
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a iniciar sesión
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleReset} className="space-y-4">
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-main/80 mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-text-muted" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-base-card border border-base-border/20 rounded-lg pl-10 px-4 py-2.5 text-text-main focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-text-main bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            <>
                                Enviar Enlace
                                <Send className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-center">
                        <Link
                            to="/auth/login"
                            className="text-sm text-text-muted hover:text-text-main transition-colors"
                        >
                            Cancelar y volver
                        </Link>
                    </div>
                </form>
            )}
        </div>
    )
}

