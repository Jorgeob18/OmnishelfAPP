import { useState, useEffect } from 'react'
import { MediaItem, MediaCategory } from '../types/media'
import { searchMovies, searchSeries } from '../services/api/tmdb'
import { searchAnime } from '../services/api/jikan'
import { searchBooks } from '../services/api/googleBooks'

interface SearchState {
    results: MediaItem[]
    loading: boolean
    error: string | null
}

const initialState: SearchState = { results: [], loading: false, error: null }

export function useSearch(query: string, category: MediaCategory) {
    const [state, setState] = useState<SearchState>(initialState)

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setState(initialState)
            return
        }

        let cancelled = false
        setState({ results: [], loading: true, error: null })

        const fetchResults = async () => {
            try {
                let results: MediaItem[] = []
                switch (category) {
                    case 'movie':
                        results = await searchMovies(query)
                        break
                    case 'series':
                        results = await searchSeries(query)
                        break
                    case 'anime':
                        results = await searchAnime(query)
                        break
                    case 'book':
                        results = await searchBooks(query)
                        break
                }
                if (!cancelled) setState({ results, loading: false, error: null })
            } catch {
                if (!cancelled) setState({ results: [], loading: false, error: 'Error al buscar. Intenta de nuevo.' })
            }
        }

        fetchResults()
        return () => { cancelled = true }
    }, [query, category])

    return state
}
