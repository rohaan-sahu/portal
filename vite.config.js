import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          privy: ['@privy-io/react-auth']
        }
      }
    }
  },
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      util: 'util'
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    process: {
      env: {},
      version: '',
      browser: true
    }
  },
  optimizeDeps: {
    include: ['buffer', 'util', '@coinbase/wallet-sdk']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      }
    },
    mimeTypes: {
      'js': 'application/javascript',
      'mjs': 'application/javascript',
      'json': 'application/json'
    }
  }
});
