import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
      { find: "@hc1/design-system/styles", replacement: resolve(__dirname, "./src/design-system/tokens/css/variables.css") },
      { find: "@hc1/design-system", replacement: resolve(__dirname, "./src/design-system") },
    ],
  },
});
