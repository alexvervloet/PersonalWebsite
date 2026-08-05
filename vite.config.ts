import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // The SSR bundle exists only so prerender.mjs can import render(). Copying
    // public/ into it would duplicate every generated dive page for nothing.
    copyPublicDir: !isSsrBuild,
  },
}))
