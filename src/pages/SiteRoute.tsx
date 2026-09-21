import React, { useLayoutEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { COMPANY_BRAND_IDS } from '@/lib/brandIds';
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
// Locked sessions are sent back to their company. The lock is ignored while the theme tools are on.
const SiteRoute: React.FC = () => {
  const { company } = useParams();
  const themeToolsOn = useThemeSwitcherEnabled();

  // null = not a known company route
  const brand: BrandId | null = company === undefined ? DEFAULT_BRAND : COMPANY_BRAND_IDS.find(id => id === company) ?? null;
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
  return <Index />;
};

export default SiteRoute;
