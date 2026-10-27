import React, { useLayoutEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { COMPANY_BRAND_IDS, ROUTE_ALIASES } from '@/lib/brandIds';
import {
  DEFAULT_BRAND,
  type BrandId,
  applyBrand,
  clearCompanyLock,
  getCompanyLock,
  routeFor,
  setCompanyLock,
  useThemeSwitcherEnabled,
} from '@/lib/brand';

// One route element for /npro and /npro/:company, so moving between themes never remounts the page.
//   /npro            -> Signal
//   /npro/microsoft  -> Microsoft, and the session is locked to that company
//   /npro/gemini     -> an alias: resolves to the same brand as /npro/google, then canonicalizes the URL
// Whether a route 404s depends only on the route/alias tables (COMPANY_BRAND_IDS / ROUTE_ALIASES) —
// never on the session lock. Locked sessions are sent back to their company, whether they typed the
// canonical name or an alias for a different one. The lock is ignored while the theme tools are on.
const SiteRoute: React.FC = () => {
  const { company } = useParams();
  const themeToolsOn = useThemeSwitcherEnabled();

  const isKnownId = company !== undefined && COMPANY_BRAND_IDS.some(id => id === company);
  const aliasTarget = company !== undefined && !isKnownId ? ROUTE_ALIASES[company.toLowerCase()] : undefined;

  // null = not a known company route AND not a recognized alias -> 404, regardless of any lock.
  const brand: BrandId | null = company === undefined ? DEFAULT_BRAND : isKnownId ? (company as BrandId) : aliasTarget ?? null;
  const lock = themeToolsOn ? null : getCompanyLock();
  const blocked = brand !== null && lock !== null && brand !== lock;

  useLayoutEffect(() => {
    if (brand === null) {
      // Unknown route: keep a locked visitor in their company's look instead of switching themes
      applyBrand(lock ?? DEFAULT_BRAND);
      return;
    }
    if (blocked) return;
    applyBrand(brand);
    if (themeToolsOn) clearCompanyLock();
    else if (brand !== DEFAULT_BRAND) setCompanyLock(brand);
  }, [brand, blocked, themeToolsOn, lock]);

  if (brand === null) return <NotFound />;
  if (blocked && lock) return <Navigate to={routeFor(lock)} replace />;
  if (aliasTarget !== undefined) return <Navigate to={routeFor(aliasTarget)} replace />;
  return <Index />;
};

export default SiteRoute;
