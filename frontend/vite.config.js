import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 이 부분을 추가하여 'global is not defined' 오류를 해결합니다.
  define: {
    global: 'globalThis',
  },
  // 서버 및 프록시 설정
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
})