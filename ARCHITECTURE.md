# OmniShelf PWA - Arquitectura

## Stack Tecnológico
* **Frontend:** Vite + React (TypeScript)
* **Estilos:** Tailwind CSS
* **Iconografía:** Lucide React
* **Backend as a Service (BaaS):** Supabase (Autenticación y Base de Datos)
* **PWA:** Vite PWA Plugin (Service Workers, Offline support)

## Estructura de la Base de Datos (Supabase)

### Tabla: `profiles`
* `id` (uuid, primary key, references `auth.users.id`)
* `email` (string)
* `username` (string)
* `avatar_url` (string, opcional)
* `created_at` (timestamp)

### Tabla: `media_items`
* `id` (uuid, primary key)
* `user_id` (uuid, foreign key references `profiles.id`)
* `api_id` (string) - ID original de la API externa
* `category` (enum: 'movie', 'series', 'book', 'anime')
* `title` (string)
* `poster_path` (string)
* `status` (enum: 'to_consume', 'consuming', 'consumed') - Por ver/leer, Viendo/Leyendo, Vistos/Leídos
* `is_favorite` (boolean) - Flag independiente del estado
* `added_at` (timestamp)
* `updated_at` (timestamp)

## Estrategia de Consumo de APIs Externas
1. **Películas y Series (TMDB API):** Búsqueda por título, obtención de detalles y Watch Providers.
2. **Animes (Jikan API):** Búsqueda basada en MyAnimeList.
3. **Libros (Google Books API):** Búsqueda por volumen/título.
* Estrategia de persistencia: Todas las APIs externas pasarán por **adaptadores/mappers** locales para unificar la estructura de la información al "Estándar OmniShelf" antes de procesarla en la UI o guardarla en Supabase.
