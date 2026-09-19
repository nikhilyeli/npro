import React from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, description }) => (
  <div className="text-center mb-12">
    <h2 className="text-section-title font-bold mb-2 text-balance">{title}</h2>
    <div className="h-1 w-20 rounded-full bg-primary mx-auto" />
    {description && (
      <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{description}</p>
    )}
  </div>
);

export default SectionHeading;
