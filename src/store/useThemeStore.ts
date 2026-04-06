import { create } from 'zustand'

export type ThemeMode = 'light' | 'neutral' | 'dark'

interface ThemeState {
    theme: ThemeMode
    setTheme: (theme: ThemeMode) => void
    initTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'neutral',
    setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('omnishelf_theme', theme)
        // Adicionalmente aplicamos a una etiqueta de color para status bar móvil
        const metaThemeColor = document.querySelector("meta[name=theme-color]")
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", theme === 'light' ? '#f8fafc' : (theme === 'dark' ? '#000000' : '#0a0a0a'))
        }
        set({ theme })
    },
    initTheme: () => {
        const saved = localStorage.getItem('omnishelf_theme') as ThemeMode
        const defaultTheme = saved || 'neutral'
        document.documentElement.setAttribute('data-theme', defaultTheme)

        const metaThemeColor = document.querySelector("meta[name=theme-color]")
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", defaultTheme === 'light' ? '#f8fafc' : (defaultTheme === 'dark' ? '#000000' : '#0a0a0a'))
        }

        set({ theme: defaultTheme })
    }
}))
