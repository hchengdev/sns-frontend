import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    host: true,
    port: 3002,
    proxy: {
      '/apihost': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apihost/, ''),
      },
      '/socket.io': {
        target: 'http://localhost:8089', // Địa chỉ máy chủ Socket.io
        changeOrigin: true,
        ws: true, // Bật WebSocket proxy
      },
    },
  },
  resolve: {
    alias: {
      global: 'global/window',
    },
  },
  define: {
    global: {},
  },
});
