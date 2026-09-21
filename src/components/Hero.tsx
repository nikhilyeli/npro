import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import portfolioData from '@/data/portfolio.json';

const Hero: React.FC = () => {
  const [currentTitle, setCurrentTitle] = useState(0);
  const titles = portfolioData.hero.titles;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle(prev => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [titles.length]);
  return <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background -z-10" />

      {/* Moving Background Shapes — the two brand hues, kept to a considered pair */}
      <div className="absolute inset-0 overflow-hidden -z-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent2/5 dark:bg-accent2/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }} />
      </div>
      
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center z-10">
        <div className="animate-fade-in">
          <Logo size="lg" />
        </div>
        
        <h1 className="mt-8 text-display text-balance">
          <span className="block">Hi, I'm {portfolioData.personalInfo.name}</span>
          {/* Titles share one grid cell so the box is always as tall as the longest (wrapped) title */}
          <div className="grid overflow-hidden mt-2" aria-live="polite">
            {titles.map((title, index) => <div key={title} aria-hidden={currentTitle !== index} className="transition-all duration-500 transform [grid-area:1/1]" style={{
            opacity: currentTitle === index ? 1 : 0,
            transform: `translateY(${(index - currentTitle) * 100}%)`
          }}>
                <span className="text-gradient">{title}</span>
              </div>)}
          </div>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
          {portfolioData.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button size="lg" onClick={() => document.querySelector('#projects')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            View Projects
          </Button>
          <Button size="lg" variant="outline" onClick={() => document.querySelector('#contact')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Get in Touch
          </Button>
        </div>
        
        <button type="button" aria-label="Scroll to About" className="mt-16 rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => document.querySelector('#about')?.scrollIntoView({
        behavior: 'smooth'
      })}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>;
};
export default Hero;