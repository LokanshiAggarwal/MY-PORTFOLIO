import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import apiPlugin from './vite-plugin-api.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env into process.env so the local API middleware can read the
// Gmail credentials (server-side only — never exposed to the client).
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GMAIL_USER) process.env.GMAIL_USER = env.GMAIL_USER
  if (env.GMAIL_APP_PASSWORD) process.env.GMAIL_APP_PASSWORD = env.GMAIL_APP_PASSWORD
  if (env.CONTACT_EMAIL) process.env.CONTACT_EMAIL = env.CONTACT_EMAIL

  return {
    plugins: [react(), apiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // Auto-open the site in your default browser when you run `npm run dev`
      open: true,
      // Expose on your local network (also keeps localhost working reliably)
      host: true,
      port: 5173,
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'framer-motion': ['framer-motion'],
            gsap: ['gsap'],
            react: ['react', 'react-dom'],
            icons: ['react-icons', 'lucide-react'],
            lenis: ['lenis'],
            'split-type': ['split-type'],
          },
        },
      },
    },
  }
})
