
import React from 'react';
import { cn } from '@/lib/utils';

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
  
  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-md bg-gradient-to-br from-brand-green to-brand-blue',
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
        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-brand-red animate-pulse-light" />
      )}
    </div>
  );
};

export default Logo;
