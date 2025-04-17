import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@styles": resolve(__dirname, "./src/styles"),
      "@models": resolve(__dirname, "./src/models")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});