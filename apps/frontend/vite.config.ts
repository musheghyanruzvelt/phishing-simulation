import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const plugins = [react(), tailwindcss()] as PluginOption[];

export default defineConfig({
  plugins: plugins,
  server: {
    port: 3003,
    host: "localhost",
    proxy: {
      "/api/management": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/attempts/, "/api/attempts"),
      },
      "/api/simulation": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) =>
          path.replace(/^\/api\/simulation/, "/api/simulation"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@phishing-simulation/types": path.resolve(
        __dirname,
        "../../packages/types"
      ),
    },
  },
});
