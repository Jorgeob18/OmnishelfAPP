import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'
import { Lock, Loader2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UpdatePassword() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        // Alerta al componente que estamos escuchando los eventos auth.
        // Específicamente, en un flujo de Supabase el usuario queda "logeado"
        // temporalmente al hacer clic en el link de recuperación.
    }, [])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 6) {
            setStatus('error')
            setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
            return
        }

        setLoading(true)
        setStatus('idle')

        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            setStatus('success')
            // Redirigir al home después de un momento
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (err: any) {
            setStatus('error')
            setErrorMessage(err.message || 'Hubo un error al guardar la nueva contraseña.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-text-main mb-2 text-center">
                Actualizar Contraseña
            </h2>
            <p className="text-text-muted text-center text-sm mb-6">
                Ingresa tu nueva contraseña para la cuenta
            </p>

            {status === 'success' ? (
                <div className="text-center space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-4 rounded-lg flex flex-col items-center">
                        <Check className="h-8 w-8 mb-2" />
                        ¡La contraseña ha sido actualizada exitosamente!
                    </div>
                    <p className="text-sm text-text-muted animate-pulse">Redirigiendo a tus estantes...</p>
                </div>
            ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-main/80 mb-1">Nueva Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-text-muted" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-base-card border border-base-border/20 rounded-lg pl-10 px-4 py-2.5 text-text-main focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
                                placeholder="Minimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-text-main bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            'Guardar Cambios'
                        )}
                    </button>
                </form>
            )}
        </div>
    )
}

