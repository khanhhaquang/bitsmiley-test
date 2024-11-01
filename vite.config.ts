import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'sats-connect': path.resolve(
          __dirname,
          './node_modules/@sats-connect/core'
        )
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    define: {
      global: 'globalThis'
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    plugins: [
      wasm(),
      topLevelAwait(),
      nodePolyfills({
        include: ['process', 'stream']
      }),
      svgr({ include: '**/*.svg' }),
      react()
    ],
    worker: {
      plugins: () => [wasm(), topLevelAwait()]
    },
    optimizeDeps: {
      exclude: ['tiny-secp256k1']
    }
  })
}
