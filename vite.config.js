import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
  ],
  server: {
    allowedHosts: ['tawasolapp.me', 'www.tawasolapp.me'],
    host: '0.0.0.0',
    port: 5173
  }
});
