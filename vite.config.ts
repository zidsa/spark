import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              groups: [
                { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              ],
            },
          },
        },
      },
    },
  },
  plugins: [
    devtools(),
    tanstackStart({
      spa: { enabled: !['ssr', 'ssg'].includes(mode), prerender: { outputPath: '/index.html' } },
      prerender: { enabled: mode === 'ssg' },
      pages: mode === 'ssg' ? [{ path: '/ar-sa/' }, { path: '/en-sa/' }] : undefined,
    }),
    viteReact(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    globals: true,
    css: true,
    server: {
      deps: {
        inline: ['zod'],
      },
    },
  },
}));

export default config;
