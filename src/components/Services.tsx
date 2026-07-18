import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import portfolioData from '@/data/portfolio.json';

interface Service {
  title: string;
  description: string;
  highlights?: string[];
}

const Services: React.FC = () => {
  const services: Service[] = portfolioData.services || [];
  
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-20 bg-muted/30 dark:bg-dark-background/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Services I Offer</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Tailored software development and engineering solutions to solve complex problems
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={services[0]?.title} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="flex flex-wrap h-auto gap-2 p-1 bg-muted dark:bg-dark-card border border-border rounded-lg">
                {services.map((service) => (
                  <TabsTrigger 
                    key={service.title} 
                    value={service.title}
                    className="px-4 py-2 text-sm font-medium transition-all"
                  >
                    {service.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {services.map((service, index) => (
              <TabsContent key={index} value={service.title} className="mt-0 animate-fade-in">
                <Card className="border border-border dark:bg-dark-card shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    {service.highlights && service.highlights.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4 text-primary">Key Capabilities:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span className="text-primary mt-1 text-base">✓</span>
                              <span className="leading-normal">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Services;
