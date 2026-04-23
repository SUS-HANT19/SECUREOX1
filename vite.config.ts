import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * HTTPS and Security Configuration:
 *
 * Development:
 * - Vite dev server runs on HTTP (localhost only)
 * - For HTTPS in dev, run: vite --https
 *
 * Production:
 * - Deploy to HTTPS-enabled hosting (Vercel, Netlify, etc.)
 * - Configure security headers at CDN/server level
 * - See src/lib/security.ts for recommended headers
 *
 * Data Protection:
 * - All Supabase API calls use HTTPS automatically
 * - Encryption keys never leave the client
 * - Sensitive data encrypted before storage
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // For HTTPS in development, uncomment the following:
    // https: true,
  },
  publicDir: false,
  build: {
    // Security-focused build options
    sourcemap: false, // Disable sourcemaps in production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming for caching
        manualChunks: undefined,
      },
    },
  },
});
