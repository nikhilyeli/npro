import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { COMPANY_BRAND_IDS } from "./src/lib/brandIds";

// Company routes for GitHub Pages (a static host with no SPA fallback):
//  - injects the company ids into the pre-paint theme script in index.html
//  - after a build, writes dist/<company>/index.html for every company (so /npro/microsoft/ loads directly)
//    and dist/404.html (unknown paths load the app, which shows its own Not Found page)
const brandRoutes = (): Plugin => {
  let isBuild = false;
  return {
    name: "npro-brand-routes",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    transformIndexHtml(html) {
      return html.replace(/__COMPANY_BRANDS__/g, JSON.stringify(COMPANY_BRAND_IDS));
    },
    closeBundle() {
      if (!isBuild) return;
      const dist = path.resolve(__dirname, "dist");
      const indexFile = path.join(dist, "index.html");
      if (!fs.existsSync(indexFile)) return;
      fs.copyFileSync(indexFile, path.join(dist, "404.html"));
      for (const id of COMPANY_BRAND_IDS) {
        fs.mkdirSync(path.join(dist, id), { recursive: true });
        fs.copyFileSync(indexFile, path.join(dist, id, "index.html"));
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/npro", // Base URL for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), brandRoutes(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
