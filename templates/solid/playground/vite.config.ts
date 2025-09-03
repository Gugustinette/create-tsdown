import solidPlugin from 'vite-plugin-solid'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './playground',
  plugins: [solidPlugin()],
})
