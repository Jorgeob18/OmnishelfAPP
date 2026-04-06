import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './config/supabase'
import { useAuthStore } from './store/useAuthStore'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Auth/Login'
import Shelves from './pages/Shelves'
import SearchPage from './pages/Search'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, initialized } = useAuthStore()

  if (!initialized) return <div className="flex h-screen w-screen items-center justify-center bg-neutral-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>

  if (!session) return <Navigate to="/auth/login" replace />

  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, initialized } = useAuthStore()

  if (!initialized) return <div className="flex h-screen w-screen items-center justify-center bg-neutral-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>

  if (session) return <Navigate to="/" replace />

  return <>{children}</>
}

function App() {
  const { setSession, setInitialized } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setInitialized])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Shelves />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<div className="p-4">Perfil (Temporal)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
