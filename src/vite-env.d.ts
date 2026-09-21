/// <reference types="vite/client" />

interface ImportMetaEnv {
  // "true" shows the theme switcher and the terminal `theme` command. See .env
  readonly VITE_THEME_SWITCHER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
