import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/{index,run}.ts'],
  platform: 'node',
  dts: true,
  unused: {
    level: 'error',
    ignore: [
      'typescript', // Yarn PnP
    ],
  },
  exports: true,
  onSuccess() {
    console.info('🙏 Build succeeded!')
  },
})
