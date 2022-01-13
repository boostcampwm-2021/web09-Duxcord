import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:8000', changeOrigin: true, ws: true },
    },
  },
});
