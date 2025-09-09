import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          privy: ['@privy-io/react-auth'],
          coinbase: ['@coinbase/wallet-sdk'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      util: 'util',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    process: {
      env: {},
      version: '',
      browser: true,
    },
  },
  optimizeDeps: {
    include: ['buffer', 'util', '@coinbase/wallet-sdk', '@privy-io/react-auth'],
    exclude: [],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
    },
    mimeTypes: {
      'js': 'application/javascript',
      'mjs': 'application/javascript',
      'json': 'application/json',
    },
  },
});