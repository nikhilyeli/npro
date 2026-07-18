import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const navItems = [{
    name: 'About',
    href: '#about'
  }, {
    name: 'Skills',
    href: '#skills'
  }, {
    name: 'Projects',
    href: '#projects'
  }, {
    name: 'Experience',
    href: '#experience'
  }, {
    name: 'Achievements',
    href: '#achievements'
  }, {
    name: 'Contact',
    href: '#contact'
  }];
  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 dark:bg-dark-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" variant={isScrolled ? 'default' : 'minimal'} />
          <span className="font-mono font-bold text-lg">nPro</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => <button key={item.name} onClick={() => scrollToSection(item.href)} className="text-sm font-medium hover:text-primary transition-colors">
              {item.name}
            </button>)}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden absolute w-full bg-background dark:bg-dark-background shadow-lg transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
          {navItems.map(item => <button key={item.name} onClick={() => scrollToSection(item.href)} className="text-left py-2 text-sm font-medium hover:text-primary transition-colors">
              {item.name}
            </button>)}
        </div>
      </div>
    </nav>;
};
export default Navbar;