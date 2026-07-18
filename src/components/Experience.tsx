import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import portfolioData from '@/data/portfolio.json';

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  type: 'work' | 'education';
  
  // New properties
  jobTitle?: string;
  role?: string;
  workMode?: string;
  employmentMode?: string;
  place?: string;
}

const Experience: React.FC = () => {
  const timelineItems: TimelineItem[] = portfolioData.experience as TimelineItem[];

  return (
    <section id="experience" className="py-20 bg-muted/50 dark:bg-dark-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Experience & Education</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="work">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="work">Work Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="work" className="mt-0">
              <div className="relative pl-8 border-l-2 border-muted">
                {timelineItems
                  .filter(item => item.type === 'work')
                  .map((item) => (
                    <div key={item.id} className="mb-12 relative animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                      <div className="absolute -left-10 p-2 bg-background dark:bg-dark-background rounded-full border-2 border-primary -mt-1">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                      </div>
                      
                      <div className="-mt-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">{item.period}</Badge>
                          {item.place && <Badge variant="secondary">{item.place}</Badge>}
                          {item.workMode && (
                            <Badge variant="default" className="bg-brand-blue hover:bg-brand-blue/90 text-white capitalize">
                              {item.workMode}
                            </Badge>
                          )}
                          {item.employmentMode && (
                            <Badge variant="outline" className="capitalize border-brand-green/30 text-brand-green bg-brand-green/5 dark:bg-brand-green/10">
                              {item.employmentMode.replace('-', ' ')}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">
                          {item.jobTitle && item.role ? `${item.jobTitle} - ${item.role}` : item.title}
                        </h3>
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">{item.organization}</h4>
                        
                        <Card className="mt-4">
                          <CardContent className="p-4">
                            {item.description && <p className="mb-4 text-foreground/90">{item.description}</p>}
                            
                            {item.highlights && (
                              <div className="mb-4">
                                <h5 className="font-semibold mb-2 text-primary">Key Achievements:</h5>
                                <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
                                  {item.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed">{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {item.technologies && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {item.technologies.map(tech => (
                                  <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-0">
              <div className="relative pl-8 border-l-2 border-muted">
                {timelineItems
                  .filter(item => item.type === 'education')
                  .map((item) => (
                    <div key={item.id} className="mb-12 relative animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                      <div className="absolute -left-10 p-2 bg-background dark:bg-dark-background rounded-full border-2 border-primary -mt-1">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                      </div>
                      
                      <div className="-mt-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">{item.period}</Badge>
                          {item.place && <Badge variant="secondary">{item.place}</Badge>}
                        </div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">{item.organization}</h4>
                        
                        <Card className="mt-4">
                          <CardContent className="p-4">
                            {item.description && <p className="mb-4 text-foreground/90">{item.description}</p>}
                            
                            {item.highlights && (
                              <div>
                                <ul className="space-y-1.5 text-foreground/80 list-disc list-inside">
                                  {item.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed">{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Experience;
