
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Console from '@/components/Console';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Add developer console intro animation
  useEffect(() => {
    console.clear();
    console.log('%c Welcome to my portfolio! ', 'background: #121212; color: #4CAF50; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Feel free to explore the code. There might be some easter eggs hidden around! ', 'color: #2196F3; font-size: 14px;');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background dark:bg-dark-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground font-mono">Initializing portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main>
        <Hero />
        <Console />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      
      <Footer />
      <Toaster />
    </>
  );
};

export default Index;
