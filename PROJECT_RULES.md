# OmniShelf PWA - Reglas del Proyecto

## Leyes Inquebrantables
1. **Prohibido el 'Prop Drilling':** Para estados compartidos, de sesión o profundamente anidados, utilizar obligatoriamente Context API o Zustand.
2. **Componentes Atómicos:** Desarrollar interfaces centralizadas, buscando la separación lógica de componentes genéricos (botones, inputs) de los específicos del dominio de la aplicación.
3. **Manejo Estricto de Estados de Carga:** Todas las peticiones asíncronas deben incluir estados transitorios implementados mediante *Skeleton Loaders* e indicadores consistentes para maximizar la percepción de velocidad (UX).

## Convenciones de Nomenclatura (Naming)
* **Variables y Funciones:** `camelCase` (ej. `fetchMediaData`, `searchQuery`).
* **Componentes React:** `PascalCase` (ej. `MediaCard`, `SearchBar`).
* **Archivos de Componentes JSX/TSX:** `PascalCase` (ej. `MediaCard.tsx`).
* **Hooks Personalizados:** Prefijo `use` en `camelCase` (ej. `useAuth`, `useSearch`).
* **Constantes Globales:** `UPPER_SNAKE_CASE` (ej. `API_BASE_URL`).
* **Tipos e Interfaces (TypeScript):** `PascalCase` sin prefijos "I" (ej. `UserProfile`, `MediaItem`).
