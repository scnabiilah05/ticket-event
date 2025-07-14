import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file sesuai mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react()
    ],
    server: {
      port: 5200,
      host: true
    },
    build: {
      outDir: env.VITE_OUTDIR // gunakan env yang sudah di-load
    }
  }
})

