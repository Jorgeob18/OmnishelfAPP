# OmniShelf PWA - Especificaciones

## Backlog de Funcionalidades Core
- [ ] **Auth con Supabase:** Sistema de registro, inicio de sesión y gestión ágil de perfiles de usuario.
- [ ] **Buscador Multicanal:** Implementación de interfaz de búsqueda unificada (fuzzy search adaptativo) conectada a TMDB, Jikan y Google Books (optimizando llamadas con debounce).
- [ ] **Gestión de Estantes (Listas):** CRUD interno (guardar en base de datos local / Supabase) con clasificación: Por ver/leer, Viendo/Leyendo, Vistos/Leídos.
- [ ] **Sistema de Favoritos:** Flag booleano de "Heart / Star" independiente del estante en el que se encuentre.
- [ ] **Modo PWA:** Configuración de web manifest, service workers y caché con soporte offline básico integrado como App en el SO nativo.

## Definición de 'Hecho' (DoD - Definition of Done)
1. El requerimiento cumple íntegramente los criterios de aceptación especificados en este documento y el Backlog.
2. El código está libre de *prop drilling* y cuenta con el tipado estricto correcto (`No `any` permitido de forma injustificada`).
3. La interfaz cuenta con diseño responsivo (Móvil-primero a Escritorio).
4. El manejo de las llamadas a API/Back-end contempla `Skeletons` obligatorios antes de resolver la pantalla.
5. El código hace uso de componentes modulares y se ha refactorizado para evitar la deuda técnica latente.
