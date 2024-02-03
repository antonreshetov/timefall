import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

const pathSrc = path.resolve(__dirname, './src/renderer')

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: [`${pathSrc}/components`],
      extensions: ['vue'],
      dts: true,
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
})
