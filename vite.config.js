import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allows access from your local network
    port: 3000, // Optional: Choose the port you want to use
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist",
  },
  base: "/", // Ensures correct base path
});
