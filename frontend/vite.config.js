import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        rimary: '#4f46e5',
        secondary: '#10b981'
      }
    }
  },
  plugins: [
    tailwindcss(),
    react()
  ],
});