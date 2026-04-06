import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './config/supabase'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import UpdatePassword from './pages/Auth/UpdatePassword'
import Shelves from './pages/Shelves'
import SearchPage from './pages/Search'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, initialized } = useAuthStore()

  if (!initialized) return <div className="flex h-screen w-screen items-center justify-center bg-base-app"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>

  if (!session) return <Navigate to="/auth/login" replace />

  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, initialized } = useAuthStore()

  if (!initialized) return <div className="flex h-screen w-screen items-center justify-center bg-base-app"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>

  if (session) return <Navigate to="/" replace />

  return <>{children}</>
}

function App() {
  const { setSession, setInitialized } = useAuthStore()
  const { initTheme } = useThemeStore()

  useEffect(() => {
    // Inicializar el tema base desde localStorage
    initTheme()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    }).catch((error) => {
      console.warn("Offline auth fetch failed, falling back to local session.", error)
      setInitialized(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setInitialized, initTheme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="update-password" element={<UpdatePassword />} />
        </Route>

        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Shelves />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

