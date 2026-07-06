import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // plotly.js-dist-min(대형 UMD 번들)을 개발 서버에서 미리 최적화
  optimizeDeps: {
    include: ['plotly.js-dist-min', 'react-plotly.js'],
  },
})
