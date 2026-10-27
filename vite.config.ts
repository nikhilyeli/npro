import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { COMPANY_BRAND_IDS, ROUTE_ALIASES } from "./src/lib/brandIds";

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
      return html
        .replace(/__COMPANY_BRANDS__/g, JSON.stringify(COMPANY_BRAND_IDS))
        .replace(/__ROUTE_ALIASES__/g, JSON.stringify(ROUTE_ALIASES));
    },
    closeBundle() {
      if (!isBuild) return;
      const dist = path.resolve(__dirname, "dist");
      const indexFile = path.join(dist, "index.html");
      if (!fs.existsSync(indexFile)) return;
      fs.copyFileSync(indexFile, path.join(dist, "404.html"));
      const baseHtml = fs.readFileSync(indexFile, "utf-8");
      for (const id of COMPANY_BRAND_IDS) {
        fs.mkdirSync(path.join(dist, id), { recursive: true });
        // Bake the theme's favicon into the static entry too, so a hard load or crawler visit
        // (no JS pre-paint script run yet) still gets the right tab icon on first paint.
        const themedHtml = baseHtml.replace(/(id="favicon-svg"[^>]*href=")([^"]*\/)favicon\.svg(")/, `$1$2favicon-${id}.svg$3`);
        fs.writeFileSync(path.join(dist, id, "index.html"), themedHtml);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/npro", // Base URL for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), brandRoutes()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
