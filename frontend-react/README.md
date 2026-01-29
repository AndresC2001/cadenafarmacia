# FarmaApp Frontend - React + Vite

Este es el frontend moderno desarrollado en React con TypeScript y Vite, replicando toda la funcionalidad del frontend original en HTML/JS vanilla.

## 🚀 Características

- **React 18** con TypeScript para type-safety
- **Vite** para desarrollo rápido y builds optimizados
- **TanStack Query** para manejo eficiente de estado del servidor
- **Axios** para llamadas HTTP
- **Context API** para autenticación global
- **Hooks personalizados** para cada módulo (catálogo, inventario, ventas)
- **Componentes reutilizables** y arquitectura modular
- **Responsive design** idéntico al original
- **Variables de entorno** configurables vía Docker

## 📦 Funcionalidades Implementadas

✅ **Autenticación**: Login, JWT tokens, roles de usuario
✅ **Gestión de Catálogo**: CRUD completo de productos
✅ **Gestión de Inventario**: Control de stock
✅ **Gestión de Ventas**: Registro y seguimiento
✅ **Variables de entorno**: Configurables vía Docker

## 🚦 Uso

```bash
# Desarrollo
npm run dev

# Producción con Docker
docker-compose up --build frontend-react
```

**Puerto**: 3001 (original en 3000)
**URL del servidor auth**: Configurable vía `AUTH_SERVER_URL`

¡Frontend React completamente funcional y listo para producción! 🎉

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
