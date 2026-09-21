import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { BRANDS, isBrandId, routeFor, useBrand, useThemeSwitcherEnabled } from '@/lib/brand';

// Dev/testing tool: jumps between the theme routes (/npro, /npro/microsoft, ...).
// Renders nothing unless the theme tools are on (VITE_THEME_SWITCHER=true or npro.unlockThemes()).
// Light/dark mode stays with <ThemeToggle />.
const BrandSwitcher: React.FC = () => {
  const brand = useBrand();
  const enabled = useThemeSwitcherEnabled();
  const navigate = useNavigate();

  if (!enabled) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Change theme">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={brand} onValueChange={value => isBrandId(value) && navigate(routeFor(value))}>
          {BRANDS.map(item => (
            <DropdownMenuRadioItem key={item.id} value={item.id} className="items-start py-2">
              <span className="flex flex-col">
                <span className="flex items-center gap-2 font-medium">
                  <span className="flex" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full" style={{ background: item.swatch[0] }} />
                    <span className="-ml-1 h-3 w-3 rounded-full" style={{ background: item.swatch[1] }} />
                  </span>
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BrandSwitcher;
