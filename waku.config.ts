import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'waku/config';

export default defineConfig({
  vite: {
    server: {
      watch: {
        // Avoid watch loops from Waku's generated route types file.
        ignored: ['**/src/pages.gen.ts', '**\\src\\pages.gen.ts'],
      },
    },
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
    ],
  },
});
