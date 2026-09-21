import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import TerminalPet, { PET_FOR_BRAND } from '@/components/TerminalPet';
import { BASE_PATH, getCompanyLock, routeFor, useBrand } from '@/lib/brand';

// Shown for any unknown route. It never links to another company's page: "home" is the visitor's own
// route (their company if the session is locked, the default page otherwise).
const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const brand = useBrand();
  const lock = getCompanyLock();
  const home = lock ? routeFor(lock) : BASE_PATH;
  const pet = PET_FOR_BRAND[brand];

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  const lines = [
    { text: `> resolve "${location.pathname}"`, delay: 300 },
    { text: '> status: 404 Not Found', delay: 900 },
    { text: '> suggestion: it might have moved, or never existed', delay: 1500 },
    { text: '> recovery: go back home', delay: 2100 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to={home} className="flex items-center gap-4" aria-label="nPro home">
          <Logo size="sm" variant="minimal" />
          <span className="font-mono text-lg font-bold">nPro</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Error 404</p>
        <h1 className="text-gradient mt-2 text-[clamp(5rem,20vw,10rem)] font-bold leading-none">404</h1>
        <h2 className="mt-4 text-section-title font-semibold">This page took a wrong turn</h2>
        <p className="mt-3 max-w-md text-muted-foreground">
          We couldn't find <code className="break-all rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{location.pathname}</code>. Let's get you back on track.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link to={home}>Back to home</Link>
          </Button>
          <Button size="lg" variant="outline" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(home))}>
            Go back
          </Button>
        </div>

        <div className="mt-12 w-full max-w-xl overflow-hidden rounded-lg border border-border bg-terminal-bg text-left text-terminal-fg shadow-xl">
          <div className="flex items-center gap-2 border-b border-border bg-black/40 px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-terminal-red" />
            <span className="h-3 w-3 rounded-full bg-terminal-yellow" />
            <span className="h-3 w-3 rounded-full bg-terminal-green" />
            <span className="ml-3 font-mono text-xs opacity-70">system ~ routing</span>
          </div>
          <div className="min-h-[9.5rem] p-5 font-mono text-sm" aria-hidden="true">
            {lines.map(line => (
              <div key={line.text} className="mb-1.5 break-all opacity-0 animate-fade-in" style={{ animationDelay: `${line.delay}ms`, animationFillMode: 'forwards' }}>
                {line.text}
              </div>
            ))}
            <div className="mt-3 flex items-center">
              <span className="mr-2 text-terminal-prompt">{'>'}</span>
              <span className="console-cursor" />
            </div>
          </div>
          {pet && <TerminalPet kind={pet} />}
        </div>
      </main>
    </div>
  );
};

export default NotFound;
