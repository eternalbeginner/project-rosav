import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [react(), legacy({ targets: ['defaults', 'not IE 11'] })],
  server: { port: 3000 },
  resolve: {
    alias: {
      components: '/src/components',
      hooks: '/src/hooks',
      libs: '/src/libs',
      providers: '/src/providers',
      routes: '/src/app',
    },
  },
});
