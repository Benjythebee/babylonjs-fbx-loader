import { defineConfig } from 'vite'
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
        build: {
            lib: {
                entry: resolve(__dirname, 'test-scene', 'index'),
                name: 'babylonjs-fbx-loader',
                formats: ['umd'],
                fileName: () => '[name].js',
            },
            outDir: resolve(__dirname, 'test-scene'),
            sourcemap: true,
            watch:{
                include: ['test-scene/**', 'src/**'],
            },
            rollupOptions: {
                output: {
                    // Manual chunks for vendor code splitting
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                    },
                },
            },
        },
        plugins:[
            nodePolyfills()
        ],
      // dev specific config
      server:{
        open:'test-scene/index.html'
      }
    }
  } else {
    // command === 'build'
    return {
        plugins:[
            nodePolyfills(),
            dts(),
        ],
        build:{
            lib: {
                entry: resolve(__dirname, 'src', 'index.ts'),
                name: 'VRMLoader',
                formats: ['umd', 'umd'], // We'll customize each via rollupOptions
            },
            rollupOptions: {
                // External dependencies (for both builds)
                external: (id) => {
                    // For UMD npm build, externalize all @babylonjs
                    // For global build, externalize all @babylonjs
                    return /^@babylonjs/.test(id);
                },
                output: [
                    // Build 1: UMD for npm
                    {
                        format: 'umd',
                        name: 'babylonjs-fbx-loader',
                        entryFileNames: 'index.module.js',
                        dir: resolve(__dirname, 'dist'),
                        globals: {
                            // Simple external mapping - not resolved to globals in UMD npm build
                        },
                    },
                    // Build 2: UMD for browser globals
                    {
                        format: 'umd',
                        name: 'FBXLoader',
                        entryFileNames: 'index.js',
                        dir: resolve(__dirname, 'dist'),
                        globals: (id) => {
                            // Map @babylonjs packages to global variables
                            if (/^@babylonjs\/core/.test(id)) {
                            return 'BABYLON';
                            }
                            if (/^@babylonjs\/loaders/.test(id)) {
                            return 'LOADERS';
                            }
                            return id;
                        },
                    },
                ],
            },
        }
  }
}
})