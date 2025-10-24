import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    allowedHosts: true, // ✅ allow all hosts (zrok/ngrok/etc.)
    host: true          // ✅ listen on 0.0.0.0 so tunnels & LAN work
  }
})
