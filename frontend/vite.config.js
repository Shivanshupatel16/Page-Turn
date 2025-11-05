import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 makes "@" point to src folder
    },
  },
  server: {
  proxy: {
    '/api': {
      target: 'https://page-turn-2.onrender.com/',
      changeOrigin: true,
    },
    '/uploads': {
      target: 'https://page-turn-2.onrender.com/',
      changeOrigin: true,
    },
  },
},
})
