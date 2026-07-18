
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Terminal-style 404 animation
  const terminalLines = [
    { content: "> Accessing route...", delay: 0 },
    { content: `> Route "${location.pathname}" not found`, delay: 800 },
    { content: "> Error code: 404", delay: 1200 },
    { content: "> Initiating recovery sequence...", delay: 1600 },
    { content: "> Recovery options: Return to home", delay: 2000 },
  ];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>
        
        <div className="bg-console-bg text-console-text rounded-lg overflow-hidden border border-border shadow-xl">
          <div className="bg-black/40 flex items-center px-4 py-2 border-b border-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-red"></div>
              <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
              <div className="w-3 h-3 rounded-full bg-brand-green"></div>
            </div>
            <div className="ml-4 text-xs opacity-70">system ~ error</div>
          </div>
          
          <div className="font-mono text-sm p-6 min-h-[200px]">
            {terminalLines.map((line, i) => (
              <div 
                key={i}
                className="mb-2 flex console-text-animated opacity-0"
                style={{ 
                  animationDelay: `${line.delay}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {line.content}
              </div>
            ))}
            <div className="mt-6 flex items-center">
              <span className="mr-2 text-brand-green">{'>'}</span>
              <span className="console-cursor"></span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
