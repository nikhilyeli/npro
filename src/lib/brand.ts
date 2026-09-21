import { useSyncExternalStore } from 'react';
import { BASE_PATH, BRAND_IDS, DEFAULT_BRAND, type BrandId } from './brandIds';

export { BASE_PATH, DEFAULT_BRAND, type BrandId };

// Brand themes sit on a separate axis from light/dark mode:
//   <html data-theme="microsoft" class="dark">
// "signal" is the default and has no data-theme attribute.
// The ROUTE decides the theme (/npro = Signal, /npro/microsoft = Microsoft); see src/pages/SiteRoute.tsx.

export interface BrandInfo {
  id: BrandId;
  label: string;
  description: string;
  // Preview swatch only (shown in the switcher regardless of the active theme)
  swatch: [string, string];
}

export const BRANDS: BrandInfo[] = [
  { id: 'signal', label: 'Signal', description: 'Default: teal and violet', swatch: ['#26C5B0', '#9D70EB'] },
  { id: 'microsoft', label: 'Microsoft', description: 'Visual Studio purple, Fluent-inspired', swatch: ['#5C2D91', '#0078D4'] },
  { id: 'anthropic', label: 'Anthropic', description: 'Warm cream and clay, editorial serif', swatch: ['#B4532F', '#3F6E99'] },
];

// Themes that need a web font the default theme doesn't load. Loaded once, when the theme is first applied.
const BRAND_FONT_URLS: Partial<Record<BrandId, string>> = {
  anthropic: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap',
};

const loadBrandFonts = (id: BrandId) => {
  const href = BRAND_FONT_URLS[id];
  if (!href || document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

export const isBrandId = (value: unknown): value is BrandId => BRAND_IDS.some(id => id === value);

export const routeFor = (id: BrandId) => (id === DEFAULT_BRAND ? BASE_PATH : `${BASE_PATH}/${id}`);

/* ------------------------------ Applied theme ------------------------------ */

const THEME_EVENT = 'npro-brand-change';

export const applyBrand = (id: BrandId) => {
  if (id === DEFAULT_BRAND) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = id;
  loadBrandFonts(id);
  window.dispatchEvent(new Event(THEME_EVENT));
};

export const getBrand = (): BrandId => {
  const current = document.documentElement.dataset.theme;
  return isBrandId(current) ? current : DEFAULT_BRAND;
};

const subscribeTheme = (onChange: () => void) => {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
};

// Re-renders the caller whenever the brand theme changes
export const useBrand = (): BrandId => useSyncExternalStore(subscribeTheme, getBrand, () => DEFAULT_BRAND);

/* ------------------------- Theme tools flag (dev only) -------------------------
   The theme switcher button and the terminal `theme` command exist only when this is on:
   1. build/dev env var VITE_THEME_SWITCHER=true (a Windows env var on the dev machine), or
   2. a runtime unlock from the browser DevTools console: npro.unlockThemes()
   Production builds (GitHub Actions) set the env var to false, so themes are route-only there. */

const UNLOCK_KEY = 'npro-unlock-themes';
const UNLOCK_EVENT = 'npro-unlock-change';

const buildFlag = () => import.meta.env.VITE_THEME_SWITCHER === 'true';

const runtimeFlag = () => {
  try {
    return localStorage.getItem(UNLOCK_KEY) === 'true';
  } catch {
    return false;
  }
};

export const isThemeSwitcherEnabled = () => buildFlag() || runtimeFlag();

const subscribeUnlock = (onChange: () => void) => {
  window.addEventListener(UNLOCK_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(UNLOCK_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

export const useThemeSwitcherEnabled = (): boolean => useSyncExternalStore(subscribeUnlock, isThemeSwitcherEnabled, () => false);

/* ------------------------------- Company lock -------------------------------
   Landing on a company route (/npro/microsoft) locks that browser-tab session to the company,
   so other company routes send the visitor back. It is a discretion feature, not security:
   every variant ships in the same bundle. */

const LOCK_KEY = 'npro-company-lock';

export const getCompanyLock = (): BrandId | null => {
  try {
    const value = sessionStorage.getItem(LOCK_KEY);
    return isBrandId(value) && value !== DEFAULT_BRAND ? value : null;
  } catch {
    return null;
  }
};

export const setCompanyLock = (id: BrandId) => {
  try {
    sessionStorage.setItem(LOCK_KEY, id);
  } catch {
    // Storage blocked: the route still picks the theme, the lock just won't hold.
  }
};

export const clearCompanyLock = () => {
  try {
    sessionStorage.removeItem(LOCK_KEY);
  } catch {
    // ignore
  }
};

/* ----------------------------- DevTools console API -----------------------------
   Type these in the browser console (F12):
     npro.unlockThemes()   show the switcher + enable the terminal `theme` command
     npro.lockThemes()     back to route-only (no effect if the build flag is true)
     npro.status()         what is on and which theme/lock is active */

interface NproDevTools {
  unlockThemes: () => string;
  lockThemes: () => string;
  status: () => Record<string, unknown>;
}

declare global {
  interface Window {
    npro?: NproDevTools;
  }
}

const notifyUnlockChange = () => window.dispatchEvent(new Event(UNLOCK_EVENT));

export const installDevTools = () => {
  window.npro = {
    unlockThemes: () => {
      try {
        localStorage.setItem(UNLOCK_KEY, 'true');
      } catch {
        return 'Could not unlock: browser storage is blocked.';
      }
      clearCompanyLock();
      notifyUnlockChange();
      return 'Theme tools unlocked: use the palette button or the terminal command "theme".';
    },
    lockThemes: () => {
      try {
        localStorage.removeItem(UNLOCK_KEY);
      } catch {
        // ignore
      }
      notifyUnlockChange();
      return buildFlag()
        ? 'The build flag VITE_THEME_SWITCHER=true is on, so the theme tools stay available.'
        : 'Theme tools locked: themes are route-based only.';
    },
    status: () => ({
      themeToolsEnabled: isThemeSwitcherEnabled(),
      buildFlag: buildFlag(),
      runtimeUnlock: runtimeFlag(),
      theme: getBrand(),
      companyLock: getCompanyLock(),
    }),
  };
};
