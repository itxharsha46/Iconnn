import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "./",
  server: {
    proxy: {
  '/api-local': {
    target: 'http://localhost:86',
    changeOrigin: true,
    secure: false,
    // Ensure this matches exactly what the backend expects
    rewrite: (path) => path.replace(/^\/api-local/, '') 
  },
},
  },
});