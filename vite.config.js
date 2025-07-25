import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  daisyui: {
    themes: ["light"], // ✅ force light mode
    extend: {
      scrollBehavior: ["responsive"],
    },
  },
  // vite.config.js
  assetsInclude: ["**/*.ttf"],
});
