import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://business-mbjc6y11.b4a.run',
        changeOrigin: true,
      },
    },
  },
  // Restart server
})
