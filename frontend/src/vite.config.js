import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    define: {
        global: 'globalThis',
    },
    server: {
        port: 5175,
        proxy: {
            '/api': {
                target: 'http://localhost:9001',
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://localhost:9001',
                ws: true,
            }
        }
    }
});