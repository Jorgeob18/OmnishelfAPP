# OmniShelf PWA 🍿📚🎮

**OmniShelf** es una aplicación web progresiva (PWA) de nivel premium diseñada para centralizar, gestionar y organizar todas tus listas de consumo cultural: Películas, Series, Anime y Libros. Todo en un solo lugar, con sincronización en la nube y una experiencia de usuario (UX/UI) moderna y vibrante.

![OmniShelf Banner](public/icons/android-chrome-192x192.png) *(Coloca aquí una captura de pantalla de la app en caso de tener una)*

---

## ✨ Características Principales

*   **Gestión Multi-Categoría:** Busca y organiza Películas, Series, Libros y Anime utilizando potentes integraciones con las APIs de TMDB y Google Books.
*   **Estados de Consumo:** Cada elemento en tus estantes puede ser catalogado en tres estados dinámicos:
    *   🕐 *Por Consumir*
    *   ▶️ *En Curso*
    *   ✅ *Completados*
*   **Sistema Multi-Tema (Vibrant UI):** La aplicación cuenta con un diseño basado en *Glassmorphism* (cristales esmerilados) e incluye 3 apariencias intercambiables en tiempo real que se guardan en tus preferencias locales:
    *   ☀️ **Modo Claro:** Alta luminosidad y legibilidad superior.
    *   🌗 **Modo Neutro:** Grises ultra-oscuros con estética neón (Por Defecto).
    *   🌑 **Modo Oscuro (AMOLED):** Negro estricto profundo para un contraste masivo y ahorro de batería.
*   **Sistema de Favoritos:** Marca con un corazón interactivo tus títulos preferidos y fíltralos rápidamente con un solo clic.
*   **Progressive Web App (PWA):** Instalable tanto en dispositivos de escritorio como en smartphones, con soporte para caché offline y sin las molestas barras de navegación nativas del navegador (soporte "standalone").
*   **Autenticación en la Nube:** Sistema de registro, inicio de sesión y recuperación de contraseñas impulsado por la robustez de Supabase.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** React 18, TypeScript, Vite
*   **Estilos y UX:** Tailwind CSS v4 (incorporando utilidades personalizadas `@theme`), Lucide React (Íconos), Framer Motion / CSS Transitions.
*   **Base de Datos y Auth:** Supabase (PostgreSQL + Supabase Auth)
*   **Gestión de Estado:** Zustand (para estado de red, sesión de usuario y control del tema global)
*   **APIs Externas:**
    *   *The Movie Database (TMDB)* para películas y series.
    *   *Google Books API* para libros.

---

## 🚀 Instalación y Desarrollo Local

Para correr este proyecto en tu entorno local, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TuUsuario/OmniShelfAPP.git
cd OmniShelfAPP
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto basándote en un archivo `.env.example` o usando esta estructura y asegurándote de colocar tus propias llaves API:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_TMDB_API_KEY=tu_api_key_de_tmdb
VITE_GOOGLE_BOOKS_API_KEY=tu_api_key_de_google_books
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

---

## 📦 Despliegue en Producción (Netlify)

El proyecto está optimizado para su construcción estática rápida debido a Vite. 
1. Asegúrate de configurar las variables de entorno en el panel de **Entorno (Environment Variables)** de Netlify.
2. Comando de construcción: `npm run build`
3. Directorio de publicación: `dist/`

> **Nota para PWA:** El plugin de Vite PWA automáticamente compila e inyecta los *Service Workers* y el manifiesto (`manifest.webmanifest`) requerido durante el proceso de build.

---

## 🧭 ¿Cómo funciona la arquitectura del tema?

A diferencia de muchos proyectos que utilizan librerías pre-cocinadas de temas, **OmniShelf** utiliza variables semánticas inyectadas dinámicamente en `:root` que sobreescriben la paleta nativa de TailwindCSS. Esto permite que el cambio del usuario en la pestaña **"Mi Perfil"** se refleje en milisegundos en toda la aplicación y sin parpadeos. 

---

**OmniShelfAPP** ha sido construido pensando en la máxima inmersión visual. ¡Disfruta organizando tu entretenimiento!
