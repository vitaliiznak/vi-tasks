import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import vitePluginImp from 'vite-plugin-imp'
import alias from '@rollup/plugin-alias'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  plugins: [
    alias(),
    reactRefresh(),
    // vitePluginImp({
    //   optimize: true,
    //   libList: [
    //     {
    //       libName: 'antd',
    //       libDirectory: 'es',
    //       style: (name) => `antd/es/${name}/style`
    //     }
    //   ]
    // }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],

  resolve: {
    alias: {
      '~/': path.join(process.cwd(), 'node_modules/'),
      '@src': path.resolve(__dirname, './src')
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 支持内联 JavaScript

      }
    }
  },
})