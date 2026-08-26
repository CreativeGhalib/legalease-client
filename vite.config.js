import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },

    build: {
      // Increase warning threshold slightly — recharts alone is ~250kb
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // Split large dependencies into separate cached chunks.
          // Browsers can cache vendor/charts independently of app code,
          // so a code change doesn't bust the recharts cache.
          // Vite 6 (rolldown) requires manualChunks as a function, not an object.
          // Each large dependency gets its own cached chunk — a code change in app
          // code won't bust the recharts or react-dom browser cache.
          manualChunks(id) {
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
              return 'charts'
            }
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'query'
            }
            if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
              return 'router'
            }
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'vendor'
            }
          },
        },
      },
    },

    test: {
      environment: 'jsdom',
      globals: true,
      exclude: ['**/node_modules/**', 'dist/**', 'e2e/**'],
    },
  }
})
