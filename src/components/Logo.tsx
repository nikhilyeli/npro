
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { EGG_EVENT, LOGO_EGG, triggerEgg } from '@/lib/easterEggs';
import { useBrand } from '@/lib/brand';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  variant = 'default'
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const brand = useBrand();
  const handleClick = () => triggerEgg(LOGO_EGG[brand]);

  // The Google theme's "doodle" egg gives the logo a quick, friendly wiggle
  const [wiggling, setWiggling] = useState(false);
  const wiggleTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const onEgg = (e: Event) => {
      if ((e as CustomEvent<{ type: string }>).detail?.type !== 'doodle') return;
      setWiggling(true);
      clearTimeout(wiggleTimer.current);
      wiggleTimer.current = setTimeout(() => setWiggling(false), 650);
    };
    window.addEventListener(EGG_EVENT, onEgg);
    return () => {
      window.removeEventListener(EGG_EVENT, onEgg);
      clearTimeout(wiggleTimer.current);
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative flex items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent2 cursor-pointer easteregg-google',
        wiggling && 'animate-[doodle-wiggle_0.6s_ease]',
        sizes[size],
        variant === 'minimal' ? 'p-1' : 'p-2',
        className
      )}
    >
      <span className="text-white font-bold text-center" style={{
        fontSize: size === 'sm' ? '1.25rem' : size === 'md' ? '2rem' : '2.5rem',
      }}>
        N
      </span>
      {variant === 'default' && (
        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-live animate-pulse-light" />
      )}
    </div>
  );
};

export default Logo;
